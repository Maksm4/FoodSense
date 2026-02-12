using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Recipe.API.Models;

namespace Recipe.API.Data.Context.Configuration;

public class UserRecipeTypeConfiguration : IEntityTypeConfiguration<UserRecipe>
{
    public void Configure(EntityTypeBuilder<UserRecipe> builder)
    {
        builder.ToTable("UserRecipe");
        builder.HasKey(ur => ur.Id).HasName("PK_UserRecipe");
        builder.Property(ur => ur.Id).ValueGeneratedOnAdd();
        builder.Property(ur => ur.SavedAt).IsRequired();
        
        builder.HasIndex(ur => ur.UserId);
    }
}