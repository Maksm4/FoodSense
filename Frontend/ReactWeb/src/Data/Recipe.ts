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

export interface RecipeIngredient {
    text: string;
    quantity: number; 
    measure: string;
    weight: number;
}

export interface Recipe {
    id: string; 
    title: string;
    author: string;
    image: string;
    url: string;
    time: number;
    calories: number;
    tags: string[];
    ingredients: RecipeIngredient[];
}

export interface RecipeSearchResult {
    items: Recipe[];
    nextPageToken?: string;
}