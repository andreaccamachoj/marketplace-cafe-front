import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core/auth/services/auth.service';
import { ICartItem } from '../models/cart.model';
import { SHIPPING_OPTIONS } from '../models/shipping.model';

interface BackendCartItem {
  id: string;
  productId: string;
  productName: string;
  producerName: string;
  price: number;
  quantity: number;
  emoji: string;
  maxStock: number;
}

interface BackendCart {
  id: string;
  items: BackendCartItem[];
  couponCode: string | null;
  shippingOptionId: string | null;
}

function mapItem(b: BackendCartItem): ICartItem {
  return {
    id: b.id, productId: b.productId,
    name: b.productName ?? 'Producto',
    producer: b.producerName ?? '',
    price: b.price, qty: b.quantity,
    emoji: b.emoji ?? '☕',
    organic: false, fairTrade: false,
    maxStock: b.maxStock ?? 99,
  };
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);

  private readonly _items = signal<ICartItem[]>([]);
  private readonly _couponCode = signal<string | null>(null);
  private readonly _couponDiscount = signal<number>(0);
  private readonly _shippingOptionId = signal<string>('standard');

  readonly items = this._items.asReadonly();
  readonly couponCode = this._couponCode.asReadonly();
  readonly couponDiscount = this._couponDiscount.asReadonly();
  readonly shippingOptionId = this._shippingOptionId.asReadonly();

  readonly count = computed(() => this._items().reduce((s, i) => s + i.qty, 0));
  readonly subtotal = computed(() => this._items().reduce((s, i) => s + i.price * i.qty, 0));
  readonly shipping = computed(() =>
    SHIPPING_OPTIONS.find(o => o.id === this._shippingOptionId())?.price ?? 0,
  );
  readonly discount = computed(() => Math.round(this.subtotal() * this._couponDiscount()));
  readonly total = computed(() => this.subtotal() + this.shipping() - this.discount());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendCart>('/cart').subscribe({ next: c => this.applyCart(c) });
  }

  add(item: Omit<ICartItem, 'qty'>): void {
    if (this.auth.isAuthenticated() && !this.auth.isBuyer()) return;
    this.http.post<BackendCart>('/cart/items', {
      productId: item.productId, quantity: 1, unitPriceSnapshot: item.price,
    }).subscribe({ next: c => this.applyCart(c) });
  }

  remove(id: string): void {
    this.http.delete<BackendCart>(`/cart/items/${id}`).subscribe({ next: c => this.applyCart(c) });
  }

  updateQty(id: string, qty: number): void {
    this.http.patch<BackendCart>(`/cart/items/${id}`, { quantity: qty }).subscribe({ next: c => this.applyCart(c) });
  }

  selectShipping(optionId: string): void {
    this._shippingOptionId.set(optionId);
    this.http.patch<BackendCart>('/cart/shipping', { shippingOptionId: optionId }).subscribe({ next: c => this.applyCart(c) });
  }

  applyCoupon(code: string): boolean {
    this.http.post<BackendCart>('/cart/coupon', { code }).subscribe({
      next: c => { this.applyCart(c); this._couponCode.set(code); this._couponDiscount.set(0.1); },
    });
    return true;
  }

  clear(): void {
    this.http.delete('/cart').subscribe({
      next: () => { this._items.set([]); this._couponCode.set(null); this._couponDiscount.set(0); },
    });
  }

  private applyCart(cart: BackendCart): void {
    this._items.set((cart.items ?? []).map(mapItem));
    if (cart.shippingOptionId) this._shippingOptionId.set(cart.shippingOptionId);
  }
}
