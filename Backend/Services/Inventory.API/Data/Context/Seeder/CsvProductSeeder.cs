using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using EFCore.BulkExtensions;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Context.Seeder;

public class CsvProductSeeder(InventoryDbContext context)
{
    public async Task SeedFromCsv(string csvFilePath)
    {
        var categoryCache = await context.Set<Category>()
            .ToDictionaryAsync(c => c.PolishName.ToLower(), c => c);

        var categoriesToInsert = new List<Category>();
        var uniqueNewCategories = new HashSet<string>();

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            Delimiter = "\t",
            BadDataFound = null,
            MissingFieldFound = null,
            HeaderValidated = null
        };

        using (var reader = new StreamReader(csvFilePath))
        using (var csv = new CsvReader(reader, config))
        {
            await csv.ReadAsync();
            csv.ReadHeader();

            while (await csv.ReadAsync())
            {
                var rawCats = GetBestCategoryString(csv);
                if (string.IsNullOrEmpty(rawCats)) continue;

                foreach (var catName in rawCats.Split(','))
                {
                    var cleanName = CleanCategoryName(catName);
                    if (string.IsNullOrEmpty(cleanName)) continue;
                    
                    var lowerName = cleanName.ToLower();
                    
                    if (!categoryCache.ContainsKey(lowerName) && !uniqueNewCategories.Contains(lowerName))
                    {
                        var newCat = new Category
                        {
                            Id = Guid.NewGuid(),
                            PolishName = cleanName,
                            EnglishName = ""
                        };
                        categoriesToInsert.Add(newCat);
                        uniqueNewCategories.Add(lowerName);
                        
                        categoryCache[lowerName] = newCat;
                    }
                }
            }
        }

        // Bulk Insert new categories
        if (categoriesToInsert.Any())
        {
            var strategy = context.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await context.Database.BeginTransactionAsync();
                try
                {
                    await context.BulkInsertAsync(categoriesToInsert);
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }
        
        var productsBuffer = new List<Product>();
        
        using (var reader = new StreamReader(csvFilePath))
        using (var csv = new CsvReader(reader, config))
        {
            await csv.ReadAsync();
            csv.ReadHeader();

            while (await csv.ReadAsync())
            {
                var countries = csv.GetField("countries_en")?.ToLower();
                if (string.IsNullOrEmpty(countries) || !countries.Contains("poland")) continue;

                var name = csv.GetField("product_name");
                var code = csv.GetField("code");
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(code)) continue;

                var rawBrand = csv.GetField("brands") ?? "Unknown";
                var safeBrand = rawBrand.Length > 100 ? rawBrand.Substring(0, 100) : rawBrand;

                var imageUrl = csv.GetField("image_url");
                if (string.IsNullOrEmpty(imageUrl)) imageUrl = csv.GetField("image_small_url");

                Guid? mainCategoryId = null;
                var rawCats = GetBestCategoryString(csv);

                if (!string.IsNullOrEmpty(rawCats))
                {
                    var splitCats = rawCats.Split(',');
                    foreach (var t in splitCats)
                    {
                        var cleanName = CleanCategoryName(t);
                        if (string.IsNullOrEmpty(cleanName)) continue;

                        if (categoryCache.TryGetValue(cleanName.ToLower(), out var catEntity))
                        {
                            mainCategoryId = catEntity.Id;
                        }
                    }
                }

                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = name.Length > 200 ? name.Substring(0, 200) : name,
                    BarCode = code,
                    Brand = safeBrand,
                    VisualRepresentation = imageUrl ?? "",
                    CreatedBy = "Seed",
                    Scope = ProductScope.Global,
                    
                    MainCategoryId = mainCategoryId,
                    MainCategory = null 
                };

                productsBuffer.Add(product);

                if (productsBuffer.Count >= 5000)
                {
                    await SaveProductsBatch(context, productsBuffer);
                    productsBuffer.Clear();
                }
            }
        }
        
        if (productsBuffer.Any())
        {
            await SaveProductsBatch(context, productsBuffer);
        }
    }
    
    private string CleanCategoryName(string raw)
    {
        var clean = raw.Trim();
        if (clean.Contains(':')) clean = clean.Split(':')[1];
        return clean.Replace("-", " ").Trim();
    }

    private string? GetBestCategoryString(CsvReader csv)
    {
        var c = csv.GetField("categories");
        if (string.IsNullOrEmpty(c)) c = csv.GetField("categories_tags");
        if (string.IsNullOrEmpty(c)) c = csv.GetField("main_category");
        return c;
    }

    private async Task SaveProductsBatch(InventoryDbContext db, List<Product> products)
    {
        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await db.Database.BeginTransactionAsync();
            try
            {
                await db.BulkInsertAsync(products);
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        });
    }
}