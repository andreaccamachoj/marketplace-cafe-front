import { Injectable, signal } from '@angular/core';
import { IOrder } from '../models/order.model';

export interface IPlaceOrderPayload {
  items: {
    productId: string;
    name: string;
    qty: number;
    unitPrice: number;
    emoji: string;
  }[];
  total: number;
  address: string;
}

const BUYER_ID = 'u-buyer-1';

const SEED_ORDERS: IOrder[] = [
  {
    id: 'o1',
    number: 'WCM-2025-001',
    date: '15 abr 2025',
    status: 'shipped',
    total: 134000,
    address: 'Calle 72 #10-45, Bogotá',
    buyerId: BUYER_ID,
    items: [
      { productId: 'p1', name: 'Geisha Washed',  productName: 'Geisha Washed',  qty: 1, unitPrice: 58000, emoji: '☕' },
      { productId: 'p2', name: 'Tabi Natural',   productName: 'Tabi Natural',   qty: 2, unitPrice: 42000, emoji: '🫘' },
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
    buyerId: BUYER_ID,
    items: [
      { productId: 'p3', name: 'Caturra Honey',  productName: 'Caturra Honey',  qty: 2, unitPrice: 36000, emoji: '🌿' },
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
    buyerId: BUYER_ID,
    items: [
      { productId: 'p1', name: 'Geisha Washed',  productName: 'Geisha Washed',  qty: 1, unitPrice: 58000, emoji: '☕' },
      { productId: 'p2', name: 'Tabi Natural',   productName: 'Tabi Natural',   qty: 1, unitPrice: 42000, emoji: '🫘' },
    ],
    steps: [
      { label: 'Confirmado', done: true, active: false },
      { label: 'Preparando', done: true, active: false },
      { label: 'En camino',  done: true, active: false },
      { label: 'Entregado',  done: true, active: false },
    ],
    reviewSubmitted: false,
  },
  {
    id: 'o4',
    number: 'WCM-2025-004',
    date: '20 mar 2025',
    status: 'delivered',
    total: 154000,
    address: 'Cra. 15 #93-75, Apt 502, Bogotá',
    buyerId: BUYER_ID,
    items: [
      { productId: '1', name: 'Café Especial Huila', productName: 'Café Especial Huila', qty: 2, unitPrice: 48000, emoji: '🫘' },
      { productId: '7', name: 'Cauca Geisha',         productName: 'Cauca Geisha',         qty: 1, unitPrice: 98000, emoji: '✨' },
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
  readonly all    = this._orders.asReadonly();

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

  /** Registra un nuevo pedido con estado "pendiente de verificación". */
  place(payload: IPlaceOrderPayload): void {
    const seq  = this._orders().length + 1;
    const id   = `o-${Date.now()}`;
    const year = new Date().getFullYear();
    const date = new Date().toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

    const newOrder: IOrder = {
      id,
      number: `WCM-${year}-${String(seq).padStart(3, '0')}`,
      date,
      status:  'pending_verification',
      total:   payload.total,
      address: payload.address,
      buyerId: BUYER_ID,
      items:   payload.items.map(i => ({
        productId:   i.productId,
        name:        i.name,
        productName: i.name,
        qty:         i.qty,
        unitPrice:   i.unitPrice,
        emoji:       i.emoji,
      })),
      steps: [
        { label: 'Verificación de pago', done: false, active: true  },
        { label: 'Confirmado',           done: false, active: false },
        { label: 'Preparando',           done: false, active: false },
        { label: 'En camino',            done: false, active: false },
        { label: 'Entregado',            done: false, active: false },
      ],
    };
    this._orders.update(list => [newOrder, ...list]);
  }
}
