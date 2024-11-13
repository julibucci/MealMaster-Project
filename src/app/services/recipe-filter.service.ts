// RecipeFilterService
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recipe } from '../interfaces/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeFilterService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';

  private http = inject(HttpClient);

  // Método para obtener recetas filtradas por un ingrediente
  getRecipesByIngredient(ingredient: string): Observable<Recipe[]> {
    return this.http.get<any>(`${this.apiUrl}${ingredient}`).pipe(
      map(response => {
        console.log('Recetas filtradas por ingrediente:', response);
        return response.meals ? response.meals.map((meal: any) => ({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strInstructions: meal.strInstructions, 
          strMealThumb: meal.strMealThumb
        })) : [];
      }),
      catchError(error => {
        console.error('Error al obtener recetas por ingrediente', error);
        return of([]); 
      })
    );
  }
}
