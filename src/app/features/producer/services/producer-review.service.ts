import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IProducerReview, IProducerReviewGroup } from '../models/producer-review.model';

function calcAvgRating(reviews: IProducerReview[]): number {
  if (!reviews.length) return 0;
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

function mapReview(b: Record<string, unknown>): IProducerReview {
  return {
    id: String(b['id']),
    productId: String(b['productId']),
    productName: String(b['productName'] ?? 'Producto'),
    productEmoji: String(b['productEmoji'] ?? '☕'),
    buyerName: 'Comprador',
    buyerInitials: 'C',
    rating: Number(b['rating'] ?? 0),
    comment: String(b['body'] ?? b['comment'] ?? ''),
    date: String(b['createdAt'] ?? '').split('T')[0],
    isVerifiedPurchase: Boolean(b['isVerifiedPurchase']),
    helpfulCount: Number(b['helpfulCount'] ?? 0),
    producerReply: b['producerReply'] ? String(b['producerReply']) : undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class ProducerReviewService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _reviews = signal<IProducerReview[]>([]);

  readonly reviews = this._reviews.asReadonly();
  readonly totalReviews    = computed(() => this._reviews().length);
  readonly globalAvgRating = computed(() => calcAvgRating(this._reviews()));

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

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/producer/reviews').subscribe({
      next: list => this._reviews.set(list.map(mapReview)),
    });
  }

  reply(reviewId: string, text: string): void {
    this.http.post(`/reviews/${reviewId}/reply`, { body: text.trim() }).subscribe({
      next: () => this._reviews.update(list =>
        list.map(r => r.id === reviewId
          ? { ...r, producerReply: text.trim(), producerReplyDate: new Date().toISOString() }
          : r)),
    });
  }
}
