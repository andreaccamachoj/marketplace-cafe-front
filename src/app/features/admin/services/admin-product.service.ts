import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface IAdminProduct {
  id: string;
  emoji: string;
  name: string;
  category: string;
  producer: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft' | 'pending';
}

function mapProduct(b: Record<string, unknown>): IAdminProduct {
  const raw = String(b['status'] ?? 'draft').toLowerCase();
  const status = (['active', 'inactive', 'draft', 'pending'].includes(raw)
    ? raw : 'draft') as IAdminProduct['status'];
  return {
    id:       String(b['id']),
    emoji:    String(b['emoji'] ?? '🫘'),
    name:     String(b['name'] ?? ''),
    category: String(b['categoryName'] ?? ''),
    producer: String(b['producerName'] ?? ''),
    price:    Number(b['price'] ?? 0),
    stock:    Number(b['stock'] ?? 0),
    status,
  };
}

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _products = signal<IAdminProduct[]>([]);

  readonly all = computed(() => this._products());
  readonly pendingCount = computed(() => this._products().filter(p => p.status === 'draft').length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/admin/products').subscribe({
      next: list => this._products.set(list.map(mapProduct)),
    });
  }

  activate(id: string): void {
    this.http.patch(`/admin/products/${id}/activate`, {}).subscribe({
      next: () => this._products.update(list =>
        list.map(p => p.id === id ? { ...p, status: 'active' as const } : p)
      ),
    });
  }
}
