import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { SkeletonComponent } from '@shared/ui/skeleton/skeleton.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, EmptyStateComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <div class="product-grid">
        @for (i of [1, 2, 3, 4, 5, 6]; track i) {
          <app-skeleton [height]="'320px'"></app-skeleton>
        }
      </div>
    } @else if (products.length === 0) {
      <app-empty-state
        title="No hay productos"
        description="No encontramos productos que coincidan con tu búsqueda"
      ></app-empty-state>
    } @else {
      <div class="product-grid">
        @for (product of products; track product.id) {
          <app-product-card
            [product]="product"
            (add)="onAddToCart($event)"
            (toggleFavorite)="onToggleFavorite($event)"
          ></app-product-card>
        }
      </div>
    }
  `,
  styleUrl: './product-grid.component.scss',
})
export class ProductGridComponent {
  @Input() products: IProduct[] = [];
  @Input() loading = false;
  @Output() addToCart = new EventEmitter<IProduct>();
  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() cardClick = new EventEmitter<string>();

  protected onAddToCart(product: IProduct): void { this.addToCart.emit(product); }
  protected onToggleFavorite(id: string): void { this.toggleFavorite.emit(id); }
}
