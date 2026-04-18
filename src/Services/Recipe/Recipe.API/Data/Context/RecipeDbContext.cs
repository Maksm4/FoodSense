using Microsoft.EntityFrameworkCore;
using Recipe.API.Data.Context.Configuration;
using Recipe.API.Models;

namespace Recipe.API.Data.Context;

public class RecipeDbContext : DbContext
{
    public RecipeDbContext(DbContextOptions<RecipeDbContext> options) : base(options) { }
    public DbSet<Models.Recipe> Recipes { get; set; }
    public DbSet<UserRecipe> UserRecipe { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new RecipeTypeConfiguration());
        modelBuilder.ApplyConfiguration(new UserRecipeTypeConfiguration());
    }
}