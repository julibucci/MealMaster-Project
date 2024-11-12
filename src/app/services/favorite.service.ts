import { Recipe } from '../models/recipe';
import { Favorite } from '../models/favorite';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FavoriteService {
  private apiUrl = 'http://localhost:3000/favorites';  // URL del servidor donde están los favoritos


  private http = inject(HttpClient);

  // Obtener favoritos del usuario 1
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=1`);
  }

  // Obtener categorías (asumimos que puedes tener una lista de categorías estática o desde el servidor)
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/categories');
  }

  removeFavorite(id: number): Observable<void> {
    console.log(`Eliminando favorito con ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Agregar un favorito
  addFavorite(favorite: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, favorite);
  }


}
