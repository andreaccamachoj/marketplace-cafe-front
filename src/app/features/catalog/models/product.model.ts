export interface IProduct {
  id: string;
  name: string;
  producerName: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  stock: number;
  maxStock?: number;
  images: string[];
  certifications: ('ORGANIC' | 'FAIRTRADE' | 'RAINFOREST')[];
  region: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface IReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface CatalogFilter {
  category?: string | null;
  certs?: string[];
  query?: string;
  sort?: SortBy;
}
