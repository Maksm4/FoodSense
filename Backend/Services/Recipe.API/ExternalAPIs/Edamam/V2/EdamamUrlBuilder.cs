using Recipe.API.Models.Enums;

namespace Recipe.API.ExternalAPIs.Edamam.V2;

public static class EdamamUrlBuilder
{
    public static string? ToEdamamCuisineType(CuisineType type)
    {
        return type switch
        {
            CuisineType.Italian => "Italian",
            CuisineType.Mexican => "Mexican",
            CuisineType.Asian => "Asian",
            CuisineType.American => "American",
            CuisineType.British => "British",
            CuisineType.Caribbean => "Caribbean",
            CuisineType.CentralEurope => "Central Europe",
            CuisineType.Chinese => "Chinese",
            CuisineType.EasternEurope => "Eastern Europe",
            CuisineType.French => "French",
            CuisineType.Indian => "Indian",
            CuisineType.Greek => "Greek",
            CuisineType.Japanese => "Japanese",
            CuisineType.Korean => "Korean",
            CuisineType.Mediterranean => "Mediterranean",
            CuisineType.Kosher => "Kosher",
            CuisineType.MiddleEastern => "Middle Eastern",
            CuisineType.Nordic => "Nordic",
            CuisineType.SouthAmerican => "South American",
            CuisineType.SouthEastAsian => "South East Asian",
            _ => null
        };
    }

    public static string? ToEdamamMealType(MealType type)
    {
        return type switch
        {
            MealType.Breakfast => "Breakfast",
            MealType.Lunch => "Lunch",
            MealType.Dinner => "Dinner",
            MealType.Snack => "Snack",
            MealType.Teatime => "Teatime",
            _ => null
        };
    }
}