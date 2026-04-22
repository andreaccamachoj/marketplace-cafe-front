import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { IAddress } from '../../models/checkout.model';
import { SHIPPING_OPTIONS } from '../../models/shipping.model';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, NgClass],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
})
export class CartSummaryComponent {
  readonly subtotal = input.required<number>();
  readonly shipping = input.required<number>();
  readonly discount = input.required<number>();
  readonly total = input.required<number>();
  readonly itemCount = input.required<number>();
  readonly defaultAddress = input<IAddress | null>(null);
  readonly selectedShippingId = input.required<string>();
  readonly couponCode = input<string | null>(null);

  readonly shippingChange = output<string>();
  readonly couponApply = output<string>();
  readonly checkoutClick = output<void>();

  protected readonly shippingOptions = SHIPPING_OPTIONS;

  protected readonly couponInput = signal('');
  protected readonly couponError = signal(false);

  protected readonly selectedShippingOption = computed(() =>
    SHIPPING_OPTIONS.find(o => o.id === this.selectedShippingId()) ?? SHIPPING_OPTIONS[0],
  );

  protected onApplyCoupon(): void {
    const code = this.couponInput().trim();
    if (code) {
      this.couponApply.emit(code);
    }
  }

  protected onCouponInput(event: Event): void {
    this.couponInput.set((event.target as HTMLInputElement).value);
  }
}
