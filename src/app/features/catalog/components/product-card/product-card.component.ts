import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../models/product.model';
import { CurrencyCopPipe } from '@shared/pipes/currency-cop.pipe';
import { FavoritesService } from '@features/buyer/services/favorites.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyCopPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="product-card"
      [attr.aria-label]="product.name + ' — ' + product.producerName"
    >
      <!-- Área imagen / ilustración -->
      <div class="card-img" [style.background]="product.bg || 'rgba(74,140,86,.08)'">
        <div class="card-img-bg"></div>
        @if (product.coverImageUrl) {
          <img class="card-cover-img" [src]="product.coverImageUrl" [alt]="product.name" />
        } @else {
          <div class="card-img-illustration" aria-hidden="true">{{ product.emoji || '☕' }}</div>
        }
        <div class="card-img-region">📍 {{ product.region }}</div>

        <!-- Badges certificación — arriba izquierda -->
        <div class="card-badges" aria-label="Certificaciones">
          @for (cert of product.certifications; track cert) {
            <span class="badge" [ngClass]="certBadgeClass(cert)">{{ certLabel(cert) }}</span>
          }
        </div>

        <!-- Wishlist — arriba derecha (solo compradores) -->
        @if (canPurchase()) {
          <button
            type="button"
            class="card-wishlist"
            [class.active]="isFav()"
            [attr.aria-label]="(isFav() ? 'Quitar de' : 'Agregar a') + ' lista de deseos'"
            [attr.aria-pressed]="isFav()"
            (click)="onToggleFavorite()"
          >{{ isFav() ? '♥' : '♡' }}</button>
        }
      </div>

      <!-- Cuerpo -->
      <div class="card-body">
        <div class="card-producer">{{ product.producerName }}</div>
        <h2 class="card-name">
          <a [routerLink]="['/productos', product.id]" class="card-name-link">{{ product.name }}</a>
        </h2>
        <p class="card-desc">{{ product.description }}</p>

        <!-- Rating -->
        <div class="card-rating">
          <span class="stars" [attr.aria-label]="'Calificación ' + product.rating + ' de 5 estrellas'">
            {{ starsHtml(product.rating) }}
          </span>
          <span class="rating-count">{{ product.rating }} ({{ product.reviewCount }} reseñas)</span>
        </div>

        <!-- Barra de stock -->
        <div class="stock-bar-wrap">
          <div class="stock-label">{{ stockLabel() }}</div>
          <div class="stock-bar"
               role="progressbar"
               [attr.aria-valuenow]="stockPct()"
               aria-valuemin="0"
               aria-valuemax="100"
               aria-label="Disponibilidad">
            <div class="stock-fill" [ngClass]="stockClass()" [style.width.%]="stockPct()"></div>
          </div>
        </div>
      </div>

      <!-- Footer tarjeta -->
      <div class="card-footer">
        <div class="card-price">
          <span class="price-label">Precio</span>
          <span class="price-value">{{ product.price | currencyCop }}</span>
          <span class="price-unit">/ {{ product.unit || '500g' }}</span>
        </div>
        @if (canPurchase()) {
          <button
            type="button"
            class="btn-add-cart"
            [class.added]="inCart"
            [disabled]="product.stock === 0"
            [attr.aria-label]="product.stock === 0 ? 'Sin stock: ' + product.name : (inCart ? 'Ya en carrito' : 'Agregar al carrito') + ': ' + product.name"
            (click)="onAdd()"
          >
            @if (product.stock === 0) {
              <span>Sin stock</span>
            } @else if (inCart) {
              <span>✓ En carrito</span>
            } @else {
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span>Agregar</span>
            }
          </button>
        }
      </div>
    </article>
  `,
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private readonly favSvc = inject(FavoritesService);

  @Input({ required: true }) product!: IProduct;
  @Input() inCart = false;

  /** Controla si se muestran acciones de compra (carrito, favoritos).
   *  Verdadero para compradores y usuarios no autenticados; falso para productores/admins. */
  readonly canPurchase = input(true);

  @Output() add            = new EventEmitter<IProduct>();
  @Output() toggleFavorite = new EventEmitter<string>();

  protected isFav(): boolean { return this.favSvc.isFavorite(this.product.id); }

  protected onAdd(): void {
    if (this.product.stock === 0) return;
    this.add.emit(this.product);
  }
  protected onToggleFavorite(): void { this.toggleFavorite.emit(this.product.id); }

  protected starsHtml(rating: number): string {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  protected stockPct(): number {
    return this.product.maxStock
      ? Math.round((this.product.stock / this.product.maxStock) * 100)
      : this.product.stock;
  }

  protected stockClass(): string {
    if (this.product.stock === 0) return 'stock-out';
    const pct = this.stockPct();
    if (pct > 60) return 'stock-high';
    if (pct > 20) return 'stock-medium';
    return 'stock-low';
  }

  protected stockLabel(): string {
    if (this.product.stock === 0) return 'Sin stock';
    const pct = this.stockPct();
    if (pct > 60) return `Stock disponible (${pct}%)`;
    if (pct > 20) return `Stock limitado (${pct}%)`;
    return `Últimas unidades (${pct}%)`;
  }

  protected certBadgeClass(cert: string): string {
    switch (cert) {
      case 'ORGANIC':    return 'badge-org';
      case 'FAIRTRADE':  return 'badge-fair';
      case 'RAINFOREST': return 'badge-rain';
      default: return '';
    }
  }

  protected certLabel(cert: string): string {
    switch (cert) {
      case 'ORGANIC':    return 'Orgánico';
      case 'FAIRTRADE':  return 'Fairtrade';
      case 'RAINFOREST': return 'Rainforest';
      default: return cert;
    }
  }
}
