import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IAddress } from '../../models/checkout.model';
import { SHIPPING_OPTIONS } from '../../models/shipping.model';
import { ShippingSelectorComponent } from '../shipping-selector/shipping-selector.component';
import { CouponInputComponent } from '../coupon-input/coupon-input.component';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, ShippingSelectorComponent, CouponInputComponent],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
})
export class CartSummaryComponent {
  readonly subtotal           = input.required<number>();
  readonly shipping           = input.required<number>();
  readonly discount           = input.required<number>();
  readonly total              = input.required<number>();
  readonly itemCount          = input.required<number>();
  readonly addresses          = input<IAddress[]>([]);
  readonly selectedAddressId  = input<string>('');
  readonly selectedShippingId = input.required<string>();
  readonly couponCode         = input<string | null>(null);

  readonly addressChange = output<string>();
  readonly shippingChange = output<string>();
  readonly couponApply    = output<string>();
  readonly couponRemove   = output<void>();
  readonly checkoutClick  = output<void>();

  protected readonly shippingOptions = SHIPPING_OPTIONS;

  protected onAddressChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.addressChange.emit(select.value);
  }
}
