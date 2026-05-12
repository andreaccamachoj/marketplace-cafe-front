import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IReview, IReviewPayload } from '../models/review.model';
import { IOrder } from '../models/order.model';

interface BackendReview {
  id: string; productId: string; buyerId: string; orderId: string | null;
  rating: number; title: string | null; body: string | null;
  status: string; isVerifiedPurchase: boolean; helpfulCount: number; createdAt: string;
}

function mapBuyerReview(b: BackendReview): IReview {
  return {
    id: b.id, productId: b.productId, orderId: b.orderId ?? '',
    buyerId: b.buyerId, buyerName: 'Yo', buyerInitials: 'Y',
    productName: '', productImageUrl: '',
    rating: b.rating, title: b.title ?? '', body: b.body ?? '',
    status: (b.status === 'published' ? 'published' : 'draft') as 'published' | 'draft',
    isVerifiedPurchase: true,
    helpfulCount: b.helpfulCount, createdAt: b.createdAt,
  };
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _reviews = signal<IReview[]>([]);

  readonly all = computed(() => this._reviews());
  readonly count = computed(() => this._reviews().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendReview[]>('/reviews').subscribe({ next: list => this._reviews.set(list.map(mapBuyerReview)) });
  }

  byBuyer(buyerId: string): IReview[] {
    return this._reviews().filter(r => r.buyerId === buyerId);
  }

  canReview(buyerId: string, productId: string, orders: IOrder[]): boolean {
    const hasPurchased = orders.some(
      o => o.buyerId === buyerId &&
           o.items.some(i => i.productId === productId) &&
           (o.status === 'delivered' || o.status === 'completed'),
    );
    const alreadyReviewed = this._reviews().some(r => r.buyerId === buyerId && r.productId === productId);
    return hasPurchased && !alreadyReviewed;
  }

  add(
    payload: IReviewPayload,
    buyer: { id: string; name: string; initials: string },
    productName: string,
    productImageUrl: string,
  ): void {
    this.http.post<BackendReview>('/reviews', {
      productId: payload.productId,
      orderId: payload.orderId,
      rating: payload.rating,
      title: payload.title,
      body: payload.body,
    }).subscribe({
      next: r => {
        const mapped = { ...mapBuyerReview(r), productName, productImageUrl, buyerName: buyer.name, buyerInitials: buyer.initials };
        this._reviews.update(list => [...list, mapped]);
      },
    });
  }

  update(id: string, changes: Pick<IReview, 'rating' | 'title' | 'body'>): void {
    this._reviews.update(list =>
      list.map(r => r.id === id ? { ...r, ...changes } : r),
    );
  }

  remove(id: string, buyerId: string): void {
    this._reviews.update(list => list.filter(r => !(r.id === id && r.buyerId === buyerId)));
  }

  getByProductId(productId: string): IReview[] {
    return this._reviews().filter(r => r.productId === productId);
  }
}
