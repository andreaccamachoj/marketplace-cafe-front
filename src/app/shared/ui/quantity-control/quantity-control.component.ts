import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-control',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantityControlComponent),
      multi: true,
    },
  ],
  template: `
    <div class="qty" role="group" aria-label="Cantidad">
      <button
        type="button"
        class="qty__btn"
        [disabled]="isDisabled() || qty() <= min"
        aria-label="Disminuir cantidad"
        (click)="decrement()"
      >−</button>

      <output class="qty__value" aria-live="polite">{{ qty() }}</output>

      <button
        type="button"
        class="qty__btn"
        [disabled]="isDisabled() || qty() >= max"
        aria-label="Aumentar cantidad"
        (click)="increment()"
      >+</button>
    </div>
  `,
  styleUrl: './quantity-control.component.scss',
})
export class QuantityControlComponent implements ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 999;
  @Input() step = 1;

  @Output() quantityChange = new EventEmitter<number>();

  protected readonly qty = signal(1);
  protected readonly isDisabled = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (v: number) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  writeValue(val: number): void {
    this.qty.set(val ?? this.min);
  }

  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  protected increment(): void {
    const next = Math.min(this.qty() + this.step, this.max);
    this.update(next);
  }

  protected decrement(): void {
    const next = Math.max(this.qty() - this.step, this.min);
    this.update(next);
  }

  private update(val: number): void {
    this.qty.set(val);
    this.onChange(val);
    this.onTouched();
    this.quantityChange.emit(val);
  }
}
