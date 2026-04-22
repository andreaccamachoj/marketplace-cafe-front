import { Injectable, computed, signal } from '@angular/core';
import { IAdminCategory } from '../models/admin-category.model';

const SEED_CATEGORIES: IAdminCategory[] = [
  {
    id: 'cat-1',
    name: 'Café Especial',
    slug: 'cafe-especial',
    description: 'Cafés de origen único con puntuación SCA superior a 80 puntos',
    productCount: 28,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    iconEmoji: '⭐',
  },
  {
    id: 'cat-2',
    name: 'Café Orgánico',
    slug: 'cafe-organico',
    description: 'Producido sin pesticidas sintéticos ni fertilizantes químicos',
    productCount: 15,
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    iconEmoji: '🌿',
  },
  {
    id: 'cat-3',
    name: 'Microlotes',
    slug: 'microlotes',
    description: 'Lotes pequeños de producción artesanal con trazabilidad completa',
    productCount: 9,
    active: true,
    createdAt: '2025-02-10T00:00:00Z',
    iconEmoji: '🔬',
  },
  {
    id: 'cat-4',
    name: 'Cold Brew',
    slug: 'cold-brew',
    description: 'Variedades seleccionadas para preparación en frío',
    productCount: 6,
    active: true,
    createdAt: '2025-03-01T00:00:00Z',
    iconEmoji: '🧊',
  },
  {
    id: 'cat-5',
    name: 'Blend',
    slug: 'blend',
    description: 'Mezclas balanceadas de múltiples orígenes colombianos',
    productCount: 11,
    active: false,
    createdAt: '2025-01-15T00:00:00Z',
    iconEmoji: '☕',
  },
];

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {
  private readonly _categories = signal<IAdminCategory[]>(SEED_CATEGORIES);

  readonly all = computed(() => this._categories());

  add(data: Omit<IAdminCategory, 'id' | 'createdAt' | 'productCount'>): void {
    const newCategory: IAdminCategory = {
      ...data,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      productCount: 0,
    };
    this._categories.update(list => [...list, newCategory]);
  }

  update(id: string, data: Partial<Omit<IAdminCategory, 'id' | 'createdAt' | 'productCount'>>): void {
    this._categories.update(list =>
      list.map(c => c.id === id ? { ...c, ...data } : c),
    );
  }

  toggleActive(id: string): void {
    this._categories.update(list =>
      list.map(c => c.id === id ? { ...c, active: !c.active } : c),
    );
  }

  remove(id: string): void {
    this._categories.update(list => list.filter(c => c.id !== id));
  }
}
