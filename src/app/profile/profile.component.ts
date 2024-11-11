import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule], // Agregar FormsModule aquí
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (userData) => (this.user = userData),
      error: (error) =>
        (this.errorMessage = 'Failed to load profile. Please try again later.'),
    });
  }

  saveProfile(): void {
    if (this.user) {
      this.userService.updateUserProfile(this.user).subscribe({
        next: () => alert('Profile updated successfully'),
        error: () =>
          (this.errorMessage =
            'Failed to update profile. Please try again later.'),
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
  }
}

