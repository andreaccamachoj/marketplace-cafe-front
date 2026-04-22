export interface IReview {
  id: string;
  productId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
}
