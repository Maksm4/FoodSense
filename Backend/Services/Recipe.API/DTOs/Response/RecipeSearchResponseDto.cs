namespace Recipe.API.DTOs.Response;

public class RecipeSearchResponseDto
{
    public ICollection<RecipeResponseDto> Recipes { get; set; } = [];
    public string? NextPageToken { get; set; } 
}