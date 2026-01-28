using Inventory.API.Models;

namespace Inventory.API.Data.Context.Data;

public static class DataSeeder
{
    public static void Seed(InventoryDbContext context)
    {
        if (context.Products.Any()) return;

        var catDairy = new Category { Name = "en:dairies" };
        var catMilk = new Category { Name = "en:milks" };
        var catBeverages = new Category { Name = "en:beverages" };
        var catSnacks = new Category { Name = "en:snacks" };
        var catPlantBased = new Category { Name = "en:plant-based-foods" };
        var catMeat = new Category { Name = "en:chickens" };
        var catChickenBreasts = new Category { Name = "en:chicken-breasts" };
        var catCottageCheese = new Category { Name = "en:plain-cottage" };
        
        var products = new List<Product>
        {
            new Product
            {
                Name = "Mleko Wypasione 3.2%",
                Brand = "Mlekovita",
                BarCode = "5900512320359", 
                Categories = new List<Category> { catDairy, catMilk },
                Scope = ProductScope.Global,
                CreatedBy = "Admin",
                VisualRepresentation = "https://images.openfoodfacts.org/images/products/590/051/230/0123/front_pl.4.400.jpg"
            },
            
            new Product
            {
                Name = "Napoj Jablko Mięta",
                Brand = "Tymbark",
                BarCode = "5900334012753",
                Categories = new List<Category> { catBeverages, catPlantBased },
                Scope = ProductScope.Global,
                CreatedBy = "Admin",
                VisualRepresentation = "https://images.openfoodfacts.org/images/products/590/033/400/5566/front_pl.10.400.jpg"
            },
            
            new Product
            {
                Name = "Prince Polo Classic",
                Brand = "Olza",
                BarCode = "7622210309792",
                Categories = new List<Category> { catSnacks },
                Scope = ProductScope.Global,
                CreatedBy = "Admin",
                VisualRepresentation = "https://images.openfoodfacts.org/images/products/590/022/110/0998/front_pl.7.400.jpg"
            },

            new Product
            {
                Name = "Woda Niegazowana",
                Brand = "Cisowianka",
                BarCode = "5902078000201",
                Categories = new List<Category> { catBeverages },
                Scope = ProductScope.Global,
                CreatedBy = "Admin",
                VisualRepresentation = "https://images.openfoodfacts.org/images/products/590/011/122/2333/front_pl.3.400.jpg"
            },
            
            new Product
            {
                Name = "Serek Wiejski",
                Brand = "Piątnica",
                BarCode = "5900531000010",
                Categories = new List<Category> { catDairy, catCottageCheese },
                Scope = ProductScope.Global,
                CreatedBy = "Admin",
                VisualRepresentation = "https://images.openfoodfacts.org/images/products/590/077/788/8999/front_pl.5.400.jpg"
            },
            new Product
            {
                Name = "Piers z Kurczaka",
                Brand = "Kraina Mies",
                BarCode = "95900757060891",
                Categories = new List<Category> { catMeat, catChickenBreasts },
                Scope = ProductScope.Global,
                CreatedBy = "Admin",
                VisualRepresentation = "https://images.openfoodfacts.org/images/products/590/077/788/8999/front_pl.5.400.jpg"
            }
        };

        context.Products.AddRange(products);
        context.SaveChanges();
    }
}
