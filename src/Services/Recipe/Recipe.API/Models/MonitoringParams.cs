using Prometheus;

namespace Recipe.API.Models;

public static class MonitoringParams
{
    public static readonly Counter RecipesSearched = Metrics
        .CreateCounter("recipe_searches_total", "Total number of recipe searches");

    public static readonly Histogram ExternalApiDuration = Metrics
        .CreateHistogram("edamam_api_duration_seconds", "Time spent calling Edamam API");

}