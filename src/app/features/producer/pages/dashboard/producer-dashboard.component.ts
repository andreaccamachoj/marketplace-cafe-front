import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';

/* ── Interfaces ── */
export interface IProducerProduct {
  id: string;
  emoji: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  price: number;
  stock: number;
}

export interface IProducerOrder {
  id: string;
  number: string;
  buyer: string;
  date: string;
  total: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered';
}

/* ── Seed data ── */
const INITIAL_PRODUCTS: IProducerProduct[] = [
  {
    id: 'p1',
    emoji: '☕',
    name: 'Geisha Washed',
    category: 'Especial',
    status: 'active',
    price: 58000,
    stock: 35,
  },
  {
    id: 'p2',
    emoji: '🫘',
    name: 'Tabi Natural',
    category: 'Microlote',
    status: 'active',
    price: 42000,
    stock: 60,
  },
  {
    id: 'p3',
    emoji: '🌿',
    name: 'Caturra Honey',
    category: 'Honey Process',
    status: 'active',
    price: 36000,
    stock: 80,
  },
  {
    id: 'p4',
    emoji: '🍂',
    name: 'Bourbon Natural',
    category: 'Natural',
    status: 'inactive',
    price: 29000,
    stock: 0,
  },
];

const INITIAL_ORDERS: IProducerOrder[] = [
  {
    id: 'o1',
    number: 'WCM-2025-041',
    buyer: 'Ana García',
    date: '18 abr 2025',
    total: 116000,
    status: 'pending',
  },
  {
    id: 'o2',
    number: 'WCM-2025-039',
    buyer: 'Luis Torres',
    date: '16 abr 2025',
    total: 84000,
    status: 'preparing',
  },
  {
    id: 'o3',
    number: 'WCM-2025-035',
    buyer: 'Marta López',
    date: '12 abr 2025',
    total: 58000,
    status: 'shipped',
  },
  {
    id: 'o4',
    number: 'WCM-2025-030',
    buyer: 'Diego Rojas',
    date: '05 abr 2025',
    total: 72000,
    status: 'delivered',
  },
];

@Component({
  selector: 'app-producer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, DecimalPipe, RouterLink, DashboardNavComponent],
  templateUrl: './producer-dashboard.component.html',
  styleUrl: './producer-dashboard.component.scss',
})
export class ProducerDashboardComponent {
  protected readonly auth   = inject(AuthService);
  protected readonly notify = inject(NotificationService);

  /* ── UI state ── */
  readonly sidebarOpen = signal(false);
  readonly activeTab   = signal<'overview' | 'products' | 'orders'>('overview');

  /* ── User ── */
  protected readonly firstName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Productor',
  );

  protected readonly producerStatus = computed(() =>
    this.auth.currentUser()?.producerStatus ?? 'pending',
  );

  /* ── Stats ── */
  readonly activeProducts = signal(12);
  readonly monthlySales   = signal(4850000);
  readonly pendingOrders  = signal(3);
  readonly avgRating      = signal(4.8);

  /* ── Data ── */
  readonly products = signal<IProducerProduct[]>(INITIAL_PRODUCTS);
  readonly orders   = signal<IProducerOrder[]>(INITIAL_ORDERS);

  /* ── Actions ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: 'overview' | 'products' | 'orders'): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.auth.logout();
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

  toggleProductStatus(id: string): void {
    this.products.update(list =>
      list.map(p =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
          : p,
      ),
    );
    const product = this.products().find(p => p.id === id);
    const label = product?.status === 'active' ? 'activado' : 'desactivado';
    this.showToast(`Producto ${label} correctamente.`, 'success');
  }
}
