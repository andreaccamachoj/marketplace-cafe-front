export interface ICheckoutPayload {
  items: { productId: string; qty: number; unitPrice: number }[];
  shippingOptionId: string;
  couponCode: string | null;
  addressId: string;
}

export interface IAddress {
  id: string;
  label: string;        // 'Casa', 'Oficina', 'Trabajo'…
  line1: string;
  line2?: string;
  city: string;
  department: string;
  zipCode?: string;
  isDefault: boolean;
}

export interface IAddressPayload {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  department: string;
  zipCode?: string;
}
