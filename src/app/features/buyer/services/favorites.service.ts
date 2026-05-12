import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IFavorite } from '../models/favorite.model';
import { IProduct } from '@features/catalog/models/product.model';

interface BackendFavorite { id: string; productId: string; addedAt: string; }

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _favorites = signal<IFavorite[]>([]);

  readonly all = computed(() => this._favorites());
  readonly count = computed(() => this._favorites().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendFavorite[]>('/favorites').subscribe({ next: list => this.loadWithProducts(list) });
  }

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
    this.http.post(`/favorites/${product.id}`, {}).subscribe({
      next: () => {
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
      },
    });
  }

  remove(productId: string): void {
    this.http.delete(`/favorites/${productId}`).subscribe({
      next: () => this._favorites.update(list => list.filter(f => f.productId !== productId)),
    });
  }

  private loadWithProducts(list: BackendFavorite[]): void {
    this._favorites.set(list.map(f => ({
      id: f.id,
      productId: f.productId,
      productName: 'Producto',
      productOrigin: '',
      productPrice: 0,
      productImageUrl: '',
      productRating: 0,
      productCategory: '',
      addedAt: f.addedAt,
    })));
  }
}
