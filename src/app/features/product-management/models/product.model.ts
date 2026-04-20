export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE'
}

export enum ProductUnit {
  G_500 = '500g',
  KG_1 = '1kg'
}

export type Certification = 'ORGANIC' | 'FAIRTRADE' | 'RAINFOREST';

// Interfaz de dominio (Lo que espera el backend)
export interface ProductPayload {
  name: string;
  category: string;
  description: string;
  price: number;
  unit: ProductUnit | null;
  stock: number;
  images: File[];
  certifications: Certification[];
  status: ProductStatus;
}
