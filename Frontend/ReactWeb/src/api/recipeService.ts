import apiClient from './apiClient';
import type { RecipeRequest, RecipeSearchResponse } from '../Data/Recipe';

export const recipeService = {

  // Search recipes by ingredients
  searchRecipes: async (request: RecipeRequest): Promise<RecipeSearchResponse> => {
    const { data } = await apiClient.get<RecipeSearchResponse>('/recipes/search', {
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
    return data;
  },
};