export type ManagedProductStatus = 'active' | 'inactive' | 'draft';

export interface IManagedProduct {
  id: string;
  emoji: string;
  coverImageUrl?: string;
  name: string;
  category: string;
  categoryId?: string;
  description?: string;
  region?: string;
  unit: string;
  status: ManagedProductStatus;
  price: number;
  stock: number;
  certifications: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
}
