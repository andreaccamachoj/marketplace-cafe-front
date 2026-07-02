export interface ICartItem {
  id: string;
  productId: string;
  name: string;
  producer: string;
  price: number;       // precio congelado al agregar
  qty: number;
  emoji: string;
  organic: boolean;
  fairTrade: boolean;
  maxStock: number;
}

export interface ICart {
  items: ICartItem[];
  couponCode: string | null;
  couponDiscount: number;  // 0-1 (ej: 0.1 = 10%)
  shippingOptionId: string;
}
