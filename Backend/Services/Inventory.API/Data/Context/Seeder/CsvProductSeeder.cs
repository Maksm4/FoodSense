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
        var strategy = context.Database.CreateExecutionStrategy();
        var categoryCache = await context.Set<Category>()
            .ToDictionaryAsync(c => c.PolishName.ToLower(), c => c);

        var productsBuffer = new List<Product>();
        
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
                var countries = csv.GetField("countries_en")?.ToLower();
                if (string.IsNullOrEmpty(countries) || !countries.Contains("poland")) continue;

                var name = csv.GetField("product_name");
                var code = csv.GetField("code");
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(code)) continue;

                var rawBrand = csv.GetField("brands") ?? "Unknown";
                var safeBrand = rawBrand.Length > 100 ? rawBrand.Substring(0, 100) : rawBrand;
                
                var imageUrl = csv.GetField("image_url");
                if (string.IsNullOrEmpty(imageUrl)) imageUrl = csv.GetField("image_small_url");

                var productCategories = new List<Category>();
                Category? mainCategory = null;

                var rawCats = csv.GetField("categories");
                if (string.IsNullOrEmpty(rawCats)) rawCats = csv.GetField("categories_pl");
                if (string.IsNullOrEmpty(rawCats)) rawCats = csv.GetField("categories_tags");
                if (string.IsNullOrEmpty(rawCats)) rawCats = csv.GetField("main_category");

                if (!string.IsNullOrEmpty(rawCats))
                {
                    var splitCats = rawCats.Split(',');
                    
                    foreach (var catName in splitCats)
                    {
                        var cleanName = catName.Trim();

                        if (cleanName.Contains(':'))
                        {
                            cleanName = cleanName.Split(':')[1];
                        }
                        
                        cleanName = cleanName.Replace("-", " ");

                        if (string.IsNullOrEmpty(cleanName)) continue;
                        var lowerName = cleanName.ToLower();

                        if (!categoryCache.TryGetValue(lowerName, out var categoryEntity))
                        {
                            categoryEntity = new Category
                            {
                                Id = Guid.NewGuid(),
                                PolishName = cleanName, 
                                EnglishName = string.Empty
                            };
                            categoryCache[lowerName] = categoryEntity;
                        }
                        productCategories.Add(categoryEntity);
                        mainCategory = categoryEntity; 
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
                    Categories = productCategories,
                    MainCategory = mainCategory 
                };

                productsBuffer.Add(product);

                if (productsBuffer.Count >= 5000)
                {
                    await SaveBatchAsync(strategy, productsBuffer);
                    productsBuffer.Clear();
                }
            }
        }
        
        if (productsBuffer.Any())
        {
            await SaveBatchAsync(strategy, productsBuffer);
        }
    }

    private async Task SaveBatchAsync(Microsoft.EntityFrameworkCore.Storage.IExecutionStrategy strategy, List<Product> products)
    {
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await context.Database.BeginTransactionAsync();
            try 
            {
                await context.BulkInsertAsync(products, new BulkConfig 
                { 
                    IncludeGraph = true, 
                    SetOutputIdentity = true 
                });
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