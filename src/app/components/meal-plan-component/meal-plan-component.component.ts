import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private mealPlanService: MealPlanService, private userService: UserService, private router: Router,private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}


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
    const dayOrder = this.daysOfWeek.reduce((acc, day, index) => {
      acc[day] = index;
      return acc;
    }, {} as Record<string, number>);

    this.mealPlan.sort((a, b) => {
      const orderA = dayOrder[a.selectedDay] !== undefined ? dayOrder[a.selectedDay] : 999;
      const orderB = dayOrder[b.selectedDay] !== undefined ? dayOrder[b.selectedDay] : 999;
      return orderA - orderB;
    });
  }

  // Cargar el plan de comidas
  loadMealPlan(): void {
    this.mealPlanService.getMealPlan(this.userId).subscribe((plan) => {
      console.log('API Response:', plan);

      this.mealPlan = plan;
      this.mealPlan.forEach((meal) => {
        meal.selectedCategory = meal.category || '';
        meal.selectedDay = meal.day || 'Selecciona un día';
        meal.recipe.imageUrl = meal.recipe.imageUrl || meal.recipe.strMealThumb;
      });

      this.sortMealPlan();
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
    this.mealPlan = [...this.mealPlan]; // Crear una nueva referencia para que Angular lo detecte
    this.cdr.detectChanges(); // Forzar la detección de cambios
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
