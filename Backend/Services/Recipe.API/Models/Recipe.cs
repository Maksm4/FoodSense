using Recipe.API.Models.Enums;

namespace Recipe.API.Models;

public class Recipe
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public int PreparationTime { get; set; } // in minutes
    public ICollection<Ingredient> Ingredients { get; init; } = [];
    public float? Calories { get; set; }
    public CuisineType CuisineType { get; set; }
    public MealType MealType { get; set; }
    public ICollection<string> HealthLabels { get; init; } = [];
    public string ExternalId { get; set; } = string.Empty;
}