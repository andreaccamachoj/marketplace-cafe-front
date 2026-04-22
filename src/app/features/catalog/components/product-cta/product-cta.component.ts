import {
  Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { CurrencyCopPipe } from '@shared/pipes/currency-cop.pipe';
import { QuantityControlComponent } from '@shared/ui/quantity-control/quantity-control.component';

@Component({
  selector: 'app-product-cta',
  standalone: true,
  imports: [CurrencyCopPipe, QuantityControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Price block -->
    <div class="price-block" aria-label="Precio del producto">
      <span class="price-main">{{ price | currencyCop }}</span>
      <span class="price-unit">/ {{ unit || '250g' }}</span>
      @if (originalPrice && originalPrice > price) {
        <span class="price-original">{{ originalPrice | currencyCop }}</span>
        <span class="price-discount-badge">−{{ discountPercent }}%</span>
      }
    </div>

    <!-- Stock row -->
    <div class="stock-row" role="status" aria-live="polite">
      <span
        class="stock-dot"
        [class.ok]="stock > 10"
        [class.warn]="stock > 0 && stock <= 10"
        [class.out]="stock === 0"
        aria-hidden="true"
      ></span>
      <span
        class="stock-text"
        [class.stock-ok]="stock > 10"
        [class.stock-warn]="stock > 0 && stock <= 10"
        [class.stock-out]="stock === 0"
      >
        @if (stock > 10) {
          {{ stock }} unidades disponibles
        } @else if (stock > 0) {
          Quedan {{ stock }} unidades
        } @else {
          Sin stock
        }
      </span>
      @if (stock > 0) {
        <div class="stock-bar-wrap" aria-hidden="true">
          <div class="stock-bar">
            <div
              class="stock-fill"
              [class.sf-ok]="stock > 10"
              [class.sf-warn]="stock > 0 && stock <= 10"
              [style.width.%]="stockBarWidth"
            ></div>
          </div>
        </div>
      }
    </div>

    <!-- Quantity -->
    <div class="qty-row" aria-label="Seleccionar cantidad">
      <app-quantity-control
        [min]="1"
        [max]="stock"
        (quantityChange)="quantity.set($event)"
      />
      @if (stock > 0) {
        <span class="qty-max">Máx. {{ stock }} disponibles</span>
      }
    </div>

    <!-- CTA buttons: buy-now first, then add-cart, then wishlist -->
    <div class="cta-group">
      <button
        class="btn-buy-now"
        type="button"
        [disabled]="stock === 0"
        (click)="buyNow.emit(quantity())"
        [attr.aria-label]="'Comprar ahora'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <span>Comprar ahora</span>
      </button>
      <button
        class="btn-add-cart"
        type="button"
        [class.added]="cartAdded()"
        [disabled]="stock === 0"
        (click)="onAddToCart()"
        [attr.aria-label]="'Agregar al carrito'"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 2h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>
        {{ cartAdded() ? '¡Agregado!' : 'Agregar al carrito' }}
      </button>
      <button
        class="btn-wishlist-full"
        type="button"
        [class.active]="wishlistActive()"
        (click)="toggleWishlist()"
        [attr.aria-pressed]="wishlistActive()"
        aria-label="Guardar en favoritos"
      >
        <span aria-hidden="true">{{ wishlistActive() ? '♥' : '♡' }}</span>
        Guardar en favoritos
      </button>
    </div>

    <!-- Guarantees: 3 column -->
    <div class="guarantees" role="list" aria-label="Garantías del producto">
      @for (g of GUARANTEES; track g.text) {
        <div class="guarantee" role="listitem">
          <div class="guarantee-icon" aria-hidden="true">{{ g.icon }}</div>
          <div class="guarantee-text">{{ g.text }}</div>
          <div class="guarantee-sub">{{ g.sub }}</div>
        </div>
      }
    </div>

    <!-- Producer mini card -->
    @if (producerName) {
      <a class="producer-mini" [attr.aria-label]="'Ver perfil del productor ' + producerName">
        <div class="producer-avatar" aria-hidden="true">👨‍🌾</div>
        <div class="producer-info">
          <div class="producer-name">{{ producerName }}</div>
          @if (region) {
            <div class="producer-region">📍 {{ region }}</div>
          }
        </div>
        <span class="producer-arrow" aria-hidden="true">›</span>
      </a>
    }
  `,
  styleUrl: './product-cta.component.scss',
})
export class ProductCtaComponent {
  @Input() price = 0;
  @Input() originalPrice?: number;
  @Input() discountPercent?: number;
  @Input() unit?: string;
  @Input() stock = 0;
  @Input() maxStock = 100;
  @Input() producerName = '';
  @Input() region = '';

  @Output() addToCart = new EventEmitter<number>();
  @Output() buyNow    = new EventEmitter<number>();

  protected readonly quantity       = signal(1);
  protected readonly wishlistActive = signal(false);
  protected readonly cartAdded      = signal(false);

  protected get stockBarWidth(): number {
    return Math.min(Math.round(this.stock / (this.maxStock || 100) * 100), 100);
  }

  protected toggleWishlist(): void {
    this.wishlistActive.set(!this.wishlistActive());
  }

  protected onAddToCart(): void {
    this.addToCart.emit(this.quantity());
    this.cartAdded.set(true);
    setTimeout(() => this.cartAdded.set(false), 2000);
  }

  protected readonly GUARANTEES = [
    { icon: '🚚', text: 'Envío gratis', sub: 'En pedidos +$80.000' },
    { icon: '🔄', text: 'Devolución',   sub: '30 días sin costo'  },
    { icon: '🔒', text: 'Pago seguro',  sub: 'SSL · PCI DSS'      },
  ];
}
