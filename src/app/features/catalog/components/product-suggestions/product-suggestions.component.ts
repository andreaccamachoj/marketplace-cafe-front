import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../models/product.model';
import { CurrencyCopPipe } from '@shared/pipes/currency-cop.pipe';

@Component({
  selector: 'app-product-suggestions',
  standalone: true,
  imports: [RouterLink, CurrencyCopPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (products.length) {
      <section class="suggestions-section" aria-labelledby="suggestions-title">
        <div class="section-header-row">
          <div>
            <div class="section-eyebrow">También te puede gustar</div>
            <h2 class="section-title" id="suggestions-title">Más cafés especiales</h2>
          </div>
        </div>
        <div class="suggestions-grid">
          @for (prod of products; track prod.id) {
            <a
              class="sug-card"
              [routerLink]="['/productos', prod.id]"
              [attr.aria-label]="prod.name + ' por ' + prod.producerName"
            >
              <!-- Image / Emoji area -->
              <div class="sug-img">
                <div
                  class="sug-img-bg"
                  style="background: linear-gradient(135deg, var(--marfil, #e4dcd1), var(--crema, #cdc4b5))"
                  aria-hidden="true"
                ></div>
                @if (prod.images.length > 0) {
                  <img
                    [src]="prod.images[0]"
                    [alt]="prod.name"
                    class="sug-img-photo"
                    loading="lazy"
                  />
                } @else {
                  <span class="sug-emoji" aria-hidden="true">{{ prod.emoji || '☕' }}</span>
                }
                <!-- Region badge overlay -->
                <span class="sug-region" aria-hidden="true">{{ prod.region }}</span>
              </div>

              <!-- Card body -->
              <div class="sug-body">
                <div class="sug-producer">{{ prod.producerName }}</div>
                <p class="sug-name">{{ prod.name }}</p>
                <div class="sug-rating" [attr.aria-label]="prod.rating + ' de 5 estrellas'">
                  <span class="sug-stars" aria-hidden="true">
                    @for (s of [1,2,3,4,5]; track s) {
                      <span [style.color]="s <= prod.rating ? 'var(--amber,#c07820)' : 'rgba(55,38,23,.15)'">★</span>
                    }
                  </span>
                  <span class="sug-rating-val">{{ prod.rating }}</span>
                </div>
              </div>

              <!-- Card footer -->
              <div class="sug-footer">
                <div>
                  <span class="sug-price">{{ prod.price | currencyCop }}</span>
                  <span class="sug-price-unit"> / {{ prod.unit || '500g' }}</span>
                </div>
                <button
                  class="btn-sug-add"
                  type="button"
                  (click)="$event.preventDefault(); productSelected.emit(prod.id)"
                  [attr.aria-label]="'Agregar ' + prod.name + ' al carrito'"
                >+</button>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `,
  styleUrl: './product-suggestions.component.scss',
})
export class ProductSuggestionsComponent {
  @Input() products: IProduct[] = [];
  @Output() productSelected = new EventEmitter<string>();
}
