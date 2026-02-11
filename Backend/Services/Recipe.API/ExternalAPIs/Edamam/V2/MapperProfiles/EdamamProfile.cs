using AutoMapper;
using Recipe.API.ExternalAPIs.Edamam.V2.DTOs;
using Recipe.API.ExternalAPIs.Edamam.V2.DTOs.Response;
using Recipe.API.Models;
using Recipe.API.Models.Enums;

namespace Recipe.API.ExternalAPIs.Edamam.V2.MapperProfiles;

public class EdamamProfile : Profile
{
    public EdamamProfile()
    {
        CreateMap<EdamamIngredientDto, Ingredient>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Food))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity.ToString("0.##"))) 
            .ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.Weight.ToString("0.##") + "g"));

        CreateMap<EdamamRecipeDto, Models.Recipe>()
            .ForMember(dest => dest.ExternalId, opt => opt.MapFrom(src => ExtractExternalId(src.Uri)))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Label))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Source))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Image))
            .ForMember(dest => dest.SourceUrl, opt => opt.MapFrom(src => src.Url))
            .ForMember(dest => dest.PreparationTime, opt => opt.MapFrom(src => (int)src.TotalTime))
            .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.Ingredients))
            .ForMember(dest => dest.HealthLabels, opt => opt.MapFrom(src => src.HealthLabels))
            .ForMember(dest => dest.Calories, opt => opt.MapFrom(src => src.Calories))
            .ForMember(dest => dest.MealType, opt => opt.MapFrom(src => MapMealType(src.MealType.FirstOrDefault())))
            .ForMember(dest => dest.CuisineType, opt => opt.MapFrom(src => MapCuisineType(src.CuisineType.FirstOrDefault())));
    }
    
    private static string ExtractExternalId(string edamamUri)
    {
        if (string.IsNullOrEmpty(edamamUri)) return string.Empty;
        return edamamUri.Split("#recipe_").Last();
    }
    
    private static MealType MapMealType(string? mealType)
    {
        if (string.IsNullOrEmpty(mealType)) return MealType.Lunch;

        var lower = mealType.ToLower();

        if (lower.Contains("breakfast")) return MealType.Breakfast;
        if (lower.Contains("lunch")) return MealType.Lunch;
        if (lower.Contains("dinner")) return MealType.Dinner;
        if (lower.Contains("snack")) return MealType.Snack;
        if (lower.Contains("teatime")) return MealType.Teatime;

        return MealType.Lunch;
    }
    
    private static CuisineType MapCuisineType(string? cuisineType)
    {
        if (string.IsNullOrEmpty(cuisineType)) return CuisineType.World;
        if (Enum.TryParse(cuisineType, true, out CuisineType result))
        {
            return result;
        }

        return CuisineType.World;
    }
}