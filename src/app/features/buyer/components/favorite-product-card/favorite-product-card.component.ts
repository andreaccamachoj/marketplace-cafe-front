import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IFavorite } from '../../models/favorite.model';

@Component({
  selector: 'app-favorite-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './favorite-product-card.component.html',
  styleUrl: './favorite-product-card.component.scss',
})
export class FavoriteProductCardComponent {
  readonly favorite = input.required<IFavorite>();

  readonly remove      = output<string>();
  readonly viewProduct = output<string>();
  readonly addToCart   = output<IFavorite>();

  protected readonly starValues = [1, 2, 3, 4, 5];

  protected readonly daysAgo = computed(() => {
    const added = new Date(this.favorite().addedAt);
    const diff  = Date.now() - added.getTime();
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Hace 1 día';
    return `Hace ${days} días`;
  });

  protected onView(): void {
    this.viewProduct.emit(this.favorite().productId);
  }

  protected onAddToCart(): void {
    this.addToCart.emit(this.favorite());
  }

  protected onRemove(): void {
    this.remove.emit(this.favorite().productId);
  }
}
