import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { PlanBasicoComponent } from './page/plan-basico/plan-basico.component';
import { PlanPremiumComponent } from './page/plan-premium/plan-premium.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { PaginaPrincipalComponent } from './page/pagina-principal/pagina-principal.component';


export const routes: Routes = [
  {
    path: '', 
    component: HomeComponent,
    children: [
      { path: '', component: PaginaPrincipalComponent }, 
      { path: 'recipes', component: RecipeListComponent }, 
      { path: 'auth', component: AuthComponent } 
    ]
  },
  { 
    path: 'plan-basico', 
    component: PlanBasicoComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'recipes', component: RecipeListComponent },
    ]
  },
  { 
    path: 'plan-premium', 
    component: PlanPremiumComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'recipes', component: RecipeListComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];








