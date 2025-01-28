import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserTryService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserId: number | null = null;
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    const storedUserId = localStorage.getItem('authUserId');
    if (storedUserId) {
      this.currentUserId = parseInt(storedUserId, 10);
      this.loadCurrentUser();
    }
  }

  private loadCurrentUser(): void {
    if (this.currentUserId) {
      this.getUserProfileById(this.currentUserId).subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  // Devuelve el perfil del usuario autenticado
  getUserProfile(): Observable<User | null> {
    if (this.currentUser) {
      return of(this.currentUser); // Devuelve el usuario actual si ya está cargado
    }
    console.error('No hay usuario autenticado');
    return of(null); // Devuelve null si no hay usuario autenticado
  }

  // Obtiene un usuario específico por ID
  getUserProfileById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }


  // Devuelve si el usuario autenticado es premium
  isPremiumUser(): boolean {
    return this.currentUser?.userPlan === 'premium';
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('authUserId');
    console.log('userId recuperado desde localStorage:', userId);
    return userId ? parseInt(userId, 10) : null;
  }

}
