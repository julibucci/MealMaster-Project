import { Category } from '../../interfaces/category';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Recipe } from '../../interfaces/recipe.interface';
import { FilterByCategoryService } from '../../services/filter-by-category.service';
import { RecipeService } from '../../services/recipes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-filter-by-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-by-category.component.html',
  styleUrls: ['./filter-by-category.component.css']
})
export class FilterByCategoryComponent {

  categoryRecipesFromJson: Recipe[] = [];


  // Listas que almacenan resultados de las peticiones HTTP:
  categoryList: Category[] = [];
  recipeFromCategoryList: Recipe[] = [];
  //la propiedad recipe puede ser un objeto Recipe o null, y comienza con null.
  recipe: Recipe | null = null;

  selectedCategory:string ="";
  selectedIdFromRecipe: string ="";

  constructor(private filterByCategoryService: FilterByCategoryService,  private router: Router,private userService: UserService, private recipeService: RecipeService,){}

  ngOnInit() {
    // Cargar todas las categorias al renderizar la plantilla
    this.getAllCategories();
    this.getAllRecipes();
  }

  // Metodo para obtener todas las categorias
  getAllCategories(): void {
    this.filterByCategoryService.getAllCategorys().subscribe((data: Category[]) =>{
      console.log("Categories received:", data);
      this.categoryList = data;
    })
  }

  // Metodo para obtener todas las recetas
  getAllRecipes(): void {
    this.recipeService.getRecipes().subscribe((data: Recipe[]) => {
      this.categoryRecipesFromJson = data;
    });
  }

  // Metodo para obtener las recetas de la categoria
getRecipesFromCategory(){
  this.filterByCategoryService.getAllRecipesFromCategory(this.selectedCategory).subscribe((data: Recipe[]) =>{
    this.recipeFromCategoryList = data;
  })
}

// Metodo para obtener la receta de la categoria
getRecipeFromCategory(){
  this.filterByCategoryService.getRecipeFromCategory(this.selectedIdFromRecipe).subscribe((data: Recipe | null)=>{
    this.recipe = data;
  })

}


addRecipesToCategoryFromJson(){
this.categoryRecipesFromJson = this.categoryRecipesFromJson.filter((recipe)=> recipe.strMeal === this.selectedCategory )
}

// Metodo para ver los detalles de la receta
viewRecipeDetails(id: string): void {
  // Verifica si el usuario ya esta cargado
  this.userService.getUserProfile().subscribe(user => {
    // Verifica el plan del usuario y navega segun corresponda
    if (user.userPlan === 'premium') {
      this.router.navigate(['/plan-premium/recipe-details', id]); // Ruta para usuarios premium
    } else {
      this.router.navigate(['/plan-basico/recipe-details', id]); // Ruta para usuarios basicos
    }
  }, error => {
    console.error('Error getting user profile:', error);
    // Si hay un error al cargar el perfil, puedes redirigir a una ruta predeterminada
    this.router.navigate(['/plan-basico/recipe-details', id]);
  });
}


}
