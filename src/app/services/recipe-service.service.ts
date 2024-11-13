import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3001/meals';

  constructor(private http: HttpClient) {}

  // Método para obtener recetas por usuario
  getRecipesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Método para crear una receta
  createRecipe(recipe: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, recipe);
  }

  // Método para actualizar una receta
  updateRecipe(recipeId: string, recipe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${recipeId}`, recipe);
  }

  // Método para eliminar una receta
  deleteRecipe(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`);
  }

  // Método para obtener categorías
  getCategories(): Observable<any[]> {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/categories.php')
      .pipe(map(response => response.categories || []));
  }
}