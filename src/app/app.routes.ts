import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './page/home/home.component';
import { PlanBasicoComponent } from './page/plan-basico/plan-basico.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'plan-basico', component: PlanBasicoComponent } 
];








