import { Component, Input } from '@angular/core';
import { CommentService } from '../../services/comment-service.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comments: any[] = [];  // Recibe los comentarios
  @Input() recipeId: string = '';  // Recibe el ID de la receta

  constructor(
    private commentService: CommentService,
    private userService: UserService
  ) {}

  // Verificar si el comentario pertenece al usuario actual
  canDeleteComment(comment: any): boolean {
    const currentUserId = this.userService.getCurrentUserId();
    return comment.userId === currentUserId;
  }

  // Eliminar comentario
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(comment => comment.id !== commentId); // Eliminar el comentario de la lista
    });
  }

}
