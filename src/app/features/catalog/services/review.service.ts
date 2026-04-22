import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IReview } from '../models/review.model';

const SEED_REVIEWS: IReview[] = [
  {
    id: '1',
    productId: '1',
    userName: 'Carlos Martínez',
    userInitials: 'CM',
    rating: 5,
    comment: 'Café excepcional. Notas a frutos rojos y chocolate bien definidas, taza limpia y dulce. Lo compro cada mes.',
    date: '2026-04-15',
    isVerifiedPurchase: true,
    helpfulCount: 24,
  },
  {
    id: '2',
    productId: '1',
    userName: 'Ana Rodríguez',
    userInitials: 'AR',
    rating: 4,
    comment: 'Muy buena calidad. El tostado medio resalta bien las notas florales. Llega bien empacado.',
    date: '2026-04-10',
    isVerifiedPurchase: true,
    helpfulCount: 12,
  },
  {
    id: '3',
    productId: '1',
    userName: 'Pedro Gómez',
    userInitials: 'PG',
    rating: 5,
    comment: 'El mejor café que he probado de Colombia. La finca Acevedo hace un trabajo increíble.',
    date: '2026-03-28',
    isVerifiedPurchase: false,
    helpfulCount: 8,
  },
  {
    id: '4',
    productId: '2',
    userName: 'Lucía Torres',
    userInitials: 'LT',
    rating: 5,
    comment: 'El Pink Bourbon es simplemente espectacular. Frutal, complejo, perfecto para aeropress.',
    date: '2026-04-12',
    isVerifiedPurchase: true,
    helpfulCount: 18,
  },
  {
    id: '5',
    productId: '2',
    userName: 'Sebastián Vargas',
    userInitials: 'SV',
    rating: 4,
    comment: 'Muy aromático, notas claras a melocotón. Ideal para método filtrado.',
    date: '2026-04-05',
    isVerifiedPurchase: true,
    helpfulCount: 9,
  },
  {
    id: '6',
    productId: '3',
    userName: 'Mariana Ospina',
    userInitials: 'MO',
    rating: 5,
    comment: 'Geisha inigualable. Vale cada peso. El proceso natural resalta notas tropicales increíbles.',
    date: '2026-04-18',
    isVerifiedPurchase: true,
    helpfulCount: 31,
  },
  {
    id: '7',
    productId: '4',
    userName: 'Jorge Peña',
    userInitials: 'JP',
    rating: 4,
    comment: 'Buen balance entre acidez y cuerpo. Para espresso queda muy bien.',
    date: '2026-04-08',
    isVerifiedPurchase: true,
    helpfulCount: 7,
  },
  {
    id: '8',
    productId: '5',
    userName: 'Valentina Cruz',
    userInitials: 'VC',
    rating: 5,
    comment: 'Caturra clásico del Huila, recuerda a los cafés de antaño con carácter propio.',
    date: '2026-03-20',
    isVerifiedPurchase: true,
    helpfulCount: 14,
  },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly reviews = signal<IReview[]>(SEED_REVIEWS);
  readonly count = computed(() => this.reviews().length);

  listByProductId(productId: string): Observable<IReview[]> {
    return of(this.reviews().filter(r => r.productId === productId));
  }

  create(review: Omit<IReview, 'id' | 'date' | 'helpfulCount'>): Observable<IReview> {
    const newReview: IReview = {
      ...review,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    this.reviews.update(r => [...r, newReview]);
    return of(newReview);
  }

  markHelpful(reviewId: string): void {
    this.reviews.update(rs =>
      rs.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)
    );
  }
}
