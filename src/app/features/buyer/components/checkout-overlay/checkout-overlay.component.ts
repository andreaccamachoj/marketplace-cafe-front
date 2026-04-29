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

interface IPaymentMethod {
  id: string;
  name: string;
  emoji: string;
  accentColor: string;
  lines: { label: string; value: string }[];
}

const PAYMENT_METHODS: IPaymentMethod[] = [
  {
    id: 'nequi',
    name: 'Nequi',
    emoji: '📱',
    accentColor: '#6C0E99',
    lines: [
      { label: 'Número',   value: '314 865 4210' },
      { label: 'Titular',  value: 'World Coffee Marketplace SAS' },
    ],
  },
  {
    id: 'bancolombia',
    name: 'Bancolombia',
    emoji: '🏦',
    accentColor: '#FDBD00',
    lines: [
      { label: 'Cuenta de ahorros', value: '421-654321-12' },
      { label: 'NIT',               value: '900.542.310-7' },
      { label: 'Titular',           value: 'World Coffee Marketplace SAS' },
    ],
  },
  {
    id: 'daviplata',
    name: 'Daviplata',
    emoji: '💜',
    accentColor: '#E11E8E',
    lines: [
      { label: 'Número',  value: '314 865 4210' },
      { label: 'Titular', value: 'World Coffee Marketplace SAS' },
    ],
  },
  {
    id: 'breb',
    name: 'BRE-B',
    emoji: '⚡',
    accentColor: '#0057A8',
    lines: [
      { label: 'Alias',   value: 'wcm.pagos' },
      { label: 'Banco',   value: 'Bancolombia · BRE-B' },
      { label: 'Titular', value: 'World Coffee Marketplace SAS' },
    ],
  },
];

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

  private readonly platformId = inject(PLATFORM_ID);

  protected readonly paymentMethods = PAYMENT_METHODS;
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
