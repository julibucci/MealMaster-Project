import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-recipe-component',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './create-recipe-component.component.html',
  styleUrl: './create-recipe-component.component.css'
})
export class CreateRecipeComponentComponent implements OnInit {
  categories: any[] = [];
  recipe = {
    idMeal: '',
    strMeal: '',
    strCategory: '',
    strInstructions: '',
    ingredients: [] as { ingredient: string, measure: string }[],
    userId: null as number | null
  };

  constructor(
    private recipeService: RecipeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.recipeService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    const currentUserId = this.userService.getCurrentUserId();
    if (currentUserId) {
      this.recipe.userId = currentUserId;
    }
  }

  addIngredient() {
    this.recipe.ingredients.push({ ingredient: '', measure: '' });
  }

  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  saveRecipe(): void {
    console.log('Saving recipe:', this.recipe); // Verifica los datos antes de enviarlos
    this.recipeService.createRecipe(this.recipe).subscribe({
      next: () => {
        alert('Recipe saved successfully!');
      },
      error: (err) => {
        console.error('Error saving recipe:', err); // Verifica si hay algún error
      }
    });
  }
}
