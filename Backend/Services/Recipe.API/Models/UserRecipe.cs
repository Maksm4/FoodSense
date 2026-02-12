namespace Recipe.API.Models;

public class UserRecipe
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserId { get; set; } = string.Empty;
    public Guid RecipeId { get; set; }
    public Recipe Recipe { get; init; }
    public DateOnly SavedAt { get; set; } = DateOnly.FromDateTime(DateTime.Today);
}