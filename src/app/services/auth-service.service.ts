import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { LoginCredentials } from '../interfaces/loginCredentials';
import { RegisterData } from '../interfaces/registerData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`).pipe(
      map((users) => {
        if (users.length > 0) {
          return { message: 'Login successful', user: users[0] };
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      catchError((error) => throwError(() => new Error(error.message || 'Login failed')))
    );
  }

  register(userData: RegisterData): Observable<any> {
    // Primero verificamos si el email ya está registrado
    return this.http.get<any[]>(`${this.apiUrl}?email=${userData.email}`).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          // Si el email ya existe, lanzamos un error
          return throwError(() => new Error('Email already registered'));
        } else {
          // Si el email no existe, procedemos a crear el nuevo usuario
          return this.http.post(this.apiUrl, userData).pipe(
            map((user) => ({ message: 'Registration successful', user })),
            catchError((error) => throwError(() => new Error(error.message || 'Registration failed')))
          );
        }
      }),
      catchError((error) => throwError(() => new Error(error.message || 'Registration failed')))
    );
  }
}



