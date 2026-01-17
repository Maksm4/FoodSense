using AutoMapper;
using Recipe.API.ExternalAPIs.Edamam.V2.DTOs;
using Recipe.API.ExternalAPIs.Edamam.V2.DTOs.Response;
using Recipe.API.Models;

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
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Label))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Source))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Image))
            .ForMember(dest => dest.SourceUrl, opt => opt.MapFrom(src => src.Url))
            .ForMember(dest => dest.PreparationTime, opt => opt.MapFrom(src => (int)src.TotalTime))
            .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.Ingredients))
            .ForMember(dest => dest.HealthLabels, opt => opt.MapFrom(src => src.HealthLabels));
    }
}