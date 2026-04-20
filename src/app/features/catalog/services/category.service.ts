import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICategory } from '../models/category.model';

const SEED_CATEGORIES: ICategory[] = [
  { id: '1', name: 'Café de Origen', description: 'Variedad pura de una sola región' },
  { id: '2', name: 'Blend', description: 'Mezcla de diferentes variedades' },
  { id: '3', name: 'Decafeinado', description: 'Café sin cafeína' },
  { id: '4', name: 'Especiales', description: 'Ediciones limitadas y microlotes' },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly categories = signal<ICategory[]>(SEED_CATEGORIES);
  readonly count = computed(() => this.categories().length);

  list(): Observable<ICategory[]> {
    return of(this.categories());
  }

  getById(id: string): Observable<ICategory | undefined> {
    return of(this.categories().find(c => c.id === id));
  }
}
