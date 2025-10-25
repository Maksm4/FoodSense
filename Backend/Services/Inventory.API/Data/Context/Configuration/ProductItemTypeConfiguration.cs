using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Data.Context.Configuration
{
    public class ProductItemTypeConfiguration : IEntityTypeConfiguration<ProductItem>
    {
        public void Configure(EntityTypeBuilder<ProductItem> builder)
        {
            builder.ToTable("ProductItem");

            builder.HasKey(p => p.Id).HasName("PK_ProductItem");

            builder.Property(p => p.Quantity).IsRequired().HasMaxLength(200);
            builder.Property(p => p.PurchaseDate).IsRequired();
            builder.Property(p => p.ExpirationDate).IsRequired();
            builder.Property(p => p.AddedBy).IsRequired();
            builder.Property(p => p.AddedDate).IsRequired();

            builder.Property(p => p.Id).ValueGeneratedOnAdd();
        }
    }
}