import { Injectable, computed, signal } from '@angular/core';
import { IProducerReview, IProducerReviewGroup } from '../models/producer-review.model';

const SEED_REVIEWS: IProducerReview[] = [
  {
    id: 'pr1',
    productId: '1',
    productName: 'Café Especial Huila',
    productEmoji: '🫘',
    buyerName: 'María García',
    buyerInitials: 'MG',
    rating: 5,
    comment: '¡Excelente café! Notas increíbles de frutos rojos y chocolate. Llegó muy bien empacado y fresco.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedPurchase: true,
    helpfulCount: 8,
  },
  {
    id: 'pr2',
    productId: '1',
    productName: 'Café Especial Huila',
    productEmoji: '🫘',
    buyerName: 'Juan Rodríguez',
    buyerInitials: 'JR',
    rating: 4,
    comment: 'Muy buen café, el proceso lavado se nota. Quizás una presentación de 1 kg sería ideal para los que lo consumimos diario.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedPurchase: true,
    helpfulCount: 3,
  },
  {
    id: 'pr3',
    productId: '5',
    productName: 'Café Tolima Natural',
    productEmoji: '🌺',
    buyerName: 'Laura Martínez',
    buyerInitials: 'LM',
    rating: 5,
    comment: 'El proceso natural se siente desde que abres el paquete. Frutas tropicales increíbles. Lo recomiendo totalmente.',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedPurchase: true,
    helpfulCount: 12,
    producerReply: '¡Muchas gracias Laura! Nos alegra que hayas disfrutado el proceso natural. Fue una cosecha especial este año. ¡Hasta pronto!',
    producerReplyDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pr4',
    productId: '1',
    productName: 'Café Especial Huila',
    productEmoji: '🫘',
    buyerName: 'Pedro López',
    buyerInitials: 'PL',
    rating: 3,
    comment: 'El café tiene buen sabor, pero el tiempo de envío fue más largo de lo esperado. Espero mejore la logística.',
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedPurchase: true,
    helpfulCount: 1,
  },
  {
    id: 'pr5',
    productId: '5',
    productName: 'Café Tolima Natural',
    productEmoji: '🌺',
    buyerName: 'Carolina Herrera',
    buyerInitials: 'CH',
    rating: 5,
    comment: 'Un café muy especial, perfecto para V60 y Chemex. Se convirtió en mi favorito de la semana.',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isVerifiedPurchase: true,
    helpfulCount: 6,
  },
];

function calcAvgRating(reviews: IProducerReview[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

@Injectable({ providedIn: 'root' })
export class ProducerReviewService {
  private readonly _reviews = signal<IProducerReview[]>(SEED_REVIEWS);

  readonly reviews = this._reviews.asReadonly();

  readonly totalReviews   = computed(() => this._reviews().length);
  readonly globalAvgRating = computed(() => calcAvgRating(this._reviews()));

  /** Reviews grouped and sorted by product for display. */
  readonly reviewGroups = computed<IProducerReviewGroup[]>(() => {
    const map = new Map<string, IProducerReview[]>();
    for (const r of this._reviews()) {
      const bucket = map.get(r.productId) ?? [];
      bucket.push(r);
      map.set(r.productId, bucket);
    }
    return Array.from(map.values()).map(reviews => ({
      productId:    reviews[0].productId,
      productName:  reviews[0].productName,
      productEmoji: reviews[0].productEmoji,
      avgRating:    calcAvgRating(reviews),
      totalReviews: reviews.length,
      reviews,
    }));
  });

  reply(reviewId: string, text: string): void {
    this._reviews.update(list =>
      list.map(r =>
        r.id === reviewId
          ? { ...r, producerReply: text.trim(), producerReplyDate: new Date().toISOString() }
          : r,
      ),
    );
  }
}
