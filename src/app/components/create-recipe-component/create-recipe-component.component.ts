import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-recipe-component',
  standalone: true,
  imports: [CommonModule,FormsModule, HttpClientModule],
  templateUrl: './create-recipe-component.component.html',
  styleUrl: './create-recipe-component.component.css'
})
export class CreateRecipeComponentComponent implements OnInit {
  categories: any[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  recipe = {
    idMeal: '',
    strMeal: '',
    strCategory: '',
    strArea: '',
    strInstructions: '',
    ingredients: [] as { ingredient: string, measure: string }[],
    userId: null as string | null,
    imageUrl: ''
  };

  areas = [
    'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 'Egyptian',
    'Filipino', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican', 'Japanese',
    'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish', 'Portuguese', 'Russian',
    'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Ukrainian', 'Unknown', 'Vietnamese'
  ];

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
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

  // Agregar un nuevo ingrediente a la receta
  addIngredient() {
    this.recipe.ingredients.push({ ingredient: '', measure: '' });
  }

  // Eliminar un ingrediente de la receta
  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  // Guardar la receta
  saveRecipe(): void {
    if (!this.recipe.strMeal || !this.recipe.strCategory || !this.recipe.strArea || !this.recipe.strInstructions) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    if (!this.recipe.idMeal) {
      this.recipe.idMeal = this.generateId();
    }

    console.log('Saving recipe:', this.recipe);
    alert('Saving recipe...');

    this.recipeService.createRecipe(this.recipe).subscribe({
      next: (savedRecipe) => {
        console.log('Recipe saved successfully:', savedRecipe);
        alert('Recipe saved successfully!');

        if (this.selectedFile) {
          this.uploadImage(this.selectedFile, savedRecipe.idMeal ?? savedRecipe.id);
        }

        this.router.navigate(['/plan-premium/create-recipe']).then(() => {
          window.location.reload(); // Recargar la página después de la navegación
        });
      },
      error: (err) => {
        console.error('Error saving recipe:', err);
        alert('Error saving recipe. Please try again.');
      }
    });
  }

  // Subir imagen de la receta
  uploadImage(file: File, idMeal: string): void {
    const formData = new FormData();
    formData.append('file', file);

    console.log(`Uploading image for recipe ID: ${idMeal}`);


    this.http.post<{ imageUrl: string }>(`http://localhost:3001/api/upload-recipe-image/${idMeal}`, formData)
      .subscribe({
        next: (response) => {
          console.log('Image uploaded successfully:', response.imageUrl);
          this.recipe.imageUrl = response.imageUrl;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          alert('Error uploading image. Please try again.');
        }
      });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear previsualización de imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  generateId(): string {
    return Math.floor(100000000 + Math.random() * 900000000).toString(); // Genera un numero de 9 dígitos
  }
}
