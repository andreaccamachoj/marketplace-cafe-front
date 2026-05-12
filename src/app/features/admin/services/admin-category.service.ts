import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IAdminCategory } from '../models/admin-category.model';

function mapCategory(b: Record<string, unknown>): IAdminCategory {
  return {
    id: String(b['id']),
    name: String(b['name'] ?? ''),
    slug: String(b['slug'] ?? ''),
    description: String(b['description'] ?? ''),
    productCount: Number(b['productCount'] ?? 0),
    active: Boolean(b['active'] !== false),
    createdAt: String(b['createdAt'] ?? ''),
    iconEmoji: String(b['iconEmoji'] ?? '☕'),
  };
}

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _categories = signal<IAdminCategory[]>([]);

  readonly all = computed(() => this._categories());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/admin/categories').subscribe({
      next: list => this._categories.set(list.map(mapCategory)),
    });
  }

  add(data: Omit<IAdminCategory, 'id' | 'createdAt' | 'productCount'>): void {
    this.http.post<Record<string, unknown>>('/admin/categories', data).subscribe({
      next: c => this._categories.update(list => [...list, mapCategory(c)]),
    });
  }

  update(id: string, data: Partial<Omit<IAdminCategory, 'id' | 'createdAt' | 'productCount'>>): void {
    this.http.put<Record<string, unknown>>(`/admin/categories/${id}`, data).subscribe({
      next: c => this._categories.update(list => list.map(x => x.id === id ? mapCategory(c) : x)),
    });
  }

  toggleActive(id: string): void {
    const current = this._categories().find(c => c.id === id);
    if (!current) return;
    this.update(id, { active: !current.active });
  }

  remove(id: string): void {
    this.http.delete(`/admin/categories/${id}`).subscribe({
      next: () => this._categories.update(list => list.filter(c => c.id !== id)),
    });
  }
}
