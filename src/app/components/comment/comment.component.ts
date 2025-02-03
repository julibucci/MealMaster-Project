import { Component, Input } from '@angular/core';
import { CommentService } from '../../services/comment-service.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comments: any[] = [];  // Recibe los comentarios
  @Input() recipeId: string = '';  // Recibe el ID de la receta

  expanded: boolean = false; // Para controlar el despliegue de los comentarios
  editingCommentId: string | null = null; // Para identificar el comentario en edición
  editedText: string = '';

  constructor(
    private commentService: CommentService,
    private userService: UserService
  ) {}

  // Verificar si el comentario pertenece al usuario actual
  canDeleteComment(comment: any): boolean {
    const currentUserId = this.userService.getCurrentUserId();
    console.log("Current User ID:", currentUserId);
    console.log("Comment's User ID:", comment.userId);

    return String(comment.userId) === String(currentUserId);
  }

  // Eliminar comentario
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== commentId); // Eliminar el comentario de la lista
    });
  }

  // Alternar despliegue de los comentarios
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

   // Iniciar edicion del comentario
   startEditing(comment: any): void {
    this.editingCommentId = comment.id;
    this.editedText = comment.comment;
  }

  // Guardar edicion del comentario
  saveEdit(): void {
    if (this.editingCommentId) {
      const comment = this.comments.find(c => c.id === this.editingCommentId);
      if (comment) {
        comment.comment = this.editedText;
        this.commentService.updateComment(comment).subscribe(updatedComment => {
          // Actualiza el comentario en la lista local despues de guardarlo en el servidor
          const index = this.comments.findIndex(c => c.id === updatedComment.id);
          if (index !== -1) {
            this.comments[index] = updatedComment;
          }
          this.editingCommentId = null; // Salir del modo edicion
          this.editedText = '';
        });
      }
    }
  }

  // Cancelar edicion del comentario
  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedText = '';
  }

}
