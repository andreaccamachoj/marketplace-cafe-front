export type OrderStatus =
  | 'pending_verification'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface IOrderItem {
  productId: string;
  name: string;
  productName: string;
  qty: number;
  unitPrice: number;
  emoji: string;
}

export interface IOrderStep {
  label: string;
  done: boolean;
  active: boolean;
}

export interface IOrder {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  address: string;
  buyerId: string;
  items: IOrderItem[];
  steps: IOrderStep[];
  reviewSubmitted?: boolean;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_verification: 'Pendiente de verificación',
  confirmed:            'Confirmado',
  preparing:            'Preparando',
  shipped:              'En camino',
  delivered:            'Entregado',
  completed:            'Completado',
  cancelled:            'Cancelado',
};
