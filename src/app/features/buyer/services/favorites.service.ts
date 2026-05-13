import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IFavorite } from '../models/favorite.model';
import { IProduct } from '@features/catalog/models/product.model';
import { ProductService } from '@features/catalog/services/product.service';

interface BackendFavorite { id: string; productId: string; addedAt: string; }

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly http        = inject(HttpClient);
  private readonly platformId  = inject(PLATFORM_ID);
  private readonly productSvc  = inject(ProductService);
  private readonly _favorites  = signal<IFavorite[]>([]);

  readonly all   = computed(() => this._favorites());
  readonly count = computed(() => this._favorites().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    // Intentar carga inicial; si el usuario no está autenticado el error se silencia.
    // BuyerDashboardComponent.ngOnInit() llama load() garantizando datos tras el login.
    this.load();
  }

  load(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendFavorite[]>('/favorites').subscribe({
      next: list => this._favorites.set(list.map(f => this.enrich(f))),
      error: () => {},
    });
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
      next: (res: unknown) => {
        const b = res as BackendFavorite | null;
        const fav = b?.id
          ? this.enrich(b)
          : this.fromProduct(product);
        this._favorites.update(list => [...list, fav]);
      },
    });
  }

  remove(productId: string): void {
    this.http.delete(`/favorites/${productId}`).subscribe({
      next: () => this._favorites.update(list => list.filter(f => f.productId !== productId)),
    });
  }

  private enrich(f: BackendFavorite): IFavorite {
    const product = this.productSvc.getByIdSync(f.productId);
    return {
      id:               f.id,
      productId:        f.productId,
      productName:      product?.name     ?? 'Producto',
      productOrigin:    product?.region   ?? '',
      productPrice:     product?.price    ?? 0,
      productImageUrl:  product?.images?.[0] ?? '',
      productRating:    product?.rating   ?? 0,
      productCategory:  product?.category ?? '',
      addedAt:          f.addedAt,
    };
  }

  private fromProduct(product: IProduct): IFavorite {
    return {
      id:              `fav-${Date.now()}`,
      productId:       product.id,
      productName:     product.name,
      productOrigin:   product.region,
      productPrice:    product.price,
      productImageUrl: product.images[0] ?? '',
      productRating:   product.rating,
      productCategory: product.category,
      addedAt:         new Date().toISOString(),
    };
  }
}
