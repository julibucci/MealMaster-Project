import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealService } from '../../services/meal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-details-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-details-component.component.html',
  styleUrl: './recipe-details-component.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  recipeId: string = '';
  recipeDetails: any = {};

  constructor(private route: ActivatedRoute, private mealService: MealService) { }

  ngOnInit(): void {
    // Obtener el ID de la receta de los parámetros de la ruta
    this.recipeId = this.route.snapshot.paramMap.get('id') || '';

    // Llamar al servicio para obtener los detalles de la receta
    this.getRecipeDetails(this.recipeId);
  }

  getRecipeDetails(id: string): void {
    this.mealService.getRecipeDetails(id).subscribe(details => {
      this.recipeDetails = details.meals[0]; // Obtener la receta de la respuesta
    });
  }

  getIngredients(): string[] {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = this.recipeDetails[`strIngredient${i}`];
      const measure = this.recipeDetails[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${ingredient} (${measure})`);
      }
    }
    return ingredients;
  }
}
