import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingStarsComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="stars"
      [class.stars--readonly]="readonly"
      [attr.aria-label]="'Valoración: ' + rating() + ' de ' + max + ' estrellas'"
      [attr.role]="readonly ? 'img' : 'radiogroup'"
    >
      @for (star of starsArray; track star) {
        <button
          type="button"
          class="stars__star"
          [ngClass]="{
            'stars__star--filled':  star <= displayRating(),
            'stars__star--half':    false
          }"
          [attr.aria-label]="star + ' estrella' + (star > 1 ? 's' : '')"
          [attr.aria-pressed]="!readonly ? (star === rating()) : null"
          [disabled]="readonly || isDisabled() || null"
          (click)="selectRating(star)"
          (mouseenter)="hovered.set(star)"
          (mouseleave)="hovered.set(0)"
        >★</button>
      }
    </div>
  `,
  styleUrl: './rating-stars.component.scss',
})
export class RatingStarsComponent implements ControlValueAccessor {
  @Input() max = 5;
  @Input() readonly = false;

  @Output() ratingChange = new EventEmitter<number>();

  protected readonly rating = signal(0);
  protected readonly hovered = signal(0);
  protected readonly isDisabled = signal(false);

  protected readonly displayRating = computed(() =>
    this.hovered() > 0 ? this.hovered() : this.rating()
  );

  get starsArray(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (v: number) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  writeValue(val: number): void { this.rating.set(val ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  protected selectRating(star: number): void {
    if (this.readonly || this.isDisabled()) return;
    const val = this.rating() === star ? 0 : star;
    this.rating.set(val);
    this.onChange(val);
    this.onTouched();
    this.ratingChange.emit(val);
  }
}
