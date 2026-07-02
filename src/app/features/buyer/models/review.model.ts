export type ReviewStatus = 'published' | 'draft';

export interface IReview {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerInitials: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  isVerifiedPurchase: true;
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IReviewPayload {
  productId: string;
  orderId: string;
  rating: number;
  title: string;
  body: string;
}
