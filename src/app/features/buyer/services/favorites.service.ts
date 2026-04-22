import { Injectable, computed, signal } from '@angular/core';
import { IFavorite } from '../models/favorite.model';
import { IProduct } from '@features/catalog/models/product.model';

const SEED_FAVORITES: IFavorite[] = [
  {
    id: 'fav-1',
    productId: '2',
    productName: 'San Agustín Washed',
    productOrigin: 'Huila',
    productPrice: 38000,
    productImageUrl: '/assets/products/san-agustin.jpg',
    productRating: 4.8,
    productCategory: 'Café Especial',
    addedAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'fav-2',
    productId: '7',
    productName: 'Cauca Geisha',
    productOrigin: 'Cauca',
    productPrice: 75000,
    productImageUrl: '/assets/products/cauca.jpg',
    productRating: 4.9,
    productCategory: 'Microlotes',
    addedAt: '2025-04-01T14:00:00Z',
  },
  {
    id: 'fav-3',
    productId: '4',
    productName: 'Blend Sierra Nevada',
    productOrigin: 'Magdalena',
    productPrice: 28000,
    productImageUrl: '/assets/products/sierra.jpg',
    productRating: 4.5,
    productCategory: 'Blend',
    addedAt: '2025-04-10T09:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _favorites = signal<IFavorite[]>(SEED_FAVORITES);

  readonly all = computed(() => this._favorites());
  readonly count = computed(() => this._favorites().length);

  isFavorite(productId: string): boolean {
    return this._favorites().some(f => f.productId === productId);
  }

  toggle(product: IProduct): void {
    if (this.isFavorite(product.id)) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  add(product: IProduct): void {
    if (this.isFavorite(product.id)) return;
    const fav: IFavorite = {
      id: `fav-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productOrigin: product.region,
      productPrice: product.price,
      productImageUrl: product.images[0] ?? '',
      productRating: product.rating,
      productCategory: product.category,
      addedAt: new Date().toISOString(),
    };
    this._favorites.update(list => [...list, fav]);
  }

  remove(productId: string): void {
    this._favorites.update(list => list.filter(f => f.productId !== productId));
  }
}
