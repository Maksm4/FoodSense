namespace Recipe.API.ExternalAPIs.Spoonacular.v1.DTOs;

public class SpoonacularSearchResponse
{
    public List<MinimalRecipeDto> Results { get; set; }
    public int TotalResults { get; set; }
    public int Offset { get; set; }
}