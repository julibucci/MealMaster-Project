import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3002/meals';

  constructor(private http: HttpClient) {}

  // Metodo para obtener recetas por usuario
  getRecipesByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Metodo para crear una receta
  createRecipe(recipe: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, recipe);
  }

  // Metodo para actualizar una receta
  updateRecipe(recipeId: string, recipe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${recipeId}`, recipe);
  }

  // Metodo para eliminar una receta
  deleteRecipe(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}`);
  }

  // Metodo para obtener categorias
  getCategories(): Observable<any[]> {
    return this.http.get<any>('https://www.themealdb.com/api/json/v1/1/categories.php')
      .pipe(map(response => response.categories || []));
  }

  // Metodo para obtener todas las recetas
  getAllRecipes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); 
  }


  // Metodo para obtener detalles de una receta especifica
  getRecipeDetails(recipeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${recipeId}`);
  }

// Metodo para obtener receta especifica por id
getRecipeById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}

// Metodo para obtener los detalles de una receta por idMeal
getRecipeDetailsByIdMeal(idMeal: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}?idMeal=${idMeal}`);
}

}
