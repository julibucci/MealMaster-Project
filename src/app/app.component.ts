import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Importa RouterOutlet para cargar las rutas
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FormsModule } from '@angular/forms';    // Importar FormsModule
import { HttpClientModule } from '@angular/common/http';  // Importar HttpClientModule para peticiones HTTP
import { routes } from './app.routes';  // Importar las rutas definidas
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RecipeDetailsComponent } from './components/recipe-details-component/recipe-details-component.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterOutlet,
    FavoritesComponent,RecipeDetailsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MealMaster';
}
