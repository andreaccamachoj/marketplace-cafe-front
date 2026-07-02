import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ICategory } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _categories = signal<ICategory[]>([]);
  readonly categories = this._categories.asReadonly();
  readonly count = computed(() => this._categories().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<ICategory[]>('/catalog/categories').subscribe({
      next: list => this._categories.set(list),
    });
  }

  list(): Observable<ICategory[]> {
    return of(this._categories());
  }

  getById(id: string): Observable<ICategory | undefined> {
    return of(this._categories().find(c => c.id === id));
  }
}
