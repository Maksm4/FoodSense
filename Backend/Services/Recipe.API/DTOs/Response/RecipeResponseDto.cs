namespace Recipe.API.DTOs;

public class RecipeResponseDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public int PreparationTime { get; set; } // in minutes
    public ICollection<IngredientResponseDto> Ingredients { get; init; } = [];
    public float? Calories { get; set; }
    public ICollection<string> HealthLabels { get; init; } = [];
}