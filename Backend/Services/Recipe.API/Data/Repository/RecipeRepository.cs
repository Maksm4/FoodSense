using Microsoft.EntityFrameworkCore;
using Recipe.API.Data.Context;
using Recipe.API.Models;

namespace Recipe.API.Data.Repository;

public class RecipeRepository(RecipeDbContext context) : IRecipeRepository
{

    public Task AddRecipe(Models.Recipe recipe)
    {
        context.Recipes.Add(recipe);
        return context.SaveChangesAsync();
    }
    
    public async Task AddRecipes(ICollection<Models.Recipe> recipes)
    {
        await context.Recipes.AddRangeAsync(recipes);
        await context.SaveChangesAsync();
    }

    public async Task<ICollection<Models.Recipe>> GetUserSavedRecipes(string userId)
    {
        return await context.Recipes
            .Include(r => r.UserRecipes)
            .Where(r => r.UserRecipes.Any(ur => ur.UserId == userId))
            .ToListAsync();
    }

    public async Task<Models.Recipe?> FindByExternalId(string externalId)
    {
        return await context.Recipes
            .FirstOrDefaultAsync(r => r.ExternalId == externalId);
    }
    
    public async Task AddUserRecipe(UserRecipe userRecipe)
    {
        context.UserRecipe.Add(userRecipe);
        await context.SaveChangesAsync();
    }
}