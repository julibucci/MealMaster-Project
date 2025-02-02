import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MealPlan } from '../interfaces/meal-plan';
import { Recipe } from '../interfaces/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private apiUrl = 'http://localhost:3002/mealPlans';

  constructor(private http: HttpClient) {}

  getMealPlan(userId: string): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      catchError((error) => {
        console.error('Error loading meal plan', error);
        return throwError(() => new Error('Failed to load meal plan'));
      })
    );
  }

  addMealToPlan(userId: string, recipe: Recipe): Observable<MealPlan> {
    const mealEntry: MealPlan = {
      userId,
      id: `${userId}-${recipe.idMeal}`,
      recipe,
      category: 'uncategorized', // Se asigna la categoría por defecto
      day: null, // No asignado hasta que el usuario lo elija
    };
    return this.http.post<MealPlan>(this.apiUrl, mealEntry);
  }

  removeMealFromPlan(mealId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${mealId}`);
  }

  updateMealCategory(mealId: string, newCategory: string): Observable<MealPlan> {
    return this.http.patch<MealPlan>(`${this.apiUrl}/${mealId}`, { category: newCategory });
  }

  updateMealDay(mealId: string, newDay: string): Observable<MealPlan> {
    return this.http.patch<MealPlan>(`${this.apiUrl}/${mealId}`, { day: newDay });
  }

  getRecipeCategory(mealId: string): Observable<string> {
    return this.http.get<MealPlan>(`${this.apiUrl}/${mealId}`).pipe(
      map(meal => meal.category || 'uncategorized'),
      catchError((error) => {
        console.error('Error getting recipe category', error);
        return throwError(() => new Error('Failed to get recipe category'));
      })
    );
  }

  saveMealPlan(mealPlan: MealPlan[]): Observable<any> {
    return this.http.put<any>(this.apiUrl, mealPlan);
  }
}
