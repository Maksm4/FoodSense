using System.Text;
using System.Text.Json;
using AutoMapper;
using Microsoft.Extensions.Options;
using Recipe.API.Config;
using Recipe.API.DTOs;
using Recipe.API.ExternalAPIs.Edamam.V2.DTOs.Response;
using Recipe.API.Models;

namespace Recipe.API.ExternalAPIs.Edamam.V2;

public class EdamamRecipeProvider(HttpClient httpClient, IOptions<Config.Edamam> settings, 
    IMapper mapper) : IRecipeProvider
{
    private readonly Config.Edamam _settings = settings.Value;

    public async Task<RecipeSearchResult> SearchRecipes(RecipeRequestDto request)
    {
        string requestUrl = BuildRequestUrl(request);

        var httpRequest = new HttpRequestMessage(HttpMethod.Get, requestUrl);
        
        var response = await httpClient.SendAsync(httpRequest);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"Edamam API Error: {response.StatusCode}. Details: {errorContent}");
        }

        var jsonOptions = new JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true 
        };
        var edamamResponse = await response.Content
            .ReadFromJsonAsync<EdamamResponseDto>(jsonOptions);
        if (edamamResponse?.Hits == null || edamamResponse.Hits.Count == 0)
        {
            return new RecipeSearchResult
            {
                Recipes = [],
                NextPageToken = null
            };
        }
        
        var domainRecipes = edamamResponse.Hits
            .Select(hit => mapper.Map<Models.Recipe>(hit.Recipe))
            .ToList();

        return new RecipeSearchResult
        {
            Recipes = domainRecipes,
            NextPageToken = edamamResponse._Links?.Next?.Href 
        };
    }

    private string BuildRequestUrl(RecipeRequestDto request)
    {
        var baseUrl = _settings.BaseUrl.TrimEnd('/');
        var builder = new StringBuilder($"{baseUrl}/api/recipes/v2?type=public");

        // query
        if (request.Ingredients.Count != 0)
        {
            var q = string.Join(" ", request.Ingredients);
            builder.Append($"&q={Uri.EscapeDataString(q)}");
        }

        // filters
        if (request.CuisineType.HasValue)
        {
            var cuisine = EdamamUrlBuilder.ToEdamamCuisineType(request.CuisineType.Value);
            if (cuisine != null) 
            {
                builder.Append($"&cuisineType={Uri.EscapeDataString(cuisine)}");
            }
        }

        if (request.MealType.HasValue)
        {
            var meal = EdamamUrlBuilder.ToEdamamMealType(request.MealType.Value);
            if (meal != null) 
            {
                builder.Append($"&mealType={Uri.EscapeDataString(meal)}");
            }
        }
        
        if (request.MinTime.HasValue || request.MaxTime.HasValue)
        {
            var min = request.MinTime ?? 1;
            var max = request.MaxTime ?? 300;
            builder.Append($"&time={min}-{max}");
        }
        
        builder.Append($"&app_id={_settings.AppId}&app_key={_settings.AppKey}");
        
        // request only important fields to reduce payload
        string[] requiredFields =
        [
            "label", "image", "source", "url", "calories", 
            "totalTime", "healthLabels", "ingredients", "mealType", "cuisineType", "uri"
        ];
        
        foreach (var field in requiredFields)
        {
            builder.Append($"&field={field}");
        }

        // ingr amount based on input ingredients count
        var inputCount = request.Ingredients?.Count ?? 0;
        if (inputCount <= 0) return builder.ToString();
        
        // var maxIngr = inputCount + 8; //  for some add on ingredients like salt, oil, etc.
        // builder.Append($"&ingr=1-{maxIngr}");
        builder.Append($"&random=true"); // to get more variety in results
        return builder.ToString();
    }
}