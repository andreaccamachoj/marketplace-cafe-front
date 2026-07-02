import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IReview } from '../models/review.model';

interface BackendReview {
  id: string;
  productId: string;
  buyerId: string;
  buyerName?: string;
  buyerInitials?: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  producerReply?: string;
  producerReplyDate?: string;
}

function mapReview(r: BackendReview): IReview {
  const buyerName = r.buyerName ?? 'Comprador';
  const initials  = r.buyerInitials
    ?? (buyerName.split(' ').filter(w => w).map(w => w[0].toUpperCase()).slice(0, 2).join('') || 'C');
  return {
    id:                 r.id,
    productId:          r.productId,
    userName:           buyerName,
    userInitials:       initials,
    rating:             r.rating,
    comment:            r.body ?? r.title ?? '',
    date:               r.createdAt?.split('T')[0] ?? '',
    isVerifiedPurchase: r.isVerifiedPurchase,
    helpfulCount:       r.helpfulCount,
    producerReply:      r.producerReply,
    producerReplyDate:  r.producerReplyDate?.split('T')[0],
  };
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);

  listByProductId(productId: string): Observable<IReview[]> {
    return this.http.get<BackendReview[]>(`/catalog/products/${productId}/reviews`).pipe(
      map(list => list.map(mapReview)),
    );
  }

  create(review: Omit<IReview, 'id' | 'date' | 'helpfulCount'>): Observable<IReview> {
    return this.http.post<BackendReview>('/reviews', {
      productId: review.productId,
      rating: review.rating,
      body: review.comment,
    }).pipe(map(mapReview));
  }

  markHelpful(_reviewId: string): void {
    // Not supported by current backend API
  }
}
