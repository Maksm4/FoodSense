using AutoMapper;
using Recipe.API.DTOs;
using Recipe.API.DTOs.Request;
using Recipe.API.DTOs.Response;
using Recipe.API.Models;

namespace Recipe.API.MapperProfiles;

public class RecipeProfile : Profile
{
    public RecipeProfile()
    {
        CreateMap<Models.Recipe, RecipeResponseDto>();
        CreateMap<Ingredient, IngredientResponseDto>();
        CreateMap<RecipeSearchResult, RecipeSearchResponseDto>();
        CreateMap<SaveRecipeRequestDto, Models.Recipe>();
        CreateMap<Models.Recipe, SavedRecipeResponseDto>();
        CreateMap<UserRecipe, SavedRecipeResponseDto>()
            .ForMember(dest => dest.SavedAt, opt => opt.MapFrom(src => src.SavedAt))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Recipe.Title))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Recipe.Author))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Recipe.ImageUrl))
            .ForMember(dest => dest.SourceUrl, opt => opt.MapFrom(src => src.Recipe.SourceUrl))
            .ForMember(dest => dest.ExternalId, opt => opt.MapFrom(src => src.Recipe.ExternalId));
    }
}