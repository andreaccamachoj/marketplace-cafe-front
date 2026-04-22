export interface ICheckoutPayload {
  items: Array<{ productId: string; qty: number; unitPrice: number }>;
  shippingOptionId: string;
  couponCode: string | null;
  addressId: string;
}

export interface IAddress {
  id: string;
  label: string;        // 'Casa', 'Oficina'
  line1: string;
  city: string;
  isDefault: boolean;
}
