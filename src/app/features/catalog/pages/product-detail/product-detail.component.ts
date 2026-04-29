import {
  Component, inject, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { IProduct } from '../../models/product.model';
import { IReview } from '../../models/review.model';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { CartService } from '@features/buyer/services/cart.service';
import { FavoritesService } from '@features/buyer/services/favorites.service';

import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';
import { ProductOptionsComponent } from '../../components/product-options/product-options.component';
import { ProductCtaComponent } from '../../components/product-cta/product-cta.component';
import { ProductDetailTabsComponent } from '../../components/product-detail-tabs/product-detail-tabs.component';
import { ProductSuggestionsComponent } from '../../components/product-suggestions/product-suggestions.component';
import { LandingNavbarComponent } from '@shared/layout/landing-navbar/landing-navbar.component';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    LandingNavbarComponent,
    ProductGalleryComponent,
    ProductOptionsComponent,
    ProductCtaComponent,
    ProductDetailTabsComponent,
    ProductSuggestionsComponent,
    RelativeTimePipe,
    LoadingSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Navbar pública — siempre visible -->
    <app-landing-navbar
      [showLinks]="false"
      (searchChange)="onNavSearch($event)"
    />

    @if (product(); as prod) {

      <!-- Full-width breadcrumb bar -->
      <nav class="pd-bc-bar" aria-label="Ruta de navegación">
        <div class="pd-bc-inner">
          <a routerLink="/" class="pd-bc-link">Inicio</a>
          <span class="pd-bc-sep" aria-hidden="true">›</span>
          <a routerLink="/" class="pd-bc-link">Catálogo</a>
          <span class="pd-bc-sep" aria-hidden="true">›</span>
          <span class="pd-bc-current" aria-current="page">{{ prod.name }}</span>
        </div>
      </nav>

      <main class="pd" id="main-content">

        <!-- ── Product main section ── -->
        <section class="product-section" aria-label="Detalle del producto">
          <div class="product-grid">

            <!-- Left: sticky gallery -->
            <div class="gallery-col">
              <app-product-gallery
                [images]="prod.images"
                [productName]="prod.name"
                [emoji]="prod.emoji || '☕'"
                [certifications]="prod.certifications"
              />
            </div>

            <!-- Right: info panel -->
            <div class="info-panel" id="product-info">

              <!-- Producer + title + rating -->
              <div class="info-top">
                <div class="prod-producer">
                  {{ prod.producerName }}
                  <span class="verified-badge">✓ Verificado</span>
                </div>
                <h1 class="prod-title">{{ prod.name }}</h1>
                <div class="prod-rating-row">
                  <span
                    class="prod-stars"
                    [attr.aria-label]="prod.rating + ' estrellas de 5'"
                    aria-hidden="true"
                  >
                    @for (s of [1,2,3,4,5]; track s) {
                      <span [style.color]="s <= prod.rating ? 'var(--amber,#c07820)' : 'rgba(55,38,23,.2)'">★</span>
                    }
                  </span>
                  <span class="rating-num">{{ prod.rating }}</span>
                  <a class="rating-count" href="#reviews-section">{{ prod.reviewCount }} reseñas</a>
                  @if (prod.soldCount) {
                    <span class="sold-count">· +{{ prod.soldCount }} vendidos</span>
                  }
                </div>
              </div>

              <!-- Favorite toggle -->
              <button
                type="button"
                class="btn-favorite"
                [class.btn-favorite--active]="isFav()"
                [attr.aria-label]="isFav() ? 'Eliminar de favoritos' : 'Agregar a favoritos'"
                (click)="toggleFavorite()"
              >
                {{ isFav() ? '❤️' : '🤍' }} {{ isFav() ? 'En favoritos' : 'Agregar a favoritos' }}
              </button>

              <!-- Options: presentation + roast -->
              @if (prod.presentationTypes?.length || prod.roastLevels?.length) {
                <app-product-options
                  [presentationTypes]="prod.presentationTypes ?? []"
                  [roastLevels]="prod.roastLevels ?? []"
                />
              }

              <!-- CTA: price + stock + buttons -->
              <app-product-cta
                [price]="prod.price"
                [originalPrice]="prod.originalPrice"
                [discountPercent]="prod.discountPercent"
                [unit]="prod.unit"
                [stock]="prod.stock"
                [maxStock]="prod.maxStock ?? 100"
                [producerName]="prod.producerName"
                [region]="prod.region"
                (addToCart)="onAddToCart($event)"
                (buyNow)="onBuyNow($event)"
              />

            </div><!-- /info-panel -->
          </div><!-- /product-grid -->
        </section>

        <!-- ── Detail tabs ── -->
        <section class="detail-section" aria-label="Información detallada">
          <app-product-detail-tabs
            [description]="prod.description"
            [flavorNotes]="prod.flavorNotes ?? []"
            [cuppingScore]="prod.cuppingScore"
            [cuppingAttributes]="prod.cuppingAttributes ?? []"
            [farmInfo]="prod.farmInfo"
          />
        </section>

        <!-- ── Reviews section (outside tabs) ── -->
        <section class="reviews-section" id="reviews-section" aria-label="Reseñas del producto">
          <div class="section-header-row">
            <div>
              <div class="section-eyebrow">Lo que dicen los clientes</div>
              <h2 class="section-title">Reseñas</h2>
            </div>
          </div>

          <!-- Rating summary -->
          @if (reviews().length) {
            <div class="reviews-summary">
              <div class="summary-score">
                <div class="summary-big-num">{{ prod.rating }}</div>
                <div class="summary-stars" aria-hidden="true">★★★★★</div>
                <div class="summary-total">{{ prod.reviewCount }} reseñas</div>
              </div>
              <div class="summary-bars" aria-hidden="true">
                @for (star of [5,4,3,2,1]; track star) {
                  <div class="bar-row">
                    <span class="bar-lbl">{{ star }}</span>
                    <div class="bar-track">
                      <div class="bar-fill" [style.width.%]="getStarPercent(star)"></div>
                    </div>
                    <span class="bar-count">{{ getStarCount(star) }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Review list -->
            <div class="reviews-list">
              @for (review of reviews(); track review.id) {
                <article class="review-card">
                  <div class="review-header">
                    <div
                      class="reviewer-avatar"
                      [attr.aria-label]="review.userInitials"
                    >{{ review.userInitials }}</div>
                    <div class="reviewer-info">
                      <div class="reviewer-name">{{ review.userName }}</div>
                      <div class="reviewer-date">{{ review.date | relativeTime }}</div>
                    </div>
                    <div class="review-stars" [attr.aria-label]="review.rating + ' de 5 estrellas'" aria-hidden="true">
                      @for (s of [1,2,3,4,5]; track s) {
                        <span [style.color]="s <= review.rating ? 'var(--amber,#c07820)' : 'rgba(55,38,23,.15)'">★</span>
                      }
                    </div>
                    @if (review.isVerifiedPurchase) {
                      <span class="review-badge">✓ Verificado</span>
                    }
                  </div>
                  <p class="review-text">{{ review.comment }}</p>
                  <div class="review-helpful">
                    <button class="btn-helpful" type="button">
                      👍 Útil ({{ review.helpfulCount }})
                    </button>
                  </div>
                </article>
              }
            </div>

            <!-- Write review CTA -->
            <div class="review-cta" role="complementary">
              <p class="review-cta-title">¿Ya probaste este café?</p>
              <p class="review-cta-sub">Comparte tu experiencia con la comunidad cafetera</p>
              <button class="btn-write-review" type="button">Escribir reseña</button>
            </div>
          }
        </section>

        <!-- ── Related products ── -->
        <app-product-suggestions [products]="related()" />

      </main>

    } @else {
      <div class="pd__loading" role="status" aria-label="Cargando producto">
        <app-loading-spinner />
      </div>
    }
  `,
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private readonly route          = inject(ActivatedRoute);
  private readonly router         = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly reviewService  = inject(ReviewService);
  private readonly cartService    = inject(CartService);
  private readonly favSvc         = inject(FavoritesService);

  protected readonly product = toSignal<IProduct | undefined>(
    this.route.data.pipe(map(d => d['product'] as IProduct | undefined)),
    { initialValue: undefined }
  );

  protected readonly reviews = toSignal(
    this.route.data.pipe(
      map(d => d['product'] as IProduct | undefined),
      switchMap(prod =>
        prod ? this.reviewService.listByProductId(prod.id) : of([] as IReview[])
      )
    ),
    { initialValue: [] as IReview[] }
  );

  protected readonly isFav = computed(() => {
    const prod = this.product();
    return prod ? this.favSvc.isFavorite(prod.id) : false;
  });

  protected toggleFavorite(): void {
    const prod = this.product();
    if (prod) this.favSvc.toggle(prod);
  }

  protected readonly related = computed<IProduct[]>(() => {
    const prod = this.product();
    if (!prod) return [];
    return this.productService
      .list({ category: prod.category })
      .filter(p => p.id !== prod.id)
      .slice(0, 4);
  });

  protected getStarCount(star: number): number {
    return this.reviews().filter(r => Math.round(r.rating) === star).length;
  }

  protected getStarPercent(star: number): number {
    const total = this.reviews().length;
    if (!total) return 0;
    return Math.round(this.getStarCount(star) / total * 100);
  }

  /** Búsqueda desde la navbar: navega al catálogo con el query param */
  protected onNavSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/'], { queryParams: { q: query.trim() } });
    }
  }

  protected onAddToCart(qty: number): void {
    const prod = this.product();
    if (!prod) return;
    for (let i = 0; i < qty; i++) {
      this.cartService.add({
        id:        prod.id,
        productId: prod.id,
        name:      prod.name,
        producer:  prod.producerName,
        price:     prod.price,
        emoji:     prod.emoji ?? '☕',
        organic:   prod.certifications.includes('ORGANIC'),
        fairTrade: prod.certifications.includes('FAIRTRADE'),
        maxStock:  prod.maxStock ?? prod.stock,
      });
    }
  }

  protected onBuyNow(qty: number): void {
    this.onAddToCart(qty);
    this.router.navigate(['/buyer']);
  }
}
