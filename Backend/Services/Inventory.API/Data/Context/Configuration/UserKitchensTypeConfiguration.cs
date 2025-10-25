using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Data.Context.Configuration
{
    public class UserKitchensTypeConfiguration : IEntityTypeConfiguration<UserKitchen>
    {
        public void Configure(EntityTypeBuilder<UserKitchen> builder)
        {
            builder.ToTable("UserKitchen");
            builder.HasKey(uk => uk.Id).HasName("PK_UserKitchen");
            builder.Property(uk => uk.Id).ValueGeneratedOnAdd();
        }
    }
}