namespace Recipe.API.DTOs.Request;

public class SaveRecipeRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public string ExternalId { get; set; } = string.Empty;
}