using AutoMapper;
using Recipe.API.DTOs;
using Recipe.API.DTOs.Response;
using Recipe.API.ExternalAPIs;
using Recipe.API.Models;

namespace Recipe.API.Services;

public class RecipeService(IRecipeProvider recipeProvider, IMapper mapper) : IRecipeService
{
    public async Task<RecipeSearchResponseDto> GetRecipes(RecipeRequestDto request)
    {
        if (request.Ingredients.Count == 0)
        {
            return new RecipeSearchResponseDto(); 
        }
        //maybe redis cache here later
        var recipes = await recipeProvider.SearchRecipes(request);
        return mapper.Map<RecipeSearchResponseDto>(recipes);
    }
}