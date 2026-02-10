using Microsoft.AspNetCore.Mvc;
using Recipe.API.DTOs;
using Recipe.API.DTOs.Request;
using Recipe.API.DTOs.Response;
using Recipe.API.Services;

namespace Recipe.API.Controllers;

[ApiController]
[Route("api/recipes")]
public class RecipesController(IRecipeService recipeService) : ControllerBase
{
    [HttpGet("search")]
    [ProducesResponseType(typeof(IEnumerable<RecipeSearchResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] RecipeRequestDto request)
    {
        var recipes = await recipeService.GetRecipes(request);
        return Ok(recipes);
    }
    
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SavedRecipeResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetSavedRecipes()
    {
        var recipes = await recipeService.GetSavedRecipes();
        return Ok(recipes);
    }
    
    public async Task<IActionResult> SaveRecipe([FromBody] SaveRecipeRequestDto request)
    {
        await recipeService.SaveRecipe(request);
        return NoContent();
    }
}