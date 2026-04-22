import { Injectable, computed, signal } from '@angular/core';
import {
  IReceivedOrder,
  ORDER_STATUS_FLOW,
  ReceivedOrderStatus,
} from '../models/received-order.model';

const SEED_ORDERS: IReceivedOrder[] = [
  {
    id: 'ro1',
    number: 'WCM-2025-041',
    buyerName: 'Ana García',
    buyerInitials: 'AG',
    buyerCity: 'Bogotá',
    date: '18 abr 2025',
    items: [{ name: 'Geisha Washed', qty: 2, emoji: '☕' }],
    total: 116000,
    status: 'confirmed',
  },
  {
    id: 'ro2',
    number: 'WCM-2025-039',
    buyerName: 'Luis Torres',
    buyerInitials: 'LT',
    buyerCity: 'Medellín',
    date: '16 abr 2025',
    items: [{ name: 'Tabi Natural', qty: 2, emoji: '🫘' }],
    total: 84000,
    status: 'preparing',
  },
  {
    id: 'ro3',
    number: 'WCM-2025-035',
    buyerName: 'Marta López',
    buyerInitials: 'ML',
    buyerCity: 'Cali',
    date: '12 abr 2025',
    items: [{ name: 'Geisha Washed', qty: 1, emoji: '☕' }],
    total: 58000,
    status: 'shipped',
  },
  {
    id: 'ro4',
    number: 'WCM-2025-030',
    buyerName: 'Diego Rojas',
    buyerInitials: 'DR',
    buyerCity: 'Bucaramanga',
    date: '05 abr 2025',
    items: [
      { name: 'Caturra Honey', qty: 2, emoji: '🌿' },
      { name: 'Tabi Natural', qty: 1, emoji: '🫘' },
    ],
    total: 108000,
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
