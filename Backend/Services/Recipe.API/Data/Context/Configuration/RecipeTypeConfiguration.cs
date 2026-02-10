using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Recipe.API.Data.Context.Configuration;

public class RecipeTypeConfiguration : IEntityTypeConfiguration<Models.Recipe>
{
    public void Configure(EntityTypeBuilder<Models.Recipe> builder)
    {
        builder.ToTable("Recipe");
        builder.HasKey(x => x.Id).HasName("PK_Recipe");
        builder.Property(r => r.Title).IsRequired().HasMaxLength(300);
        builder.Property(r => r.ImageUrl).IsRequired();
        builder.Property(r => r.SourceUrl).IsRequired();
        builder.Property(r => r.Author).IsRequired();
        builder.Property(r => r.ExternalId).IsRequired();
    }
}