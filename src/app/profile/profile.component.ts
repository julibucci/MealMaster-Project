import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  currentUserId: string | null = null;

  constructor(private userService: UserService,
      private router: Router,
      private route: ActivatedRoute) {}

  ngOnInit(): void {
     // Cargar el perfil del usuario al inicio
     this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.currentUserId = user.id; // Asignar el ID del usuario actual
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user profile';
      }
    });
  }

  loadUserProfile(): void {
    const userId = localStorage.getItem('authUserId'); // Recupera el ID del usuario autenticado
    if (userId) {
      this.userService.getUserProfileById(userId).subscribe({
        next: (userData) => (this.user = userData),
        error: (error) =>
          (this.errorMessage = 'Failed to load profile. Please try again later.'),
      });
    } else {
      this.errorMessage = 'User is not logged in';
    }
  }

  onFileSelected(event: Event): void {
    if (!this.user) {
      console.error('User is not loaded');
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file || !this.currentUserId) {
        console.error('No file or user ID found');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Asegúrate de pasar el currentUserId correctamente
      this.userService.uploadProfileImage(this.currentUserId, formData).subscribe({
        next: (response) => {
          console.log('Image uploaded:', response.imageUrl);
          if (this.user) {  // Comprobamos que user no es null
            this.user.profileImage = response.imageUrl;
          }
        },
        error: (err) => {
          console.error('Error uploading image:', err);
        },
      });
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (this.user) {
        this.user.profileImage = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    if (this.user) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);

        const userId = this.userService.getCurrentUserId(); // Obtiene el userId actual
        if (!userId) {
          this.errorMessage = 'User ID not found. Cannot upload profile image.';
          return;
        }

        this.userService.uploadProfileImage(userId, formData).subscribe({
          next: (response) => {
            // Aquí accedemos a la propiedad `imageUrl` del objeto recibido
            this.user!.profileImage = response.imageUrl;
            this.updateUserProfile();
          },
          error: () => (this.errorMessage = 'Failed to upload profile image. Please try again later.'),
        });
      } else {
        this.updateUserProfile(); // Si no hay nueva imagen, solo actualizamos el perfil
      }
    }
  }

  updateUserProfile(): void {
    if (this.user) {
      this.userService.updateUserProfile(this.user).subscribe({
        next: () => alert('Profile updated successfully'),
        error: () =>
          (this.errorMessage =
            'Failed to update profile. Please try again later.'),
      });
    }
  }

  upgradeToPremium(): void {
    if (this.user && this.user.userPlan !== 'premium') {
      this.user.userPlan = 'premium'; // Cambiar el plan a premium
      this.userService.updateUserProfile(this.user).subscribe({
        next: () => alert('You have been upgraded to the Premium plan!'),
        error: () =>
          (this.errorMessage =
            'Failed to upgrade profile. Please try again later.'),
      });
    }
  }



  deleteProfile(): void {
    if (
      this.user &&
      confirm(
        'Are you sure you want to delete your profile? This action cannot be undone.'
      )
    ) {
      this.userService.deleteUserProfile(this.user.id).subscribe({
        next: () => {
          alert('Profile deleted successfully');
          this.user = null;
        },
        error: () =>
          (this.errorMessage =
            'Failed to delete profile. Please try again later.'),
      });
    }
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}

