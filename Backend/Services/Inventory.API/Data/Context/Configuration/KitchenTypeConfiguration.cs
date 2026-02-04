using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Data.Context.Configuration
{
    public class KitchenTypeConfiguration : IEntityTypeConfiguration<Kitchen>
    {
        public void Configure(EntityTypeBuilder<Kitchen> builder)
        {
            builder.ToTable("Kitchen");

            builder.HasKey(k => k.Id).HasName("PK_Kitchen");
            builder.Property(k => k.Name).IsRequired().HasMaxLength(100);
            builder.Property(k => k.Id).ValueGeneratedOnAdd();
            builder.Property(k => k.CreatedDate).IsRequired();

            builder.HasMany(k => k.ProductItems)
                .WithOne(pi => pi.Kitchen)
                .HasForeignKey(pi => pi.KitchenId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(k => k.UserKitchens)
                .WithOne(pi => pi.Kitchen)
                .HasForeignKey(uk => uk.KitchenId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}