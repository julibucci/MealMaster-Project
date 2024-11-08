import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  formUser: FormGroup;
  user: User | null = null;
  isEditMode: boolean = false;
  private userService: UserService;

  constructor(private fb: FormBuilder, private injector: Injector) {
    this.userService = this.injector.get(UserService); // Inyección indirecta
    this.formUser = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profileImage: ['']
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  // profile.component.ts
getUserProfile(): void {
  this.userService.getUser().subscribe(
    (data) => {
      if (data && data.id) { // Verifica si el usuario tiene un `id`
        this.user = data;
        this.formUser.patchValue(data);
        this.isEditMode = true; // Cambia a modo edición si el perfil ya existe
      } else {
        this.user = null;
        this.formUser.reset();
        this.isEditMode = false; // Cambia a modo creación si no hay perfil
      }
    },
    (error) => {
      console.error('Error al obtener el perfil del usuario', error);
      this.user = null;
      this.formUser.reset();
      this.isEditMode = false; // Cambia a modo creación en caso de error
    }
  );
}


  // profile.component.ts
saveUserProfile(): void {
  if (this.formUser.valid) {
    const userData = { ...this.user, ...this.formUser.value };

    if (this.isEditMode && userData.id) {
      // Modo edición: actualizar perfil existente
      this.userService.updateUser(userData).subscribe(
        (updatedUser) => {
          this.user = updatedUser;
          console.log('Profile updated successfully');
        },
        (error) => console.error('Error updating profile', error)
      );
    } else {
      // Modo creación: crear nuevo perfil
      this.userService.createUser(this.formUser.value).subscribe(
        (createdUser) => {
          this.user = createdUser;
          this.isEditMode = true; // Cambia a modo edición después de crear
          console.log('Profile created successfully');
        },
        (error) => console.error('Error creating profile', error)
      );
    }
  }
}


  deleteUserProfile(): void {
    if (this.user && confirm('¿Estás seguro de que quieres eliminar tu perfil?')) {
      this.userService.deleteUser(this.user.id).subscribe(
        () => {
          console.log('Perfil eliminado exitosamente');
          this.user = null;
          this.formUser.reset();
          this.isEditMode = false;
        },
        (error) => console.error('Error al eliminar el perfil', error)
      );
    }
  }
}
