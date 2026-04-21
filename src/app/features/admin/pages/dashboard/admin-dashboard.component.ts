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
import { Role } from '@core/auth/models/role.enum';

/* ── Interfaces ── */
export interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'suspended';
  memberSince: string;
}

export interface IAdminProduct {
  id: string;
  emoji: string;
  name: string;
  category: string;
  producer: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface IAdminProducer {
  id: string;
  name: string;
  email: string;
  farmName: string;
  region: string;
  dateApplied: string;
}

export interface IActivityItem {
  id: string;
  icon: string;
  iconBg: string;
  description: string;
  time: string;
}

/* ── Seed data ── */
const INITIAL_USERS: IAdminUser[] = [
  {
    id: 'u1',
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    role: Role.BUYER,
    status: 'active',
    memberSince: 'Ene 2025',
  },
  {
    id: 'u2',
    name: 'Carlos Rodríguez',
    email: 'carlos.r@email.com',
    role: Role.PRODUCER,
    status: 'active',
    memberSince: 'Feb 2025',
  },
  {
    id: 'u3',
    name: 'María López',
    email: 'maria.lopez@email.com',
    role: Role.BUYER,
    status: 'active',
    memberSince: 'Mar 2025',
  },
  {
    id: 'u4',
    name: 'Admin WCM',
    email: 'admin@wcm.co',
    role: Role.ADMIN,
    status: 'active',
    memberSince: 'Ene 2025',
  },
  {
    id: 'u5',
    name: 'Pedro Sánchez',
    email: 'pedro.s@email.com',
    role: Role.BUYER,
    status: 'suspended',
    memberSince: 'Mar 2025',
  },
  {
    id: 'u6',
    name: 'Lucía Fernández',
    email: 'lucia.f@email.com',
    role: Role.PRODUCER,
    status: 'active',
    memberSince: 'Abr 2025',
  },
];

const INITIAL_PRODUCTS: IAdminProduct[] = [
  {
    id: 'p1',
    emoji: '☕',
    name: 'Geisha Washed',
    category: 'Especial',
    producer: 'Finca La Esperanza',
    price: 58000,
    stock: 35,
    status: 'active',
  },
  {
    id: 'p2',
    emoji: '🫘',
    name: 'Tabi Natural',
    category: 'Microlote',
    producer: 'Café del Huila',
    price: 42000,
    stock: 60,
    status: 'active',
  },
  {
    id: 'p3',
    emoji: '🌿',
    name: 'Caturra Honey',
    category: 'Honey Process',
    producer: 'Sierra Nevada Beans',
    price: 36000,
    stock: 80,
    status: 'pending',
  },
  {
    id: 'p4',
    emoji: '🍂',
    name: 'Bourbon Natural',
    category: 'Natural',
    producer: 'Cafés del Eje',
    price: 29000,
    stock: 0,
    status: 'inactive',
  },
  {
    id: 'p5',
    emoji: '🏔',
    name: 'Castillo Washed',
    category: 'Lavado',
    producer: 'Nariño Select',
    price: 32000,
    stock: 45,
    status: 'active',
  },
];

const INITIAL_PRODUCERS: IAdminProducer[] = [
  {
    id: 'pr1',
    name: 'Juan Medina',
    email: 'juan.medina@finca.co',
    farmName: 'Finca El Paraíso',
    region: 'Huila, Colombia',
    dateApplied: '15 abr 2025',
  },
  {
    id: 'pr2',
    name: 'Sofía Castro',
    email: 'sofia.c@cafetera.co',
    farmName: 'La Cafetera Verde',
    region: 'Nariño, Colombia',
    dateApplied: '18 abr 2025',
  },
  {
    id: 'pr3',
    name: 'Andrés Moreno',
    email: 'andres.m@montaña.co',
    farmName: 'Cafés de Montaña',
    region: 'Antioquia, Colombia',
    dateApplied: '20 abr 2025',
  },
];

const ACTIVITY_ITEMS: IActivityItem[] = [
  {
    id: 'a1',
    icon: '👤',
    iconBg: 'rgba(30,94,41,.1)',
    description: 'Ana García se registró como compradora',
    time: 'Hace 5 min',
  },
  {
    id: 'a2',
    icon: '📦',
    iconBg: 'rgba(55,38,23,.08)',
    description: 'Finca La Esperanza agregó "Geisha Washed"',
    time: 'Hace 23 min',
  },
  {
    id: 'a3',
    icon: '✅',
    iconBg: 'rgba(30,94,41,.1)',
    description: 'Pedido WCM-2025-041 entregado correctamente',
    time: 'Hace 1 h',
  },
  {
    id: 'a4',
    icon: '⭐',
    iconBg: 'rgba(192,120,32,.1)',
    description: 'Luis Torres calificó con 5 estrellas a Café del Huila',
    time: 'Hace 2 h',
  },
  {
    id: 'a5',
    icon: '🆕',
    iconBg: 'rgba(91,62,143,.1)',
    description: 'Nuevo productor "Cafés de Montaña" solicita aprobación',
    time: 'Hace 3 h',
  },
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, DecimalPipe, RouterLink, DashboardNavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  protected readonly auth   = inject(AuthService);
  protected readonly notify = inject(NotificationService);

  /* ── UI state ── */
  readonly sidebarOpen = signal(false);
  readonly activeTab   = signal<'overview' | 'users' | 'products' | 'producers'>('overview');

  /* ── User ── */
  protected readonly adminName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Admin',
  );

  /* ── Stats ── */
  readonly totalUsers       = signal(234);
  readonly activeProductsCount = signal(87);
  readonly activeOrdersCount   = signal(42);

  /* ── Data ── */
  readonly users     = signal<IAdminUser[]>(INITIAL_USERS);
  readonly products  = signal<IAdminProduct[]>(INITIAL_PRODUCTS);
  readonly producers = signal<IAdminProducer[]>(INITIAL_PRODUCERS);
  readonly activity  = signal<IActivityItem[]>(ACTIVITY_ITEMS);

  /* ── Computed counts for nav pills ── */
  readonly pendingProducersCount = computed(() => this.producers().length);
  readonly usersCount = computed(() => this.users().length);

  /* ── Role enum for template ── */
  protected readonly Role = Role;

  /* ── Actions ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: 'overview' | 'users' | 'products' | 'producers'): void {
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

  approveProducer(id: string): void {
    const producer = this.producers().find(p => p.id === id);
    this.producers.update(list => list.filter(p => p.id !== id));
    this.showToast(`Productor "${producer?.name}" aprobado correctamente.`, 'success');
  }

  rejectProducer(id: string): void {
    const producer = this.producers().find(p => p.id === id);
    this.producers.update(list => list.filter(p => p.id !== id));
    this.showToast(`Solicitud de "${producer?.name}" rechazada.`, 'error');
  }

  suspendUser(id: string): void {
    const user = this.users().find(u => u.id === id);
    if (!user) return;
    if (user.status === 'suspended') {
      this.users.update(list =>
        list.map(u => u.id === id ? { ...u, status: 'active' as const } : u),
      );
      this.showToast(`Usuario "${user.name}" reactivado.`, 'success');
    } else {
      this.users.update(list =>
        list.map(u => u.id === id ? { ...u, status: 'suspended' as const } : u),
      );
      this.showToast(`Usuario "${user.name}" suspendido.`, 'error');
    }
  }
}
