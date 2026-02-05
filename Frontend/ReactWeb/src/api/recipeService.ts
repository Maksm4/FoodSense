import type { CuisineType, MealType, Recipe, RecipeIngredient, RecipeSearchResult } from "../Data/Recipe";
import apiClient from "./apiClient";

interface RecipeIngredientDto {
  name: string;
  quantity?: number;
  measure?: string;
  weight: string; // API sends string, but we want number in UI
}

interface RecipeDto {
  title: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  preparationTime?: number;
  ingredients: RecipeIngredientDto[];
  calories?: number;
  healthLabels: string[];
}

interface RecipeSearchResponseDto {
  recipes: RecipeDto[];
  nextPageToken?: string;
}

export interface RecipeSearchRequest {
  ingredients: string[];
  mealType?: MealType;
  cuisineType?: CuisineType;
  minTime?: number;
  maxTime?: number;
  nextPageToken?: string;
}

const mapIngredient = (dto: RecipeIngredientDto): RecipeIngredient => ({
    text: dto.name,
    quantity: dto.quantity || 0,
    measure: dto.measure || "",
    weight: parseFloat(dto.weight) || 0 
});

const mapRecipe = (dto: RecipeDto): Recipe => ({
    id: dto.sourceUrl, 
    title: dto.title,
    author: dto.author,
    image: dto.imageUrl,
    url: dto.sourceUrl,
    time: dto.preparationTime || 0,
    calories: Math.round(dto.calories || 0),
    tags: dto.healthLabels || [],
    ingredients: (dto.ingredients || []).map(mapIngredient)
});

export const recipeService = {
  searchRecipes: async (request: RecipeSearchRequest): Promise<RecipeSearchResult> => {
    
    const { data } = await apiClient.get<RecipeSearchResponseDto>('/recipes/search', {
      params: {
        ingredients: request.ingredients,
        mealType: request.mealType,
        cuisineType: request.cuisineType,
        minTime: request.minTime,
        maxTime: request.maxTime,
        nextPageToken: request.nextPageToken,
      },
      paramsSerializer: {
        indexes: null, 
      }
    });

    return {
        items: data.recipes.map(mapRecipe),
        nextPageToken: data.nextPageToken
    };
  },
};