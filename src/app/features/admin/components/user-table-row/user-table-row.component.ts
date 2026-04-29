import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IAdminUser } from '../../models/admin-user.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-user-table-row]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td class="td-user">
      <div class="cell-user-group">
        <div class="cell-avatar">{{ user().avatarInitials }}</div>
        <div>
          <p class="cell-primary">{{ user().fullName }}</p>
          <p class="cell-secondary">{{ user().email }}</p>
        </div>
      </div>
    </td>
    <td class="td-role">
      <span class="role-badge" [class]="'role-badge--' + user().role">
        {{ roleLabel(user().role) }}
      </span>
    </td>
    <td class="td-status">
      <span class="status-badge" [class]="'status-badge--' + user().status">
        {{ statusLabel(user().status) }}
      </span>
    </td>
    <td class="td-login">{{ formatDate(user().lastLoginAt) }}</td>
    <td class="td-actions">
      <div class="row-actions">
        <button class="btn-sm btn-ghost" type="button" (click)="viewProfile.emit(user().id)">
          Ver
        </button>
        @if (user().status === 'active') {
          <button class="btn-sm btn-danger" type="button" (click)="suspendUser.emit(user().id)">
            Suspender
          </button>
        } @else if (user().status === 'suspended') {
          <button class="btn-sm btn-success" type="button" (click)="reactivate.emit(user().id)">
            Reactivar
          </button>
        }
      </div>
    </td>
  `,
  styleUrl: './user-table-row.component.scss',
})
export class UserTableRowComponent {
  readonly user = input.required<IAdminUser>();

  readonly suspendUser = output<string>();
  readonly reactivate = output<string>();
  readonly viewProfile = output<string>();

  private readonly platformId = inject(PLATFORM_ID);

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      buyer: 'Comprador',
      producer: 'Productor',
      admin: 'Admin',
    };
    return map[role] ?? role;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      active: 'Activo',
      suspended: 'Suspendido',
      pending: 'Pendiente',
    };
    return map[status] ?? status;
  }

  formatDate(iso: string | undefined): string {
    if (!iso) return '—';
    if (!isPlatformBrowser(this.platformId)) return '';
    return new Date(iso).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
