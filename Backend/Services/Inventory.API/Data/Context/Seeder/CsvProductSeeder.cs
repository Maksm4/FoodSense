using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using EFCore.BulkExtensions;
using Inventory.API.Models;

namespace Inventory.API.Data.Context.Seeder;

public class CsvProductSeeder(InventoryDbContext context)
{
    public async Task SeedFromCsvAsync(string csvFilePath)
    {
        var productsToAdd = new List<Product>();
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
                if (string.IsNullOrEmpty(countries) || !countries.Contains("poland"))
                    continue;
                
                var name = csv.GetField("product_name");
                var code = csv.GetField("code");
                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(code))
                    continue;
                
                var imageUrl = csv.GetField("image_url");
                
                if (string.IsNullOrEmpty(imageUrl))
                {
                    imageUrl = csv.GetField("image_small_url");
                }

                var product = new Product
                {
                    Name = name.Length > 200 ? name.Substring(0, 200) : name,
                    BarCode = code,
                    Brand = csv.GetField("brands") ?? "Unknown",
                    VisualRepresentation = imageUrl ?? "",
                    CreatedBy = "OpenFoodFacts_seed",
                    Scope = ProductScope.Global
                };

                productsToAdd.Add(product);

                // Batch insert 5k rows
                if (productsToAdd.Count >= 5000)
                {
                    await context.BulkInsertAsync(productsToAdd);
                    productsToAdd.Clear();
                }
            }
        }
        
        if (productsToAdd.Any())
        {
            await context.BulkInsertAsync(productsToAdd);
        }
    }
}