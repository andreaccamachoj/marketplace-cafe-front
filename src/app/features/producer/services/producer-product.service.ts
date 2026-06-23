import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { IManagedProduct } from '../models/managed-product.model';


function mapProduct(b: Record<string, unknown>): IManagedProduct {
  return {
    id:             String(b['id']),
    emoji:          String(b['emoji'] ?? '🫘'),
    name:           String(b['name'] ?? ''),
    description:    b['description'] ? String(b['description']) : '',
    region:         b['region'] ? String(b['region']) : '',
    category:       String(b['categoryName'] ?? ''),
    categoryId:     b['categoryId'] ? String(b['categoryId']) : undefined,
    unit:           String(b['unit'] ?? '500g'),
    status:         (['active','inactive','draft'].includes(String(b['status']?.toString().toLowerCase()))
                      ? String(b['status']?.toString().toLowerCase())
                      : 'draft') as 'active' | 'inactive' | 'draft',
    price:          Number(b['price'] ?? 0),
    stock:          Number(b['stock'] ?? 0),
    certifications: Array.isArray(b['certificationCodes']) ? (b['certificationCodes'] as string[]) : [],
    rating:         Number(b['rating'] ?? 0),
    reviewCount:    Number(b['reviewCount'] ?? 0),
    salesCount:     Number(b['soldCount'] ?? 0),
  };
}

@Injectable({ providedIn: 'root' })
export class ProducerProductService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _products = signal<IManagedProduct[]>([]);

  readonly products = this._products.asReadonly();

  readonly activeCount = computed(
    () => this._products().filter(p => p.status === 'active').length,
  );

  readonly pendingCount = computed(
    () => this._products().filter(p => p.status === 'draft').length,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.load();
  }

  load(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._products.set([]);
    this.http.get<Record<string, unknown>[]>('/producer/products').subscribe({
      next: list => this._products.set(list.map(mapProduct)),
    });
  }

  add(data: Partial<IManagedProduct>, coverFile?: File | null): void {
    this.http.post<Record<string, unknown>>('/producer/products', {
      categoryId:  data.categoryId ?? null,
      name:        data.name,
      description: data.description ?? '',
      price:       data.price ?? 0,
      unit:        data.unit ?? '500g',
      region:      data.region ?? '',
      emoji:       data.emoji ?? '🫘',
      stock:       data.stock ?? 0,
      status:      data.status ?? 'draft',
      certifications: data.certifications ?? [],
    }).pipe(
      switchMap(p => this.attachCover(mapProduct(p), coverFile)),
    ).subscribe({ next: product => this._products.update(list => [...list, product]) });
  }

  update(id: string, data: Partial<IManagedProduct>, coverFile?: File | null): void {
    const current = this._products().find(p => p.id === id);
    this.http.put<Record<string, unknown>>(`/producer/products/${id}`, {
      name:        data.name,
      description: data.description ?? current?.description ?? '',
      price:       data.price,
      unit:        data.unit,
      region:      data.region ?? current?.region ?? '',
      emoji:       data.emoji ?? current?.emoji ?? '🫘',
      categoryId:  data.categoryId ?? current?.categoryId ?? null,
      stock:       data.stock ?? current?.stock ?? 0,
      status:        data.status ?? current?.status ?? 'draft',
      certifications: data.certifications ?? current?.certifications ?? [],
    }).pipe(
      switchMap(p => this.attachCover(mapProduct(p), coverFile)),
    ).subscribe({ next: product => this._products.update(list => list.map(x => x.id === id ? product : x)) });
  }

  uploadCover(id: string, file: File): Observable<IManagedProduct> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Record<string, unknown>>(`/producer/products/${id}/cover`, form).pipe(map(mapProduct));
  }

  deleteCover(id: string): Observable<IManagedProduct> {
    return this.http.delete<Record<string, unknown>>(`/producer/products/${id}/cover`).pipe(map(mapProduct));
  }

  private attachCover(product: IManagedProduct, coverFile?: File | null): Observable<IManagedProduct> {
    return coverFile ? this.uploadCover(product.id, coverFile) : of(product);
  }

  toggleStatus(id: string): void {
    const current = this._products().find(p => p.id === id);
    if (!current) return;
    if (current.status === 'active') {
      this.http.post(`/producer/products/${id}/archive`, {}).subscribe({
        next: () => this._products.update(list => list.map(p => p.id === id ? { ...p, status: 'inactive' as const } : p)),
      });
    }
  }

  remove(id: string): void {
    this._products.update(list => list.filter(p => p.id !== id));
  }
}
