import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.css'
})
export class BenefitsComponent 
{
  constructor(private router: Router) {}

  // Metodo para navegar a la pagina de pago
  navigateToPayment(): void {
    this.router.navigate(['/plan-basico/payment']);
  }

}

