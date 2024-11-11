import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plan-basico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plan-basico.component.html',
  styleUrls: ['./plan-basico.component.css']
})
export class PlanBasicoComponent {}

