import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../models/product.model';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { StockIndicatorComponent } from '@shared/ui/stock-indicator/stock-indicator.component';
import { CertificationLabelPipe } from '@shared/pipes/certification-label.pipe';
import { CurrencyCopPipe } from '@shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    StockIndicatorComponent,
    CertificationLabelPipe,
    CurrencyCopPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="product-card" role="article">
      <div class="product-card__image-container">
        <img
          [src]="product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image'"
          [alt]="product.name"
          class="product-card__image"
          loading="lazy"
        />
        <span class="product-card__region-badge" [attr.aria-label]="'Región: ' + product.region">
          {{ product.region }}
        </span>
        <button
          type="button"
          class="product-card__wishlist-btn"
          [attr.aria-label]="'Agregar ' + product.name + ' a favoritos'"
          (click)="onToggleFavorite()"
          title="Agregar a favoritos"
        >
          ♡
        </button>
      </div>

      <div class="product-card__content">
        <div class="product-card__certs">
          @for (cert of product.certifications; track cert) {
            <span class="product-card__cert-badge" [ngClass]="'cert--' + cert.toLowerCase()">
              {{ cert | certificationLabel }}
            </span>
          }
        </div>

        <h3 class="product-card__name">{{ product.name }}</h3>
        <p class="product-card__producer">{{ product.producerName }}</p>

        <div class="product-card__rating">
          <span class="product-card__stars" [attr.aria-label]="product.rating + ' de 5 estrellas'">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <span class="product-card__star" [class.product-card__star--filled]="i <= product.rating">★</span>
            }
          </span>
          <span class="product-card__review-count">({{ product.reviewCount }})</span>
        </div>

        <app-stock-indicator
          [stock]="product.stock"
          [maxStock]="product.maxStock || 100"
        ></app-stock-indicator>

        <div class="product-card__footer">
          <span class="product-card__price">{{ product.price | currencyCop }}</span>
          <app-button
            variant="primary"
            size="sm"
            (click)="onAdd()"
            [attr.aria-label]="'Agregar ' + product.name + ' al carrito'"
          >
            Agregar
          </app-button>
        </div>
      </div>
    </article>
  `,
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: IProduct;
  @Output() add = new EventEmitter<IProduct>();
  @Output() toggleFavorite = new EventEmitter<string>();

  protected onAdd(): void { this.add.emit(this.product); }
  protected onToggleFavorite(): void { this.toggleFavorite.emit(this.product.id); }
}
