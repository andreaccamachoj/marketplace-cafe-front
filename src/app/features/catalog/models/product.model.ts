export type Certification = 'ORGANIC' | 'FAIRTRADE' | 'RAINFOREST';

export interface IRoastLevel {
  id: string;
  name: string;
  icon: string;
  sub: string;
}

export interface IFlavorNote {
  icon: string;
  name: string;
  intensity: number; // 0–100
}

export interface ICuppingAttribute {
  label: string;
  value: number; // 0–10
}

export interface IFarmInfo {
  name: string;
  municipality: string;
  department: string;
  altitude: number; // msnm
  area: number;     // hectáreas
  process: string;  // lavado / natural / honey
}

export interface IProduct {
  id: string;
  name: string;
  producerName: string;
  category: string;
  description: string;
  price: number;
  unit?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  maxStock?: number;
  images: string[];
  certifications: Certification[];
  region: string;
  emoji?: string;
  bg?: string;
  // Detail-page fields (optional for backwards compat with card)
  originalPrice?: number;
  discountPercent?: number;
  soldCount?: number;
  presentationTypes?: string[];
  roastLevels?: IRoastLevel[];
  flavorNotes?: IFlavorNote[];
  cuppingScore?: number;
  cuppingAttributes?: ICuppingAttribute[];
  farmInfo?: IFarmInfo;
}

export interface ICategory {
  id: string;
  name: string;
}

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface CatalogFilter {
  category?: string | null;
  certs?: string[];
  presentation?: string | null;
  query?: string;
  sort?: SortBy;
}
