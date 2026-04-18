namespace Recipe.API.DTOs.Response;

public class SavedRecipeResponseDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public string ExternalId { get; set; } = string.Empty;
    public DateOnly? SavedAt { get; set; }
}