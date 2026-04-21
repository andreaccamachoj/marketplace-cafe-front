import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';

/* ── Interfaces ── */
export interface ICartItem {
  id: string;
  name: string;
  producer: string;
  price: number;
  qty: number;
  emoji: string;
  organic: boolean;
  fairTrade: boolean;
}

export interface IOrderStep {
  label: string;
  done: boolean;
  active: boolean;
}

export interface IOrderItem {
  name: string;
  qty: number;
  emoji: string;
}

export interface IOrder {
  id: string;
  number: string;
  date: string;
  status: 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  statusLabel: string;
  total: number;
  address: string;
  items: IOrderItem[];
  steps: IOrderStep[];
}

export interface IOrderFilter {
  label: string;
  value: string;
}

/* ── Seed data ── */
const INITIAL_CART_ITEMS: ICartItem[] = [
  {
    id: 'c1',
    name: 'Geisha Washed',
    producer: 'Finca La Esperanza',
    price: 58000,
    qty: 2,
    emoji: '☕',
    organic: true,
    fairTrade: true,
  },
  {
    id: 'c2',
    name: 'Tabi Natural',
    producer: 'Café del Huila',
    price: 42000,
    qty: 1,
    emoji: '🫘',
    organic: false,
    fairTrade: true,
  },
  {
    id: 'c3',
    name: 'Caturra Honey',
    producer: 'Sierra Nevada Beans',
    price: 36000,
    qty: 3,
    emoji: '🌿',
    organic: true,
    fairTrade: false,
  },
];

const MOCK_ORDERS: IOrder[] = [
  {
    id: 'o1',
    number: 'WCM-2025-001',
    date: '15 abr 2025',
    status: 'shipped',
    statusLabel: 'En camino',
    total: 134000,
    address: 'Calle 72 #10-45, Bogotá',
    items: [
      { name: 'Geisha Washed', qty: 1, emoji: '☕' },
      { name: 'Tabi Natural', qty: 2, emoji: '🫘' },
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
    statusLabel: 'Preparando',
    total: 72000,
    address: 'Carrera 15 #88-20, Bogotá',
    items: [
      { name: 'Caturra Honey', qty: 2, emoji: '🌿' },
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
    statusLabel: 'Entregado',
    total: 96000,
    address: 'Av. El Dorado #69-76, Bogotá',
    items: [
      { name: 'Geisha Washed', qty: 1, emoji: '☕' },
      { name: 'Tabi Natural',  qty: 1, emoji: '🫘' },
    ],
    steps: [
      { label: 'Confirmado', done: true, active: false },
      { label: 'Preparando', done: true, active: false },
      { label: 'En camino',  done: true, active: false },
      { label: 'Entregado',  done: true, active: false },
    ],
  },
];

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, DecimalPipe, RouterLink, DashboardNavComponent],
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.scss',
})
export class BuyerDashboardComponent {
  protected readonly auth   = inject(AuthService);
  protected readonly notify = inject(NotificationService);
  protected readonly router = inject(Router);

  /* ── UI state ── */
  readonly sidebarOpen   = signal(false);
  readonly activeTab     = signal<'cart' | 'orders'>('cart');
  readonly orderFilter   = signal<string>('all');
  readonly expandedOrder = signal<string | null>(null);

  /* ── User ── */
  protected readonly firstName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Usuario',
  );

  /* ── Cart state ── */
  readonly cartItems = signal<ICartItem[]>(INITIAL_CART_ITEMS);

  readonly cartCount = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.qty, 0),
  );

  readonly cartTotal = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.price * i.qty, 0),
  );

  /* ── Order stats ── */
  readonly activeOrders    = signal(2);
  readonly deliveredOrders = signal(8);
  readonly favoritesCount  = signal(5);

  /* ── Orders ── */
  readonly orders = signal<IOrder[]>(MOCK_ORDERS);

  readonly orderFilters: IOrderFilter[] = [
    { label: 'Todos',       value: 'all'       },
    { label: 'En camino',   value: 'shipped'   },
    { label: 'Preparando',  value: 'preparing' },
    { label: 'Entregados',  value: 'delivered' },
    { label: 'Cancelados',  value: 'cancelled' },
  ];

  readonly filteredOrders = computed(() => {
    const filter = this.orderFilter();
    if (filter === 'all') return this.orders();
    return this.orders().filter(o => o.status === filter);
  });

  /* ── Actions ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: 'cart' | 'orders'): void {
    this.activeTab.set(tab);
  }

  setTabAndFilter(tab: 'cart' | 'orders', filter: string): void {
    this.activeTab.set(tab);
    this.orderFilter.set(filter);
  }

  toggleOrder(id: string): void {
    this.expandedOrder.update(current => (current === id ? null : id));
  }

  increaseQty(id: string): void {
    this.cartItems.update(items =>
      items.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    );
  }

  decreaseQty(id: string): void {
    this.cartItems.update(items =>
      items.map(i => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)),
    );
  }

  removeItem(id: string): void {
    this.cartItems.update(items => items.filter(i => i.id !== id));
  }

  showToast(msg: string, type: 'info' | 'success' | 'error'): void {
    if (type === 'success') {
      this.notify.success(msg);
    } else if (type === 'error') {
      this.notify.error(msg);
    } else {
      this.notify.info(msg);
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
