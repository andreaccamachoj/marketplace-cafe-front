import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  input,
  output,
} from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { IAddress } from '../../models/checkout.model';
import { PaymentMethodService } from '../../services/payment-method.service';

const WHATSAPP_NUMBER = '+57 314 865 4210';

@Component({
  selector: 'app-checkout-overlay',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './checkout-overlay.component.html',
  styleUrl:    './checkout-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOverlayComponent {
  readonly open            = input<boolean>(false);
  readonly total           = input<number>(0);
  readonly itemCount       = input<number>(0);
  readonly selectedAddress = input<IAddress | null>(null);
  readonly confirming      = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly platformId      = inject(PLATFORM_ID);
  private readonly paymentMethodSvc = inject(PaymentMethodService);

  protected readonly paymentMethods = this.paymentMethodSvc.paymentMethods;
  protected readonly whatsappNumber = WHATSAPP_NUMBER;

  /** Cerrar con Escape (solo cuando el overlay está visible). */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open() && !this.confirming() && isPlatformBrowser(this.platformId)) {
      this.cancelled.emit();
    }
  }

  protected onConfirm(): void {
    if (!this.confirming()) {
      this.confirmed.emit();
    }
  }

  protected onCancel(): void {
    if (!this.confirming()) {
      this.cancelled.emit();
    }
  }

  protected onBackdropClick(): void {
    this.onCancel();
  }
}
