using AutoMapper;
using Recipe.API.DTOs;
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
    }
}