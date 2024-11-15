import { RecipeFilterService } from '../../../services/recipe-filter.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Recipe } from '../../../interfaces/recipe.interface';
import { UserService } from '../../../services/user.service';
import { UserTryService } from '../../../services/user-try.service';

@Component({
  selector: 'app-recipe-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-filter.component.html',
  styleUrls: ['./recipe-filter.component.css']
})
export class RecipeFilterComponent {
  ingredients: string = '';
  recipes: Recipe[] = [];
  errorMessage: string = '';

  constructor(private RecipeFilterService: RecipeFilterService, private router: Router,private userService: UserTryService) {}

  searchRecipes(): void {
    if (!this.ingredients.trim()) {
      this.errorMessage = 'Please enter an ingredient.';
      return;
    }

    this.errorMessage = ''; // Limpiar el mensaje de error

    // Pasamos un solo ingrediente al servicio
    this.RecipeFilterService.getRecipesByIngredient(this.ingredients.trim()).subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
        if (this.recipes.length === 0) {
          this.errorMessage = 'No recipes were found with that ingredient.';
        }
      },
      (error: any) => {
        console.error('Error al buscar recetas:', error);
        this.errorMessage = 'There was an error searching for recipes. Please try again.';
      }
    );
  }

  // Navegar a la página de detalles de la receta
  viewRecipeDetails(id: string): void {
    // Si el usuario ya está cargado, verifica el plan directamente
    if (this.userService.isPremiumUser()) {
      this.router.navigate(['/plan-premium/recipe-details', id]); // Ruta para usuarios premium
    } else if (this.userService.getUserProfile('1')) {
      // Si el usuario no está cargado, llama al servicio y verifica el plan
      this.userService.getUserProfile('1').subscribe(user => {
        if (user.userPlan === 'premium') {
          this.router.navigate(['/plan-premium/recipe-details', id]);
        } else {
          this.router.navigate(['/plan-basico/recipe-details', id]);
        }
      });
    } else {
      this.router.navigate(['/plan-basico/recipe-details', id]); // Ruta por defecto
    }
  }
}
