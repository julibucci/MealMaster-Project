import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../../services/meal.service';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment-service.service';

@Component({
  selector: 'app-recipe-details-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-details-component.component.html',
  styleUrl: './recipe-details-component.component.css'
})

export class RecipeDetailsComponent implements OnInit {
  recipeId: string = '';
  recipeDetails: any = {};
  isFavorite: boolean = false;
  comments: any[] = [];
  commentForm: FormGroup;
  userId: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mealService: MealService,
    private favoriteService: FavoriteService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
    // Inicializar commentForm en el constructor
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Obtener el ID de la receta de los parámetros de la ruta
    this.recipeId = this.route.snapshot.paramMap.get('id') || '';

    // Llamar al servicio para obtener los detalles de la receta
    this.getRecipeDetails(this.recipeId);
  }

  getRecipeDetails(id: string): void {
    this.mealService.getRecipeDetails(id).subscribe(details => {
      this.recipeDetails = details.meals[0]; // Obtener la receta de la respuesta
      this.checkIfFavorite();
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

  goBack(): void {
    this.router.navigate(['/favorites']); // Redirige a la ruta de favoritos
  }

   // Verificar si la receta está en favoritos
  checkIfFavorite(): void {
    this.favoriteService.getFavorites().subscribe(favorites => {
      this.isFavorite = favorites.some(fav => fav.idMeal === this.recipeDetails.idMeal);
    });
  }

  // Agregar receta a favoritos
  addToFavorites(): void {
    const favorite = {
      userId: 1,  // Asumiendo que el usuario es el 1
      idMeal: this.recipeDetails.idMeal,
      strMeal: this.recipeDetails.strMeal,
      strMealThumb: this.recipeDetails.strMealThumb,
      category: this.recipeDetails.strCategory,
      id: this.generateId()  // Generar un ID único para el favorito
    };

    this.favoriteService.addFavorite(favorite).subscribe(() => {
      this.isFavorite = true;  // Marcar como favorito
      alert('Receta agregada a favoritos');
    });
  }

  // Método para generar un ID único (simple ejemplo)
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);  // Genera un ID aleatorio
  }


  // Agregar un comentario
  addComment(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const newComment = {
      userId: 1,  // Asumiendo que el usuario es el 1
      idMeal: this.recipeDetails.idMeal,
      comment: this.commentForm.value.comment,
      date: new Date().toISOString()  // Fecha y hora actuales
    };

    this.commentService.addComment(newComment).subscribe(comment => {
      this.comments.push(comment);  // Agregar el comentario a la lista de comentarios
      this.commentForm.reset();  // Limpiar el formulario
    });
  }

  // Obtener comentarios para la receta
  getComments(id: string): void {
    this.commentService.getCommentsByRecipe(id).subscribe(comments => {
      this.comments = comments;
    });
  }

  // Eliminar comentario
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== commentId);  // Eliminar el comentario de la lista
    });
  }

  // Verificar si el comentario pertenece al usuario actual
  canDeleteComment(comment: any): boolean {
    return comment.userId === this.userId;
  }
}
