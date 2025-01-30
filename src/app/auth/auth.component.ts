import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service.service';
import { LoginCredentials } from '../interfaces/loginCredentials';
import { RegisterData } from '../interfaces/registerData';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/)]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
  
    if (this.isLoginMode) {
      if (this.loginForm.invalid) {
        this.errorMessage = 'Please fill in all fields correctly.';
        return;
      }
  
      const credentials: LoginCredentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Logged in', response);
          const userPlan = response.user.userPlan;
  
          if (userPlan === 'premium') {
            this.router.navigate(['/plan-premium']);
          } else {
            this.router.navigate(['/plan-basico']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
    } else {
      if (this.registerForm.invalid) {
        if (this.registerForm.controls['name'].invalid) {
          this.errorMessage = 'The name field is required.';
        } else if (this.registerForm.controls['email'].invalid) {
          this.errorMessage = 'Please provide a valid Gmail or Yahoo email address.';
        } else if (this.registerForm.controls['password'].invalid) {
          this.errorMessage = 'The password field is required.';
        }
        return;
      }
  
      const userData: RegisterData = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registered', response);
          const userPlan = response.user.userPlan;
  
          if (userPlan === 'premium') {
            this.router.navigate(['/plan-premium']);
          } else {
            this.router.navigate(['/plan-basico']);
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }
}

