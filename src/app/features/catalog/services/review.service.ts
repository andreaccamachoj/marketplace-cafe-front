import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IReview } from '../models/review.model';

const SEED_REVIEWS: IReview[] = [
  {
    id: '1',
    productId: '1',
    author: 'Carlos M.',
    rating: 5,
    comment: 'Excelente calidad, muy recomendado',
    date: '2026-04-15',
    verified: true,
  },
  {
    id: '2',
    productId: '1',
    author: 'Ana R.',
    rating: 4,
    comment: 'Buen sabor, excelente presentación',
    date: '2026-04-10',
    verified: true,
  },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly reviews = signal<IReview[]>(SEED_REVIEWS);
  readonly count = computed(() => this.reviews().length);

  listByProductId(productId: string): Observable<IReview[]> {
    return of(this.reviews().filter(r => r.productId === productId));
  }

  create(review: Omit<IReview, 'id' | 'date'>): Observable<IReview> {
    const newReview: IReview = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    this.reviews.update(reviews => [...reviews, newReview]);
    return of(newReview);
  }
}
