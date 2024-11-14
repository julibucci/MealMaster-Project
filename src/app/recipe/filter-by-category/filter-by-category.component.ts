import { Category } from './../../models/category';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Recipe } from '../../interfaces/recipe.interface';
import { FilterByCategoryService } from '../../services/filter-by-category.service';
import { RecipeService } from '../../services/recipes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private filterByCategoryService: FilterByCategoryService){}

  ngOnInit() {
    // Cargar todas las categorias al renderizar la plantilla
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.filterByCategoryService.getAllCategorys().subscribe((data: Category[]) =>{
      console.log("Categorías recibidas:", data);
      this.categoryList = data;
    })
  }

getRecipesFromCategory(){
  this.filterByCategoryService.getAllRecipesFromCategory(this.selectedCategory).subscribe((data: Recipe[]) =>{
    this.recipeFromCategoryList = data;
  })
}

getRecipeFromCategory(){
  this.filterByCategoryService.getRecipeFromCategory(this.selectedIdFromRecipe).subscribe((data: Recipe | null)=>{
    this.recipe = data;
  })

}

addRecipesToCategoryFromJson(){
this.categoryRecipesFromJson = this.categoryRecipesFromJson.filter((recipe)=> recipe.strMeal === this.selectedCategory )
}
}
