import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserId: string | null = null;
  private currentUser: any;


  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const userIdFromStorage = localStorage.getItem('authUserId');
    if (userIdFromStorage) {
      this.currentUserId = userIdFromStorage;
      this.getUserProfileById(this.currentUserId).subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${this.currentUserId}`).pipe(
      tap(user => this.currentUserId = user.id),
      catchError(this.handleError)
    );
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUserProfile(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError('Hubo un problema con la solicitud. Inténtalo de nuevo más tarde.');
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }


  isPremiumUser(): boolean {
    return this.currentUser && this.currentUser.userPlan === 'premium';
  }

  getUserProfileById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error) => throwError(() => new Error(error.message || 'Failed to load user')))
    );
  }

  upgradeToPremium(userId: string): Observable<any> {
    // Actualiza el plan del usuario a "premium"
    return this.http.patch(`${this.apiUrl}/${userId}`, { userPlan: 'premium' }).pipe(
      catchError((error) => {
        console.error('Error upgrading to premium:', error);
        return throwError(() => new Error('Hubo un problema con el cambio de plan. Inténtalo de nuevo.'));
      })
    );
  }

  isPremiumUser1(): boolean {
    console.log('Current User:', this.currentUser);
    return this.currentUser?.userPlan === 'premium';
  }

  // Metodo para subir la imagen de perfil
  uploadProfileImage(userId: string, formData: FormData): Observable<{ imageUrl: string }> {
    return this.http.post<{ imageUrl: string }>(
      `http://localhost:3001/api/upload-profile-image/${userId}`,
      formData
    );
  }

}
