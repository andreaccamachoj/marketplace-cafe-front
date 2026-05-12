import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IOrder, IOrderItem, IOrderStep, OrderStatus } from '../models/order.model';
import { AddressService } from './address.service';

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
  addressId?: string;
}

interface BackendOrder {
  id: string;
  code: string;
  status: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddressSnapshot: string | null;
  shippingOptionId: string | null;
  buyerId: string;
  createdAt: string;
  items: {
    id: string;
    productId: string;
    productNameSnapshot: string;
    productEmojiSnapshot: string | null;
    quantity: number;
    unitPriceSnapshot: number;
    subtotal: number;
  }[] | null;
}

const STATUS_STEPS: Record<string, string[]> = {
  pending_verification: ['Verificación de pago', 'Confirmado', 'Preparando', 'En camino', 'Entregado'],
  confirmed:            ['Confirmado', 'Preparando', 'En camino', 'Entregado'],
  preparing:            ['Confirmado', 'Preparando', 'En camino', 'Entregado'],
  shipped:              ['Confirmado', 'Preparando', 'En camino', 'Entregado'],
  delivered:            ['Confirmado', 'Preparando', 'En camino', 'Entregado'],
  completed:            ['Confirmado', 'Preparando', 'En camino', 'Entregado'],
  cancelled:            ['Cancelado'],
};

const STATUS_INDEX: Record<string, number> = {
  pending_verification: 0, confirmed: 0, preparing: 1, shipped: 2, delivered: 3, completed: 3,
};

function mapOrder(b: BackendOrder): IOrder {
  const status = (b.status?.toLowerCase() as OrderStatus) ?? 'pending_verification';
  const labels = STATUS_STEPS[status] ?? STATUS_STEPS['confirmed'];
  const doneIdx = STATUS_INDEX[status] ?? -1;
  const steps: IOrderStep[] = labels.map((label, i) => ({
    label, done: i < doneIdx, active: i === doneIdx,
  }));
  const items: IOrderItem[] = (b.items ?? []).map(i => ({
    productId: i.productId,
    name: i.productNameSnapshot || 'Producto',
    productName: i.productNameSnapshot || 'Producto',
    qty: i.quantity,
    unitPrice: i.unitPriceSnapshot,
    subtotal: i.subtotal ?? i.unitPriceSnapshot * i.quantity,
    emoji: i.productEmojiSnapshot ?? '☕',
  }));
  const dateStr = b.createdAt
    ? new Date(b.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
  return {
    id: b.id,
    number: b.code ?? b.id,
    date: dateStr,
    status,
    subtotal: b.subtotal ?? 0,
    shippingAmount: b.shippingAmount ?? 0,
    discountAmount: b.discountAmount ?? 0,
    total: b.totalAmount,
    address: b.shippingAddressSnapshot ?? '',
    shippingOptionId: b.shippingOptionId ?? null,
    buyerId: b.buyerId,
    items,
    steps,
  };
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly addrSvc = inject(AddressService);

  private readonly _orders = signal<IOrder[]>([]);
  readonly orders = this._orders.asReadonly();
  readonly all    = this._orders.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.load();
  }

  load(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendOrder[]>('/orders').subscribe({ next: list => this._orders.set(list.map(mapOrder)) });
  }

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

  place(payload: IPlaceOrderPayload): Observable<IOrder> {
    const addressId = payload.addressId ?? this.addrSvc.defaultAddress()?.id ?? '';
    return this.http.post<BackendOrder>('/orders', {
      addressId,
      shippingOptionId: 'standard',
      paymentMethodCode: 'transfer',
      notes: null,
    }).pipe(
      map(order => {
        const mapped = mapOrder(order);
        this._orders.update(list => [mapped, ...list]);
        return mapped;
      }),
    );
  }
}
