import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-coupon-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './coupon-input.component.html',
  styleUrl: './coupon-input.component.scss',
})
export class CouponInputComponent {
  readonly appliedCoupon  = input<string | null>(null);
  readonly discountAmount = input<number>(0);

  readonly apply  = output<string>();
  readonly remove = output<void>();

  protected readonly couponInput = signal('');

  protected onInput(event: Event): void {
    this.couponInput.set((event.target as HTMLInputElement).value);
  }

  protected onApply(): void {
    const code = this.couponInput().trim();
    if (code) {
      this.apply.emit(code);
      this.couponInput.set('');
    }
  }

  protected onRemove(): void {
    this.remove.emit();
  }
}
