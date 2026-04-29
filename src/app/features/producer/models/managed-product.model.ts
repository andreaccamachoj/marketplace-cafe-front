export type ManagedProductStatus = 'active' | 'inactive' | 'draft';

export interface IManagedProduct {
  id: string;
  emoji: string;
  name: string;
  category: string;
  unit: string;
  status: ManagedProductStatus;
  price: number;
  stock: number;
  certifications: ('organico' | 'fairtrade' | 'rainforest')[];
  rating: number;
  reviewCount: number;
  salesCount: number;
}
