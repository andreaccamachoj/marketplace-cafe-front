import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { IProduct, IReview } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { CertificationLabelPipe } from '@shared/pipes/certification-label.pipe';
import { CurrencyCopPipe } from '@shared/pipes/currency-cop.pipe';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProductGalleryComponent,
    ButtonComponent,
    BadgeComponent,
    CertificationLabelPipe,
    CurrencyCopPipe,
    LoadingSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as prod) {
      <main class="product-detail">
        <div class="product-detail__breadcrumb">
          <a href="/"  class="breadcrumb-link">Catálogo</a>
          <span>/</span>
          <span>{{ prod.name }}</span>
        </div>

        <div class="product-detail__layout">
          <div class="product-detail__gallery">
            <app-product-gallery
              [images]="prod.images"
              [productName]="prod.name"
            ></app-product-gallery>
          </div>

          <div class="product-detail__info">
            <div class="product-detail__header">
              <h1 class="product-detail__title">{{ prod.name }}</h1>
              <p class="product-detail__producer">por {{ prod.producerName }}</p>
              <span class="product-detail__region-badge">{{ prod.region }}</span>
            </div>

            <div class="product-detail__rating">
              <span class="product-detail__stars" [attr.aria-label]="prod.rating + ' de 5 estrellas'">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                  <span class="product-detail__star" [class.product-detail__star--filled]="i <= prod.rating">★</span>
                }
              </span>
              <span class="product-detail__reviews">{{ prod.reviewCount }} reseñas</span>
            </div>

            <div class="product-detail__certs">
              @for (cert of prod.certifications; track cert) {
                <app-badge variant="success" size="sm">
                  {{ cert | certificationLabel }}
                </app-badge>
              }
            </div>

            <div class="product-detail__price">
              {{ prod.price | currencyCop }}
            </div>

            <p class="product-detail__description">
              {{ prod.description }}
            </p>

            <div class="product-detail__stock">
              Stock disponible: <strong>{{ prod.stock }}</strong> unidades
            </div>

            <app-button
              variant="primary"
              size="lg"
              class="product-detail__add-btn"
              (click)="onAddToCart()"
            >
              Agregar al Carrito
            </app-button>
          </div>
        </div>
      </main>
    } @else {
      <div class="product-detail__loading">
        <app-loading-spinner></app-loading-spinner>
      </div>
    }
  `,
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly reviewService = inject(ReviewService);

  protected readonly product$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => id ? this.productService.getById(id) : Promise.resolve(undefined))
  );

  protected readonly product = signal<any>(undefined);

  constructor() {
    this.product$.subscribe(prod => this.product.set(prod));
  }

  protected onAddToCart(): void {
    // TODO: Connect to CartService
  }
}
