using Recipe.API.DTOs;
using Recipe.API.DTOs.Request;
using Recipe.API.DTOs.Response;
using Recipe.API.Models;

namespace Recipe.API.Services;

public interface IRecipeService
{
    Task<RecipeSearchResponseDto> GetRecipes(RecipeRequestDto request);
    Task<ICollection<SavedRecipeResponseDto>> GetSavedRecipes();
    Task SaveRecipe(SaveRecipeRequestDto recipeRequest);
    Task DeleteRecipe(string externalId);

}