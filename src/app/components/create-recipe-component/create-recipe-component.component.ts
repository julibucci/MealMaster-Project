import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';

@Component({
  selector: 'app-create-recipe-component',
  standalone: true,
  imports: [CommonModule,FormsModule,ImageUploadComponent],
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
    userId: null as number | null,
    imageUrl: ''
  };

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
  
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

  onImageUploaded(imageUrl: string) {
    this.recipe.imageUrl = imageUrl; // Guardar la URL de la imagen en la receta
  }

  saveRecipe(): void {
    this.recipeService.createRecipe(this.recipe).subscribe({
      next: () => {
        alert('Recipe saved successfully!');
      },
      error: (err) => {
        console.error('Error saving recipe:', err);
      }
    });
  }
  
}
