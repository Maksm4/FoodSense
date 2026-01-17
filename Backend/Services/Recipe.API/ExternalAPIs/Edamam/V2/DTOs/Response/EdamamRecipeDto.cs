namespace Recipe.API.ExternalAPIs.Edamam.V2.DTOs.Response;

public class EdamamResponseDto
{
    public ICollection<EdamamHitDto> Hits { get; set; } = [];
    
    public EdamamLinksDto? _Links { get; set; } 
}

public class EdamamLinksDto
{
    public EdamamLinkDto? Next { get; set; }
}

public class EdamamLinkDto
{
    public string? Href { get; set; }
}

public class EdamamHitDto
{
    public EdamamRecipeDto Recipe { get; set; }
}

public class EdamamRecipeDto
{
    public string Label { get; set; }
    public string Source { get; set; } 
    public string Image { get; set; }
    public string Url { get; set; }
    public float TotalTime { get; set; }
    public float Calories { get; set; }
    public ICollection<string> HealthLabels { get; set; } = [];
    public ICollection<EdamamIngredientDto> Ingredients { get; set; } = [];
}

public class EdamamIngredientDto
{
    public string Food { get; set; } 
    public double Quantity { get; set; }
    public string Measure { get; set; }
    public double Weight { get; set; }
}