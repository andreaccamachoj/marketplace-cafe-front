import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { IReview, IReviewPayload } from '../../models/review.model';

@Component({
  selector: 'app-review-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './review-form-modal.component.html',
  styleUrl: './review-form-modal.component.scss',
})
export class ReviewFormModalComponent implements OnInit {
  readonly review      = input<IReview | null>(null);
  readonly open        = input.required<boolean>();
  readonly productName = input<string>('');

  readonly closed = output<void>();
  readonly saved  = output<IReviewPayload>();

  protected readonly hoverRating = signal(0);

  protected readonly form = new FormGroup({
    rating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(5)],
    }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(80),
      ],
    }),
    body: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(600),
      ],
    }),
  });

  protected readonly selectedRating = computed(() => this.form.get('rating')?.value ?? 0);
  protected readonly displayRating  = computed(() => this.hoverRating() || this.selectedRating());
  protected readonly bodyLength     = computed(() => this.form.get('body')?.value?.length ?? 0);

  protected readonly modalTitle = computed(() =>
    this.review() ? 'Editar reseña' : 'Escribir reseña',
  );

  protected readonly starValues = [1, 2, 3, 4, 5];

  private readonly _ = effect(() => {
    const rev = this.review();
    if (rev) {
      this.form.patchValue({
        rating: rev.rating,
        title:  rev.title,
        body:   rev.body,
      });
    } else {
      this.form.reset({ rating: 0, title: '', body: '' });
    }
  });

  ngOnInit(): void {
    const rev = this.review();
    if (rev) {
      this.form.patchValue({ rating: rev.rating, title: rev.title, body: rev.body });
    }
  }

  protected onStarHover(n: number): void {
    this.hoverRating.set(n);
  }

  protected onStarLeave(): void {
    this.hoverRating.set(0);
  }

  protected onStarClick(n: number): void {
    this.form.get('rating')?.setValue(n);
    this.form.get('rating')?.markAsDirty();
  }

  protected onClose(): void {
    this.form.reset({ rating: 0, title: '', body: '' });
    this.hoverRating.set(0);
    this.closed.emit();
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.getRawValue();
    const rev = this.review();
    this.saved.emit({
      productId: rev?.productId ?? '',
      orderId:   rev?.orderId   ?? '',
      rating:    val.rating,
      title:     val.title,
      body:      val.body,
    });
    this.onClose();
  }

  protected get titleControl(): FormControl<string> {
    return this.form.get('title') as FormControl<string>;
  }

  protected get bodyControl(): FormControl<string> {
    return this.form.get('body') as FormControl<string>;
  }
}
