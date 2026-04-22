import { Injectable, computed, signal } from '@angular/core';
import { ICartItem } from '../models/cart.model';
import { SHIPPING_OPTIONS } from '../models/shipping.model';

const SEED_CART_ITEMS: ICartItem[] = [
  {
    id: 'c1',
    productId: 'p1',
    name: 'Geisha Washed',
    producer: 'Finca La Esperanza',
    price: 58000,
    qty: 2,
    emoji: '☕',
    organic: true,
    fairTrade: true,
    maxStock: 35,
  },
  {
    id: 'c2',
    productId: 'p2',
    name: 'Tabi Natural',
    producer: 'Café del Huila',
    price: 42000,
    qty: 1,
    emoji: '🫘',
    organic: false,
    fairTrade: true,
    maxStock: 60,
  },
  {
    id: 'c3',
    productId: 'p3',
    name: 'Caturra Honey',
    producer: 'Sierra Nevada Beans',
    price: 36000,
    qty: 3,
    emoji: '🌿',
    organic: true,
    fairTrade: false,
    maxStock: 80,
  },
];

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<ICartItem[]>(SEED_CART_ITEMS);
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

  add(item: Omit<ICartItem, 'qty'>): void {
    this._items.update(list => {
      const existing = list.find(i => i.id === item.id);
      if (existing) {
        return list.map(i =>
          i.id === item.id
            ? { ...i, qty: Math.min(i.qty + 1, i.maxStock) }
            : i,
        );
      }
      return [...list, { ...item, qty: 1 }];
    });
  }

  remove(id: string): void {
    this._items.update(list => list.filter(i => i.id !== id));
  }

  updateQty(id: string, qty: number): void {
    this._items.update(list =>
      list.map(i => {
        if (i.id !== id) return i;
        const clamped = Math.max(1, Math.min(qty, i.maxStock));
        return { ...i, qty: clamped };
      }),
    );
  }

  selectShipping(optionId: string): void {
    this._shippingOptionId.set(optionId);
  }

  applyCoupon(code: string): boolean {
    if (code.toUpperCase() === 'CAFE10') {
      this._couponCode.set(code);
      this._couponDiscount.set(0.1);
      return true;
    }
    return false;
  }

  clear(): void {
    this._items.set([]);
    this._couponCode.set(null);
    this._couponDiscount.set(0);
  }
}
