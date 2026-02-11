export const MealType = {
  Breakfast: 'Breakfast',
  Lunch: 'Lunch',
  Dinner: 'Dinner',
  Snack: 'Snack',
  Teatime: 'Teatime',
} as const;

export type MealType = typeof MealType[keyof typeof MealType];

export const CuisineType = {
  American: 'American',
  Asian: 'Asian',
  British: 'British',
  Caribbean: 'Caribbean',
  CentralEurope: 'CentralEurope',
  Chinese: 'Chinese',
  EasternEurope: 'EasternEurope',
  French: 'French',
  Indian: 'Indian',
  Italian: 'Italian',
  Japanese: 'Japanese',
  Kosher: 'Kosher',
  Mediterranean: 'Mediterranean',
  Mexican: 'Mexican',
  MiddleEastern: 'MiddleEastern',
  Nordic: 'Nordic',
  SouthAmerican: 'SouthAmerican',
  SouthEastAsian: 'SouthEastAsian',
  World: 'World',
  Polish: 'Polish',
  Korean: 'Korean',
  Greek: 'Greek'
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
  mealType: MealType;
  cuisineType: CuisineType;
  tags: string[];
  ingredients: RecipeIngredient[];
}

export interface RecipeSearchResult {
  items: Recipe[];
  nextPageToken?: string;
}

export interface SavedRecipe {
  id: string;
  title: string;
  author: string;
  image: string;
  url: string;
  savedAt?: Date;
}