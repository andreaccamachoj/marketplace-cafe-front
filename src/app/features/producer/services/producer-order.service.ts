import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  IReceivedOrder,
  ORDER_STATUS_FLOW,
  ReceivedOrderStatus,
} from '../models/received-order.model';

function mapOrder(b: Record<string, unknown>): IReceivedOrder {
  const items = (b['items'] as Record<string, unknown>[] ?? []).map(i => ({
    name: String(i['productNameSnapshot'] ?? i['name'] ?? 'Producto'),
    qty:  Number(i['quantity'] ?? 1),
    emoji: String(i['productEmojiSnapshot'] ?? i['emoji'] ?? '☕'),
  }));
  const status = (() => {
    const s = String(b['status'] ?? '').toLowerCase();
    const valid: ReceivedOrderStatus[] = ['confirmed', 'preparing', 'shipped', 'delivered'];
    return valid.includes(s as ReceivedOrderStatus) ? s as ReceivedOrderStatus : 'confirmed';
  })();
  const createdAt = String(b['createdAt'] ?? '');
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  return {
    id: String(b['id']),
    number: String(b['code'] ?? b['id']),
    buyerName: 'Comprador',
    buyerInitials: 'C',
    buyerCity: '',
    date,
    items,
    total: Number(b['totalAmount'] ?? 0),
    shipping: String(b['shippingOptionId'] ?? 'standard'),
    status,
  };
}

@Injectable({ providedIn: 'root' })
export class ProducerOrderService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _orders = signal<IReceivedOrder[]>([]);

  readonly orders = this._orders.asReadonly();

  readonly pendingCount = computed(
    () => this._orders().filter(o => o.status !== 'delivered').length,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/producer/orders').subscribe({
      next: list => this._orders.set(list.map(mapOrder)),
    });
  }

  updateStatus(id: string, newStatus: ReceivedOrderStatus): void {
    const current = this._orders().find(o => o.id === id);
    if (!current) return;
    const currentIdx = ORDER_STATUS_FLOW.indexOf(current.status);
    const newIdx = ORDER_STATUS_FLOW.indexOf(newStatus);
    if (newIdx <= currentIdx) return;
    this.http.patch(`/producer/orders/${id}/status`, { newStatus }).subscribe({
      next: () => this._orders.update(list => list.map(o => (o.id === id ? { ...o, status: newStatus } : o))),
    });
  }
}
