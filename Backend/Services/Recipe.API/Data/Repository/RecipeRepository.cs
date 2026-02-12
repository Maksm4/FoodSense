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

    public async Task<ICollection<UserRecipe>> GetUserSavedRecipes(string userId)
    {
        return await context.UserRecipe
            .Include(ur => ur.Recipe)
            .Where(ur => ur.UserId == userId)
            .OrderByDescending(ur => ur.SavedAt)
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
    
    public async Task DeleteUserRecipe(string userId, string externalId)
    {
        var userRecipe = await context.UserRecipe
            .Include(ur => ur.Recipe)
            .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.Recipe.ExternalId == externalId);
        
        if (userRecipe != null)
        {
            context.UserRecipe.Remove(userRecipe);
            await context.SaveChangesAsync();
        }
    }
}