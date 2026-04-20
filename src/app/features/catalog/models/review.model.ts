export interface IReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}
