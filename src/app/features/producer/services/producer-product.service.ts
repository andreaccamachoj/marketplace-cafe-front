import { Injectable, computed, signal } from '@angular/core';
import { IManagedProduct } from '../models/managed-product.model';

const SEED_PRODUCTS: IManagedProduct[] = [
  {
    id: 'pp1',
    emoji: '🫘',
    name: 'Café Especial Huila',
    category: 'Grano entero',
    unit: '500g',
    status: 'active',
    price: 48000,
    stock: 85,
    certifications: ['organico', 'fairtrade'],
    rating: 4.9,
    reviewCount: 128,
    salesCount: 320,
  },
  {
    id: 'pp2',
    emoji: '🌸',
    name: 'San Agustín Washed',
    category: 'Grano entero',
    unit: '500g',
    status: 'active',
    price: 64000,
    stock: 18,
    certifications: ['organico', 'fairtrade'],
    rating: 5.0,
    reviewCount: 42,
    salesCount: 110,
  },
  {
    id: 'pp3',
    emoji: '🌿',
    name: 'Nariño Natural',
    category: 'Tostado oscuro',
    unit: '500g',
    status: 'active',
    price: 52000,
    stock: 6,
    certifications: ['organico', 'rainforest'],
    rating: 4.8,
    reviewCount: 63,
    salesCount: 175,
  },
  {
    id: 'pp4',
    emoji: '🏔️',
    name: 'Blend Sierra Nevada',
    category: 'Molido',
    unit: '500g',
    status: 'active',
    price: 38000,
    stock: 72,
    certifications: ['rainforest'],
    rating: 4.7,
    reviewCount: 74,
    salesCount: 210,
  },
  {
    id: 'pp5',
    emoji: '✨',
    name: 'Cauca Geisha',
    category: 'Grano entero',
    unit: '250g',
    status: 'draft',
    price: 98000,
    stock: 12,
    certifications: ['organico'],
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
  },
  {
    id: 'pp6',
    emoji: '🖤',
    name: 'Tostado Oscuro',
    category: 'Tostado oscuro',
    unit: '500g',
    status: 'inactive',
    price: 35000,
    stock: 0,
    certifications: ['fairtrade'],
    rating: 4.4,
    reviewCount: 28,
    salesCount: 80,
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
