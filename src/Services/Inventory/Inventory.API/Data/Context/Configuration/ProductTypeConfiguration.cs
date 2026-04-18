using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Data.Context.Configuration
{
    public class ProductTypeConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Product");

            builder.HasKey(p => p.Id).HasName("PK_Product");
            
            builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
            builder.Property(p => p.Brand).IsRequired().HasMaxLength(100);
            builder.Property(p => p.BarCode).HasMaxLength(50);

            builder.Property(p => p.Id).ValueGeneratedOnAdd();
            
            builder.HasMany(p => p.ProductItems)
                .WithOne(pi => pi.Product)
                .HasForeignKey(pi => pi.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(p => p.Categories)
                .WithMany(pi => pi.Products)
                .UsingEntity(j => j.ToTable("ProductCategories"));
            
            builder.HasOne(p => p.MainCategory)
                .WithMany()
                .HasForeignKey(p => p.MainCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.HasIndex(p => p.Name);
        }
    }
}