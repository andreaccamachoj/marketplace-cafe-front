export interface IShippingOption {
  id: string;
  name: string;
  days: string;
  price: number;   // 0 = gratis
}

export const SHIPPING_OPTIONS: IShippingOption[] = [
  { id: 'standard', name: 'Envío estándar', days: '5–8 días hábiles', price: 0 },
  { id: 'express',  name: 'Envío express',  days: '2–3 días hábiles', price: 12000 },
];
