import { Injectable, computed, signal } from '@angular/core';
import { IAdminUser } from '../models/admin-user.model';

const SEED_USERS: IAdminUser[] = [
  {
    id: 'u-1',
    fullName: 'Ana García López',
    email: 'ana.garcia@ejemplo.co',
    role: 'buyer',
    status: 'active',
    joinedAt: '2025-01-15T10:00:00Z',
    lastLoginAt: '2025-04-20T08:30:00Z',
    ordersCount: 12,
    avatarInitials: 'AG',
  },
  {
    id: 'u-2',
    fullName: 'Luis Fernando Torres',
    email: 'luis.torres@ejemplo.co',
    role: 'producer',
    status: 'active',
    joinedAt: '2025-02-01T09:00:00Z',
    lastLoginAt: '2025-04-19T14:00:00Z',
    productsCount: 8,
    avatarInitials: 'LT',
  },
  {
    id: 'u-3',
    fullName: 'Sandra Milena Cruz',
    email: 'sandra.cruz@ejemplo.co',
    role: 'buyer',
    status: 'active',
    joinedAt: '2025-02-20T11:00:00Z',
    lastLoginAt: '2025-04-18T16:45:00Z',
    ordersCount: 5,
    avatarInitials: 'SC',
  },
  {
    id: 'u-4',
    fullName: 'Roberto Hernández',
    email: 'roberto.h@ejemplo.co',
    role: 'producer',
    status: 'suspended',
    joinedAt: '2025-01-28T14:00:00Z',
    lastLoginAt: '2025-03-10T10:00:00Z',
    productsCount: 3,
    avatarInitials: 'RH',
  },
  {
    id: 'u-5',
    fullName: 'Valentina Moreno',
    email: 'vale.moreno@ejemplo.co',
    role: 'buyer',
    status: 'active',
    joinedAt: '2025-03-05T08:00:00Z',
    lastLoginAt: '2025-04-21T09:00:00Z',
    ordersCount: 2,
    avatarInitials: 'VM',
  },
  {
    id: 'u-6',
    fullName: 'Carlos Admin WCM',
    email: 'admin@wcm.co',
    role: 'admin',
    status: 'active',
    joinedAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-04-22T07:00:00Z',
    avatarInitials: 'CA',
  },
];

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly _users = signal<IAdminUser[]>(SEED_USERS);

  readonly all = computed(() => this._users());
  readonly activeCount = computed(() => this._users().filter(u => u.status === 'active').length);
  readonly suspendedCount = computed(() => this._users().filter(u => u.status === 'suspended').length);

  suspend(id: string): void {
    this._users.update(list =>
      list.map(u => u.id === id ? { ...u, status: 'suspended' as const } : u),
    );
  }

  reactivate(id: string): void {
    this._users.update(list =>
      list.map(u => u.id === id ? { ...u, status: 'active' as const } : u),
    );
  }

  getByRole(role: string): IAdminUser[] {
    return this._users().filter(u => u.role === role);
  }
}
