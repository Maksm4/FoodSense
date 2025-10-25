using Inventory.API.Data.Context.Configuration;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Context
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Kitchen> Kitchens { get; set; }
        public DbSet<ProductItem> ProductItems { get; set; }
        public DbSet<UserKitchen> UserKitchens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new CategoryTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductTypeConfiguration());
            modelBuilder.ApplyConfiguration(new KitchenTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserKitchensTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductItemTypeConfiguration());
        }
    }
}