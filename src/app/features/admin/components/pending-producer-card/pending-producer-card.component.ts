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
  selector: 'app-pending-producer-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="producer-card">
      <div class="card-header">
        <div class="card-avatar">
          {{ initials(producer().producerName) }}
        </div>
        <div class="card-info">
          <p class="card-producer-name">{{ producer().producerName }}</p>
          <p class="card-farm">{{ producer().farmName }}</p>
          <p class="card-region">📍 {{ producer().region }}</p>
        </div>
        <span class="status-badge" [class]="'status-badge--' + producer().status">
          {{ statusLabel(producer().status) }}
        </span>
      </div>

      <div class="card-meta">
        <div class="meta-item">
          <span class="meta-label">Solicitud</span>
          <span class="meta-value">{{ relativeTime(producer().submittedAt) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Documentos</span>
          <span class="meta-value">{{ producer().documents.length }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Hectáreas</span>
          <span class="meta-value">{{ producer().hectares }} ha</span>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-ghost" type="button" (click)="viewDetails.emit(producer())">
          Ver detalles
        </button>
        @if (producer().status === 'pending') {
          <button class="btn-approve" type="button" (click)="quickApprove.emit(producer().id)">
            ✓ Aprobar
          </button>
          <button class="btn-reject" type="button" (click)="quickReject.emit(producer().id)">
            ✕ Rechazar
          </button>
        }
      </div>
    </article>
  `,
  styleUrl: './pending-producer-card.component.scss',
})
export class PendingProducerCardComponent {
  readonly producer = input.required<IProducerApproval>();

  readonly viewDetails = output<IProducerApproval>();
  readonly quickApprove = output<string>();
  readonly quickReject = output<string>();

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

  relativeTime(iso: string): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffD = Math.floor((now - then) / 86400000);
    if (diffD < 1) return 'Hoy';
    if (diffD === 1) return 'Hace 1 día';
    if (diffD < 30) return `Hace ${diffD} días`;
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }
}
