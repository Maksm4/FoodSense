using Microsoft.EntityFrameworkCore;
using Recipe.API.Data.Context.Configuration;

namespace Recipe.API.Data.Context;

public class RecipeDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new RecipeTypeConfiguration());
    }
}