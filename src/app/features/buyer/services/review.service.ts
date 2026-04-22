import { Injectable, computed, signal } from '@angular/core';
import { IReview, IReviewPayload } from '../models/review.model';
import { IOrder } from '../models/order.model';

const SEED_REVIEWS: IReview[] = [
  {
    id: 'rev-1',
    productId: '1',
    productName: 'Café Especial Huila',
    productImageUrl: '/assets/products/huila.jpg',
    orderId: 'ord-1',
    buyerId: 'u-buyer-1',
    buyerName: 'Comprador Demo',
    buyerInitials: 'CD',
    rating: 5,
    title: 'Excepcional, el mejor café que he probado',
    body: 'Notas de chocolate negro y frutas rojas muy pronunciadas. La finca La Esperanza hace un trabajo increíble con el proceso washed. Totalmente recomendado.',
    status: 'published',
    isVerifiedPurchase: true,
    helpfulCount: 12,
    createdAt: '2025-03-20T10:00:00Z',
  },
  {
    id: 'rev-2',
    productId: '3',
    productName: 'Nariño Natural',
    productImageUrl: '/assets/products/narino.jpg',
    orderId: 'ord-2',
    buyerId: 'u-buyer-1',
    buyerName: 'Comprador Demo',
    buyerInitials: 'CD',
    rating: 4,
    title: 'Muy buen proceso natural',
    body: 'Cuerpo cremoso y dulzor natural muy agradable. Perfecto para espresso. Llega bien empacado y fresco.',
    status: 'published',
    isVerifiedPurchase: true,
    helpfulCount: 7,
    createdAt: '2025-04-02T14:30:00Z',
  },
  {
    id: 'rev-3',
    productId: '5',
    productName: 'Blend Sierra Nevada',
    productImageUrl: '/assets/products/sierra.jpg',
    orderId: 'ord-1',
    buyerId: 'u-buyer-1',
    buyerName: 'Comprador Demo',
    buyerInitials: 'CD',
    rating: 3,
    title: 'Bueno pero no extraordinario',
    body: 'El blend está bien balanceado pero esperaba más complejidad. Para uso diario es una buena opción por el precio.',
    status: 'published',
    isVerifiedPurchase: true,
    helpfulCount: 3,
    createdAt: '2025-04-10T09:00:00Z',
  },
  {
    id: 'rev-4',
    productId: '7',
    productName: 'Cauca Geisha',
    productImageUrl: '/assets/products/cauca.jpg',
    orderId: 'ord-3',
    buyerId: 'u-buyer-1',
    buyerName: 'Comprador Demo',
    buyerInitials: 'CD',
    rating: 5,
    title: 'Geisha colombiana de primer nivel',
    body: 'Jasmine, melocotón y bergamota. Una experiencia sensorial única. Vale cada peso. Ya hice mi segundo pedido.',
    status: 'published',
    isVerifiedPurchase: true,
    helpfulCount: 19,
    createdAt: '2025-04-15T16:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly _reviews = signal<IReview[]>(SEED_REVIEWS);

  readonly all = computed(() => this._reviews());
  readonly count = computed(() => this._reviews().length);

  byBuyer(buyerId: string): IReview[] {
    return this._reviews().filter(r => r.buyerId === buyerId);
  }

  canReview(buyerId: string, productId: string, orders: IOrder[]): boolean {
    const hasPurchased = orders.some(
      o =>
        o.buyerId === buyerId &&
        o.items.some(i => i.productId === productId) &&
        (o.status === 'delivered' || o.status === 'completed'),
    );
    const alreadyReviewed = this._reviews().some(
      r => r.buyerId === buyerId && r.productId === productId,
    );
    return hasPurchased && !alreadyReviewed;
  }

  add(
    payload: IReviewPayload,
    buyer: { id: string; name: string; initials: string },
    productName: string,
    productImageUrl: string,
  ): void {
    const review: IReview = {
      id: `rev-${Date.now()}`,
      productId: payload.productId,
      productName,
      productImageUrl,
      orderId: payload.orderId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerInitials: buyer.initials,
      rating: payload.rating,
      title: payload.title,
      body: payload.body,
      status: 'published',
      isVerifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };
    this._reviews.update(list => [...list, review]);
  }

  update(id: string, changes: Pick<IReview, 'rating' | 'title' | 'body'>): void {
    this._reviews.update(list =>
      list.map(r =>
        r.id === id
          ? { ...r, ...changes, updatedAt: new Date().toISOString() }
          : r,
      ),
    );
  }

  remove(id: string, buyerId: string): void {
    this._reviews.update(list =>
      list.filter(r => !(r.id === id && r.buyerId === buyerId)),
    );
  }

  getByProductId(productId: string): IReview[] {
    return this._reviews().filter(r => r.productId === productId);
  }
}
