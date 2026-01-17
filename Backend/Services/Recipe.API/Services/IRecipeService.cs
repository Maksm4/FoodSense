using Recipe.API.DTOs;
using Recipe.API.DTOs.Response;
using Recipe.API.Models;

namespace Recipe.API.Services;

public interface IRecipeService
{
    Task<RecipeSearchResponseDto> GetRecipes(RecipeRequestDto request);
}