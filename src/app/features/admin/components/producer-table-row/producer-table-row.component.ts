import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IProducerApproval } from '../../models/producer-approval.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-producer-table-row]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td class="td-name">
      <div class="cell-name-group">
        <div class="cell-avatar">{{ initials(producer().producerName) }}</div>
        <div>
          <p class="cell-primary">{{ producer().farmName }}</p>
          <p class="cell-secondary">{{ producer().producerName }}</p>
        </div>
      </div>
    </td>
    <td class="td-region">{{ producer().region }}</td>
    <td class="td-date">{{ formatDate(producer().submittedAt) }}</td>
    <td class="td-status">
      <span class="status-badge" [class]="'status-badge--' + producer().status">
        {{ statusLabel(producer().status) }}
      </span>
    </td>
    <td class="td-docs">{{ producer().documents.length }} doc{{ producer().documents.length !== 1 ? 's' : '' }}</td>
    <td class="td-actions">
      <div class="row-actions">
        <button class="btn-sm btn-ghost" type="button" (click)="viewDetails.emit(producer())">
          Ver
        </button>
        @if (producer().status === 'pending') {
          <button class="btn-sm btn-approve" type="button" (click)="approve.emit(producer().id)">
            ✓ Aprobar
          </button>
          <button class="btn-sm btn-reject" type="button" (click)="reject.emit(producer().id)">
            ✕ Rechazar
          </button>
        }
      </div>
    </td>
  `,
  styleUrl: './producer-table-row.component.scss',
})
export class ProducerTableRowComponent {
  readonly producer = input.required<IProducerApproval>();

  readonly viewDetails = output<IProducerApproval>();
  readonly approve = output<string>();
  readonly reject = output<string>();

  private readonly platformId = inject(PLATFORM_ID);

  initials(name: string): string {
    const parts = name.trim().split(' ');
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    };
    return map[status] ?? status;
  }

  formatDate(iso: string): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return new Date(iso).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
