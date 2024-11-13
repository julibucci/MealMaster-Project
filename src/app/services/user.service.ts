// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserId: number | null = null;
  private currentUser: any;



  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.getUserProfile().subscribe(); // Actualiza el `currentUserId` internamente
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/1`).pipe(
      tap(user => this.currentUserId = user.id),
      catchError(this.handleError)
    );
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUserProfile(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError('Hubo un problema con la solicitud. Inténtalo de nuevo más tarde.');
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }


  // Método para verificar si el usuario es premium
  isPremiumUser(): boolean {
    return this.currentUser && this.currentUser.userPlan === 'premium';
  }

  getUserProfileById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error) => throwError(() => new Error(error.message || 'Failed to load user')))
    );
  }
  
}
