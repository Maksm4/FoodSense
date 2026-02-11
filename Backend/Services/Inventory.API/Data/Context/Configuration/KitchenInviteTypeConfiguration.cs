using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Inventory.API.Data.Context.Configuration;

public class KitchenInviteTypeConfiguration : IEntityTypeConfiguration<KitchenInvite>
{
    public void Configure(EntityTypeBuilder<KitchenInvite> builder)
    {
        builder.ToTable("KitchenInvite");
        builder.HasKey(c => c.Id).HasName("PK_KitchenInvite");
        builder.Property(c => c.Id).ValueGeneratedOnAdd();
        builder.Property(c => c.InviteCode).IsRequired();
        builder.Property(c => c.CreatedAt).IsRequired();
        builder.Property(c => c.CreatedByUserId).IsRequired();
        builder.Property(c => c.ExpiresAt).IsRequired();
    }
}