using Microsoft.AspNetCore.Mvc;
using Recipe.API.DTOs;
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
    
    //save favourite recipe 
}