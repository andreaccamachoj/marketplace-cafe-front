import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { IReview } from '../../models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
})
export class ReviewCardComponent {
  readonly review  = input.required<IReview>();
  readonly isOwner = input<boolean>(false);

  readonly edit   = output<IReview>();
  readonly delete = output<string>();

  protected readonly confirmingDelete = signal(false);

  protected readonly starValues = [1, 2, 3, 4, 5];

  protected formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  protected onEdit(): void {
    this.edit.emit(this.review());
  }

  protected onDeleteRequest(): void {
    this.confirmingDelete.set(true);
  }

  protected onDeleteConfirm(): void {
    this.delete.emit(this.review().id);
    this.confirmingDelete.set(false);
  }

  protected onDeleteCancel(): void {
    this.confirmingDelete.set(false);
  }
}
