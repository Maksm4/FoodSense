export interface IngredientResponse {
  name: string;
  quantity?: number;
  measure?: string;
  weight: string;
}

export interface Recipe {
  title: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  preparationTime?: number; // in minutes
  ingredients: IngredientResponse[];
  calories?: number;
  healthLabels: string[];
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  nextPageToken?: string;
}

export const MealType = {
  Breakfast: 'Breakfast',
  Lunch: 'Lunch',
  Dinner: 'Dinner',
  Snack: 'Snack',
} as const;

export type MealType = typeof MealType[keyof typeof MealType];

export const CuisineType = {
  Italian: 'Italian',
  Mexican: 'Mexican',
  Asian: 'Asian',
  Mediterranean: 'Mediterranean',
  American: 'American'
} as const;

export type CuisineType = typeof CuisineType[keyof typeof CuisineType];

export interface RecipeRequest {
  ingredients: string[];
  mealType?: MealType;
  cuisineType?: CuisineType;
  minTime?: number;
  maxTime?: number;
  nextPageToken?: string;
}