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
  readonly subtotal          = input.required<number>();
  readonly shipping          = input.required<number>();
  readonly discount          = input.required<number>();
  readonly total             = input.required<number>();
  readonly itemCount         = input.required<number>();
  readonly defaultAddress    = input<IAddress | null>(null);
  readonly selectedShippingId = input.required<string>();
  readonly couponCode        = input<string | null>(null);

  readonly shippingChange = output<string>();
  readonly couponApply    = output<string>();
  readonly couponRemove   = output<void>();
  readonly checkoutClick  = output<void>();

  protected readonly shippingOptions = SHIPPING_OPTIONS;
}
