namespace Recipe.API.Config;

public class EdamamSettings
{
    public const string SectionName = "Edamam";
    public string AppId { get; set; } = string.Empty;
    public string AppKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.edamam.com";
}