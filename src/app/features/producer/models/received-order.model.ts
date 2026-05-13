export type ReceivedOrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'delivered';

export const ORDER_STATUS_FLOW: ReceivedOrderStatus[] = [
  'confirmed',
  'preparing',
  'shipped',
  'delivered',
];

export const RECEIVED_ORDER_STATUS_LABELS: Record<ReceivedOrderStatus, string> = {
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

export interface IReceivedOrderItem {
  name: string;
  qty: number;
  emoji: string;
}

export interface IReceivedOrder {
  id: string;
  number: string;
  buyerName: string;
  buyerInitials: string;
  buyerCity: string;
  date: string;
  createdAt?: string;
  items: IReceivedOrderItem[];
  total: number;
  shipping: string;
  status: ReceivedOrderStatus;
}
