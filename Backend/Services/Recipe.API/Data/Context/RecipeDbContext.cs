using Microsoft.EntityFrameworkCore;

namespace Recipe.API.Data.Context;

public class RecipeDbContext : DbContext
{
    //will need to load recipes here later
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}