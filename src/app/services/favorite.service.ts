import { Recipe } from '../interfaces/recipe';
import { Favorite } from '../interfaces/favorite';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})

export class FavoriteService {
  private apiUrl = 'http://localhost:3002/favorites';  



  private http = inject(HttpClient);
  private userService= inject (UserService);

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/categories');
  }

   // Obtener favoritos del usuario logueado
   getFavorites(): Observable<any[]> {
    const userId = this.userService.getCurrentUserId(); // Obtiene el ID del usuario actual
    if (!userId) {
      console.error('El ID del usuario no está disponible.');
      return of([]); // Devuelve una lista vacia si no hay usuario autenticado
    }
    // Filtra los favoritos por userId
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      tap(favorites => console.log(`Favoritos obtenidos para el usuario ${userId}:`, favorites)),
      catchError(error => {
        console.error('Error obteniendo favoritos:', error);
        return of([]); // Devuelve una lista vacia si ocurre un error
      })
    );
  }
  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addFavorite(favorite: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, favorite);
  }


  getUserProfile(): Observable<User> {
    return this.userService.getUserProfile().pipe(
      //Se verifica si el usuario es null y si es asi, lanzamos un error o un usuario vacio
      map(user => {
        if (user === null) {
          throw new Error('No hay un usuario autenticado');
        }
        return user;
      }),
      catchError(error => {
        console.error(error);
        return of({} as User); // O devuelve un objeto vacio si no hay usuario
      })
    );
  }
}
