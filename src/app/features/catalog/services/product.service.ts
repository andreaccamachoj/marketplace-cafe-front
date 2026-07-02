import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import {
  IProduct, CatalogFilter, SortBy,
  ICuppingAttribute, IFlavorNote, Certification,
} from '../models/product.model';

interface BackendProduct {
  id: string;
  name: string;
  producerName: string | null;
  categoryName: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  unit: string | null;
  region: string | null;
  emoji: string | null;
  coverImageUrl: string | null;
  soldCount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: { imageUrl: string; displayOrder: number }[] | null;
  presentations: { presentation: string }[] | null;
  flavorNotes: { name: string; icon: string; intensity: number }[] | null;
  cupping: { score: number; aroma: number; flavor: number; body: number; finish: number } | null;
  certificationCodes: string[] | null;
}

function mapBackendProduct(b: BackendProduct): IProduct {
  const attrs: ICuppingAttribute[] = b.cupping
    ? [
        { label: 'Aroma',  value: b.cupping.aroma  },
        { label: 'Sabor',  value: b.cupping.flavor },
        { label: 'Cuerpo', value: b.cupping.body   },
        { label: 'Final',  value: b.cupping.finish },
      ]
    : [];
  const flavorNotes: IFlavorNote[] = (b.flavorNotes ?? []).map(fn => ({
    icon: fn.icon, name: fn.name, intensity: fn.intensity,
  }));
  return {
    id: b.id, name: b.name,
    producerName:    b.producerName ?? '',
    category:        b.categoryName ?? '',
    description:     b.description ?? '',
    price:           b.price,
    unit:            b.unit ?? undefined,
    rating: b.rating ?? 0, reviewCount: b.reviewCount ?? 0, stock: b.stock ?? 0,
    soldCount:       b.soldCount,
    images:          (b.images ?? []).sort((a, x) => a.displayOrder - x.displayOrder).map(i => i.imageUrl),
    certifications:  (b.certificationCodes ?? []) as Certification[],
    region:          b.region ?? '',
    emoji:           b.emoji ?? undefined,
    coverImageUrl:   b.coverImageUrl ?? undefined,
    originalPrice:   b.originalPrice ?? undefined,
    discountPercent: b.discountPercent ?? undefined,
    presentationTypes: (b.presentations ?? []).map(p => p.presentation),
    flavorNotes,
    cuppingScore:      b.cupping?.score ?? undefined,
    cuppingAttributes: attrs.length ? attrs : undefined,
  };
}


@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _products = signal<IProduct[]>([]);
  readonly count = computed(() => this._products().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.load();
  }

  load(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendProduct[]>('/catalog/products?size=100').subscribe({
      next: list => this._products.set(list.map(mapBackendProduct)),
    });
  }

  list(filter?: CatalogFilter): IProduct[] {
    let result = [...this._products()];

    if (filter?.category) {
      const q = filter.category.toLowerCase();
      result = result.filter(p => p.category.toLowerCase() === q);
    }
    if (filter?.certs && filter.certs.length > 0) {
      result = result.filter(p =>
        filter.certs!.some(c => p.certifications.includes(c as Certification))
      );
    }
    if (filter?.presentation) {
      const pres = filter.presentation.toLowerCase();
      result = result.filter(p =>
        p.presentationTypes?.some(pt => pt.toLowerCase() === pres)
      );
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.producerName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (filter?.sort) {
      result = this.sortProducts(result, filter.sort);
    }
    return result;
  }

  getById(id: string): Observable<IProduct | undefined> {
    const cached = this._products().find(p => p.id === id);
    if (cached) return of(cached);
    return this.http.get<BackendProduct>(`/catalog/products/${id}`).pipe(
      map(b => mapBackendProduct(b)),
    );
  }

  getByIdSync(id: string): IProduct | undefined {
    return this._products().find(p => p.id === id);
  }

  search(query: string): IProduct[] {
    return this.list({ query });
  }

  private sortProducts(prods: IProduct[], sortBy: SortBy): IProduct[] {
    const sorted = [...prods];
    switch (sortBy) {
      case 'price-asc':  return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
      case 'rating':     return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':     return sorted.reverse();
      default:           return sorted;
    }
  }
}
