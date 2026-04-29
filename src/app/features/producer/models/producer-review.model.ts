export interface IProducerReview {
  id: string;
  productId: string;
  productName: string;
  productEmoji: string;
  buyerName: string;
  buyerInitials: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  producerReply?: string;
  producerReplyDate?: string;
}

export interface IProducerReviewGroup {
  productId: string;
  productName: string;
  productEmoji: string;
  avgRating: number;
  totalReviews: number;
  reviews: IProducerReview[];
}

export interface IProducerReplyPayload {
  reviewId: string;
  text: string;
}
