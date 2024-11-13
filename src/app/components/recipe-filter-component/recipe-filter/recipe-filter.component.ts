import { RecipeFilterService } from '../../../services/recipe-filter.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Recipe } from '../../../interfaces/recipe.interface';

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

  constructor(private RecipeFilterService: RecipeFilterService, private router: Router) {}

  searchRecipes(): void {
    if (!this.ingredients.trim()) {
      this.errorMessage = 'Por favor, ingresa un ingrediente.';
      return;
    }

    this.errorMessage = ''; // Limpiar el mensaje de error

    // Pasamos un solo ingrediente al servicio
    this.RecipeFilterService.getRecipesByIngredient(this.ingredients.trim()).subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
        if (this.recipes.length === 0) {
          this.errorMessage = 'No se encontraron recetas con ese ingrediente.';
        }
      },
      (error: any) => {
        console.error('Error al buscar recetas:', error);
        this.errorMessage = 'Hubo un error al buscar recetas. Inténtalo nuevamente.';
      }
    );
  }

  viewRecipeDetails(id: string): void {
    this.router.navigate(['/receta', id]);
  }
}
