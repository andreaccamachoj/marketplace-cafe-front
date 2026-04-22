import { Injectable, signal } from '@angular/core';
import { IOrder } from '../models/order.model';

const SEED_ORDERS: IOrder[] = [
  {
    id: 'o1',
    number: 'WCM-2025-001',
    date: '15 abr 2025',
    status: 'shipped',
    total: 134000,
    address: 'Calle 72 #10-45, Bogotá',
    items: [
      { productId: 'p1', name: 'Geisha Washed', qty: 1, unitPrice: 58000, emoji: '☕' },
      { productId: 'p2', name: 'Tabi Natural',  qty: 2, unitPrice: 42000, emoji: '🫘' },
    ],
    steps: [
      { label: 'Confirmado', done: true,  active: false },
      { label: 'Preparando', done: true,  active: false },
      { label: 'En camino',  done: false, active: true  },
      { label: 'Entregado',  done: false, active: false },
    ],
  },
  {
    id: 'o2',
    number: 'WCM-2025-002',
    date: '10 abr 2025',
    status: 'preparing',
    total: 72000,
    address: 'Carrera 15 #88-20, Bogotá',
    items: [
      { productId: 'p3', name: 'Caturra Honey', qty: 2, unitPrice: 36000, emoji: '🌿' },
    ],
    steps: [
      { label: 'Confirmado', done: true,  active: false },
      { label: 'Preparando', done: false, active: true  },
      { label: 'En camino',  done: false, active: false },
      { label: 'Entregado',  done: false, active: false },
    ],
  },
  {
    id: 'o3',
    number: 'WCM-2025-003',
    date: '02 abr 2025',
    status: 'delivered',
    total: 96000,
    address: 'Av. El Dorado #69-76, Bogotá',
    items: [
      { productId: 'p1', name: 'Geisha Washed', qty: 1, unitPrice: 58000, emoji: '☕' },
      { productId: 'p2', name: 'Tabi Natural',  qty: 1, unitPrice: 42000, emoji: '🫘' },
    ],
    steps: [
      { label: 'Confirmado', done: true, active: false },
      { label: 'Preparando', done: true, active: false },
      { label: 'En camino',  done: true, active: false },
      { label: 'Entregado',  done: true, active: false },
    ],
    reviewSubmitted: false,
  },
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<IOrder[]>(SEED_ORDERS);
  readonly orders = this._orders.asReadonly();

  list(): IOrder[] {
    return this._orders();
  }

  getById(id: string): IOrder | undefined {
    return this._orders().find(o => o.id === id);
  }

  markReviewSubmitted(orderId: string): void {
    this._orders.update(list =>
      list.map(o => (o.id === orderId ? { ...o, reviewSubmitted: true } : o)),
    );
  }
}
