using AutoMapper;
using Common.Exceptions;
using Common.Services;
using Recipe.API.Data.Repository;
using Recipe.API.DTOs;
using Recipe.API.DTOs.Request;
using Recipe.API.DTOs.Response;
using Recipe.API.ExternalAPIs;
using Recipe.API.Models;

namespace Recipe.API.Services;

public class RecipeService(IRecipeProvider recipeProvider, IMapper mapper,ICurrentUser currentUser, IRecipeRepository recipeRepository) : IRecipeService
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
    
    public async Task<ICollection<SavedRecipeResponseDto>> GetSavedRecipes()
    {
        if (string.IsNullOrEmpty(currentUser.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        
        var userRecipes = await recipeRepository.GetUserSavedRecipes(currentUser.UserId);
        return mapper.Map<ICollection<SavedRecipeResponseDto>>(userRecipes);
    }
    
    public async Task SaveRecipe(SaveRecipeRequestDto recipeRequest)
    {
        if (string.IsNullOrEmpty(currentUser.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        
        var recipe = await recipeRepository.FindByExternalId(recipeRequest.ExternalId);

        if (recipe == null)
        {
            recipe = mapper.Map<Models.Recipe>(recipeRequest);
            await recipeRepository.AddRecipe(recipe);
        }
        // Check if user has already saved this recipe
        var userRecipe = new UserRecipe
        {
            UserId = currentUser.UserId,
            RecipeId = recipe.Id,
            Recipe = recipe
        };
        await recipeRepository.AddUserRecipe(userRecipe);
    }
    
    public async Task DeleteRecipe(string externalId)
    {
        if (string.IsNullOrEmpty(currentUser.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        
        await recipeRepository.DeleteUserRecipe(currentUser.UserId, externalId);
    }
}