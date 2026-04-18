namespace Recipe.API.Models;

public class RecipeSearchResult
{
    public List<Recipe> Recipes { get; set; } = [];
    public string? NextPageToken { get; set; } 
}