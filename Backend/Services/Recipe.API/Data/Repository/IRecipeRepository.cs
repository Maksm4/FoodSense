using Recipe.API.Models;

namespace Recipe.API.Data.Repository;

public interface IRecipeRepository
{
    Task AddRecipe(Models.Recipe recipe);
    Task AddRecipes(ICollection<Models.Recipe> recipes);
    Task<ICollection<Models.Recipe>> GetUserSavedRecipes(string userId);
    Task<Models.Recipe?> FindByExternalId(string externalId);
    Task AddUserRecipe(UserRecipe userRecipe);
}