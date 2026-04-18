using Recipe.API.Models.Enums;

namespace Recipe.API.DTOs;

public class RecipeRequestDto
{
    public ICollection<string> Ingredients { get; init; } = [];
    
    public MealType? MealType { get; set; } 
    public CuisineType? CuisineType { get; set; }
    
    public int? MinTime { get; set; }
    public int? MaxTime { get; set; }
    public string? NextPageToken { get; set; }
}