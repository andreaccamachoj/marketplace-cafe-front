import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IAdminUser } from '../models/admin-user.model';

function mapUser(b: Record<string, unknown>): IAdminUser {
  const statusMap: Record<string, 'active' | 'suspended' | 'pending'> = {
    active: 'active', banned: 'suspended', inactive: 'pending', pending_verification: 'pending',
  };
  const fn = String(b['fullName'] ?? b['email'] ?? '');
  return {
    id: String(b['id']),
    fullName: fn,
    email: String(b['email'] ?? ''),
    role: (String(b['role'] ?? 'buyer').toLowerCase() as 'buyer' | 'producer' | 'admin'),
    status: statusMap[String(b['status']?.toString().toLowerCase())] ?? 'active',
    joinedAt: String(b['createdAt'] ?? ''),
    avatarInitials: fn.split(' ').map((n: string) => n[0] ?? '').join('').toUpperCase().slice(0, 2),
  };
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _users = signal<IAdminUser[]>([]);

  readonly all = computed(() => this._users());
  readonly activeCount = computed(() => this._users().filter(u => u.status === 'active').length);
  readonly suspendedCount = computed(() => this._users().filter(u => u.status === 'suspended').length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/admin/users').subscribe({
      next: list => this._users.set(list.map(mapUser)),
    });
  }

  suspend(id: string): void {
    this.http.patch(`/admin/users/${id}/ban`, { reason: 'Admin action' }).subscribe({
      next: () => this._users.update(list => list.map(u => u.id === id ? { ...u, status: 'suspended' as const } : u)),
    });
  }

  reactivate(id: string): void {
    this.http.patch(`/admin/users/${id}/unban`, {}).subscribe({
      next: () => this._users.update(list => list.map(u => u.id === id ? { ...u, status: 'active' as const } : u)),
    });
  }

  getByRole(role: string): IAdminUser[] {
    return this._users().filter(u => u.role === role);
  }
}
