import { Injectable, computed, signal } from '@angular/core';
import { IManagedProduct } from '../models/managed-product.model';

const SEED_PRODUCTS: IManagedProduct[] = [
  {
    id: 'pp1',
    emoji: '☕',
    name: 'Geisha Washed',
    category: 'Especial',
    status: 'active',
    price: 58000,
    stock: 35,
    certifications: ['organico', 'fairtrade'],
    rating: 4.9,
    reviewCount: 43,
    salesCount: 127,
  },
  {
    id: 'pp2',
    emoji: '🫘',
    name: 'Tabi Natural',
    category: 'Microlote',
    status: 'active',
    price: 42000,
    stock: 60,
    certifications: ['rainforest'],
    rating: 4.7,
    reviewCount: 29,
    salesCount: 89,
  },
  {
    id: 'pp3',
    emoji: '🌿',
    name: 'Caturra Honey',
    category: 'Honey Process',
    status: 'active',
    price: 36000,
    stock: 80,
    certifications: ['organico'],
    rating: 4.5,
    reviewCount: 18,
    salesCount: 61,
  },
  {
    id: 'pp4',
    emoji: '🍂',
    name: 'Bourbon Natural',
    category: 'Natural',
    status: 'inactive',
    price: 29000,
    stock: 0,
    certifications: [],
    rating: 4.3,
    reviewCount: 12,
    salesCount: 34,
  },
  {
    id: 'pp5',
    emoji: '🏔',
    name: 'Castillo Washed',
    category: 'Lavado',
    status: 'draft',
    price: 32000,
    stock: 45,
    certifications: ['fairtrade'],
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
  },
];

@Injectable({ providedIn: 'root' })
export class ProducerProductService {
  private readonly _products = signal<IManagedProduct[]>(SEED_PRODUCTS);

  readonly products = this._products.asReadonly();

  readonly activeCount = computed(
    () => this._products().filter(p => p.status === 'active').length,
  );

  readonly pendingCount = computed(
    () => this._products().filter(p => p.status === 'draft').length,
  );

  toggleStatus(id: string): void {
    this._products.update(list =>
      list.map(p => {
        if (p.id !== id) return p;
        const next =
          p.status === 'active'
            ? 'inactive'
            : p.status === 'inactive'
              ? 'active'
              : 'active'; // draft -> active
        return { ...p, status: next };
      }),
    );
  }

  remove(id: string): void {
    this._products.update(list => list.filter(p => p.id !== id));
  }
}
