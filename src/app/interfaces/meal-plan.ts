import { Recipe } from "./recipe.interface";

export interface MealPlan {
  userId: string;
  id: string;
  recipe: Recipe;
  category: string;
  day: string | null; }
