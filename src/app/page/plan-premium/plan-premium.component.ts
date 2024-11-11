import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-plan-premium',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './plan-premium.component.html',
  styleUrl: './plan-premium.component.css'
})
export class PlanPremiumComponent {

  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    // Llamamos al servicio de autenticación para limpiar el estado del usuario
    this.authService.logout();
    
    // Redirigimos al usuario a la pagina de login
    this.router.navigate(['/login']);
  }}

