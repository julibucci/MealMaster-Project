import { Component, OnInit } from '@angular/core';
import { MealPlanService } from '../../services/meal-plan-service.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meal-plan-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-plan-component.component.html',
  styleUrl: './meal-plan-component.component.css'
})
export class MealPlanComponentComponent implements OnInit {
  userId: string = '';
  isPremium: boolean = false;
  mealPlan: any[] = [];
  selectedCategory: string = '';
  selectedDay: string = '';
  recipeId: string = '';
  mealPlans: any[] = [];
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private mealPlanService: MealPlanService, private userService: UserService, private router: Router,private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.userId = this.userService.getCurrentUserId() || '';

    this.userService.getUserProfileById(this.userId).subscribe((user) => {
      this.isPremium = user.userPlan === 'premium';
      if (this.isPremium) {
        this.loadMealPlan();
      }
    });
    this.recipeId = this.route.snapshot.paramMap.get('id') || '';
    this.setRecipeId();
  }

  setRecipeId(): void {
    if (this.mealPlans.length > 0) {
      const firstMealPlan = this.mealPlans[0];
      this.recipeId = firstMealPlan.recipe.idMeal;
      console.log('ID de la receta:', this.recipeId);
    }
  }

  sortMealPlan(): void {
    this.mealPlan.sort((a, b) => {
      // Primero, ordenar por si la categoria es "uncategorized"
      if (a.category === 'uncategorized' && b.category !== 'uncategorized') {
        return -1; // A es "uncategorized" y B no, entonces A va primero
      }
      if (a.category !== 'uncategorized' && b.category === 'uncategorized') {
        return 1;  // B es "uncategorized" y A no, entonces B va primero
      }

      // Ahora, ordenar por si tiene dia asignado
      if (!a.day && b.day) return -1;  // A sin dia antes que B con dia
      if (a.day && !b.day) return 1;   // A con dia después que B sin dia

      // Aca ordena por el dia de la semana (lunes, martes, etc.)
      const dayOrder = this.daysOfWeek.indexOf(a.day || '') - this.daysOfWeek.indexOf(b.day || '');
      return dayOrder;
    });
    console.log('After sorting:', this.mealPlan);
  }

  // Cargar el plan de comidas
  loadMealPlan(): void {
    this.mealPlanService.getMealPlan(this.userId).subscribe((plan) => {
      console.log('API Response:', plan);

      this.mealPlan = plan;
      this.mealPlan.forEach((meal) => {
        meal.selectedCategory = meal.category || '';
        meal.selectedDay = meal.day || 'Selecciona un día';
      });

    }, (error) => {
      console.error('Error loading meal plan:', error);
    });
  }

  // Eliminar receta del meal plan
  removeMeal(mealId: string): void {
    this.mealPlanService.removeMealFromPlan(mealId).subscribe(() => {
      this.mealPlan = this.mealPlan.filter((meal) => meal.id !== mealId);
    });
  }


  updateMealDay(mealId: string, event: any): void {
    const newDay = event.target.value;
    this.mealPlanService.updateMealDay(mealId, newDay).subscribe(() => {
      const meal = this.mealPlan.find((meal) => meal.id === mealId);
      if (meal) {
        meal.selectedDay = newDay;
      }
    });
    this.sortMealPlan();
  }

  // Actualizar la categoria de la receta
  updateMealCategory(mealId: string, event: any): void {
    const newCategory = event.target.value;

    const meal = this.mealPlan.find((meal) => meal.id === mealId);
    if (meal) {
      meal.selectedCategory = newCategory;
    }

    this.mealPlanService.updateMealCategory(mealId, newCategory).subscribe(
      (updatedMeal) => {
        console.log('Category updated successfully:', updatedMeal);
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }

  // Ver detalles de la receta
  viewRecipeDetails(id: string): void {
        this.router.navigate(['/plan-premium/recipe-details', id]);
  }

  goToCategoryPage(): void {
    this.router.navigate(['/plan-premium/Categories']);
  }

}
