import { Injectable, computed, signal } from '@angular/core';
import {
  IReceivedOrder,
  ORDER_STATUS_FLOW,
  ReceivedOrderStatus,
} from '../models/received-order.model';

const SEED_ORDERS: IReceivedOrder[] = [
  {
    id: 'ro1',
    number: 'ORD-2025-00089',
    buyerName: 'Ana Torres',
    buyerInitials: 'AT',
    buyerCity: 'Bogotá',
    date: '12 jun 2025',
    items: [
      { name: 'Café Especial Huila', qty: 2, emoji: '🫘' },
      { name: 'San Agustín Washed', qty: 1, emoji: '🌸' },
    ],
    total: 160000,
    shipping: 'Express',
    status: 'confirmed',
  },
  {
    id: 'ro2',
    number: 'ORD-2025-00071',
    buyerName: 'Luis García',
    buyerInitials: 'LG',
    buyerCity: 'Medellín',
    date: '10 jun 2025',
    items: [{ name: 'Nariño Natural', qty: 3, emoji: '🌿' }],
    total: 156000,
    shipping: 'Estándar',
    status: 'preparing',
  },
  {
    id: 'ro3',
    number: 'ORD-2025-00060',
    buyerName: 'Sofía Ruiz',
    buyerInitials: 'SR',
    buyerCity: 'Cali',
    date: '5 jun 2025',
    items: [{ name: 'Blend Sierra Nevada', qty: 2, emoji: '🏔️' }],
    total: 76000,
    shipping: 'Estándar',
    status: 'shipped',
  },
  {
    id: 'ro4',
    number: 'ORD-2025-00044',
    buyerName: 'Jorge Mora',
    buyerInitials: 'JM',
    buyerCity: 'Barranquilla',
    date: '28 may 2025',
    items: [{ name: 'Café Especial Huila', qty: 4, emoji: '🫘' }],
    total: 192000,
    shipping: 'Express',
    status: 'delivered',
  },
];

@Injectable({ providedIn: 'root' })
export class ProducerOrderService {
  private readonly _orders = signal<IReceivedOrder[]>(SEED_ORDERS);

  readonly orders = this._orders.asReadonly();

  readonly pendingCount = computed(
    () => this._orders().filter(o => o.status !== 'delivered').length,
  );

  updateStatus(id: string, newStatus: ReceivedOrderStatus): void {
    const current = this._orders().find(o => o.id === id);
    if (!current) return;
    const currentIdx = ORDER_STATUS_FLOW.indexOf(current.status);
    const newIdx = ORDER_STATUS_FLOW.indexOf(newStatus);
    if (newIdx <= currentIdx) return;
    this._orders.update(list =>
      list.map(o => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  }
}
