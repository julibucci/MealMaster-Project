import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailsComponent } from './components/recipe-details-component/recipe-details-component.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: '/favorites', pathMatch: 'full' },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'recipe-details/:id', component: RecipeDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
