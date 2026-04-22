import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss',
})
export class ReviewModalComponent {
  readonly open = input<boolean>(false);
  readonly productName = input<string>('');

  readonly submitted = output<{ rating: number; comment: string }>();
  readonly closed = output<void>();

  protected readonly rating = signal(0);
  protected readonly comment = signal('');
  protected readonly hoverRating = signal(0);

  protected readonly displayRating = computed(() => this.hoverRating() || this.rating());

  protected readonly starValues = [1, 2, 3, 4, 5];

  protected onOverlayClick(e: MouseEvent): void {
    void e;
    this.closed.emit();
  }

  protected onInput(e: Event): void {
    this.comment.set((e.target as HTMLTextAreaElement).value);
  }

  protected onSubmit(): void {
    if (this.rating() === 0) return;
    this.submitted.emit({ rating: this.rating(), comment: this.comment() });
    this.rating.set(0);
    this.comment.set('');
    this.hoverRating.set(0);
  }
}
