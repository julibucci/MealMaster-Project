import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  @Output() imageUploaded = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.imageUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post<{ imageUrl: string }>('/api/upload-recipe-image', formData).subscribe({
        next: (response) => {
          console.log('Imagen subida exitosamente:', response);
          this.imageUploaded.emit(response.imageUrl); // Emitir URL de la imagen
        },
        error: (error) => {
          console.error('Error al subir la imagen:', error);
        }
      });
    }
  }
}

