using Recipe.API.DTOs;
using Recipe.API.Models;

namespace Recipe.API.ExternalAPIs;

public interface IRecipeProvider
{
    Task<RecipeSearchResult> SearchRecipes(RecipeRequestDto request);
}