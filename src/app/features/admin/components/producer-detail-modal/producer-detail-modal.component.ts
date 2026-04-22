import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { IProducerApproval } from '../../models/producer-approval.model';

@Component({
  selector: 'app-producer-detail-modal',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (producer()) {
      <app-modal
        [open]="open()"
        [title]="producer()!.producerName"
        size="xl"
        (closed)="closed.emit()"
      >
        <div class="detail-body">
          <!-- Status badge -->
          <div class="status-row">
            <span class="status-badge" [class]="'status-badge--' + producer()!.status">
              {{ statusLabel(producer()!.status) }}
            </span>
            @if (producer()!.reviewedAt) {
              <span class="reviewed-info">
                Revisado el {{ formatDate(producer()!.reviewedAt!) }}
                @if (producer()!.reviewedBy) {
                  por {{ producer()!.reviewedBy }}
                }
              </span>
            }
          </div>

          <!-- Grid info + docs -->
          <div class="detail-grid">
            <!-- Info column -->
            <div class="detail-section">
              <h3 class="section-title">Información del productor</h3>
              <dl class="info-list">
                <div class="info-row">
                  <dt>Finca</dt>
                  <dd>{{ producer()!.farmName }}</dd>
                </div>
                <div class="info-row">
                  <dt>Región / Dpto.</dt>
                  <dd>{{ producer()!.region }}, {{ producer()!.department }}</dd>
                </div>
                <div class="info-row">
                  <dt>Hectáreas</dt>
                  <dd>{{ producer()!.hectares }} ha</dd>
                </div>
                <div class="info-row">
                  <dt>Variedad principal</dt>
                  <dd>{{ producer()!.mainVariety }}</dd>
                </div>
                <div class="info-row">
                  <dt>Email</dt>
                  <dd>{{ producer()!.email }}</dd>
                </div>
                <div class="info-row">
                  <dt>Teléfono</dt>
                  <dd>{{ producer()!.phone }}</dd>
                </div>
                <div class="info-row">
                  <dt>Fecha solicitud</dt>
                  <dd>{{ formatDate(producer()!.submittedAt) }}</dd>
                </div>
              </dl>
            </div>

            <!-- Documents column -->
            <div class="detail-section">
              <h3 class="section-title">Documentos ({{ producer()!.documents.length }})</h3>
              @if (producer()!.documents.length === 0) {
                <p class="no-docs">No se adjuntaron documentos.</p>
              } @else {
                <ul class="doc-list">
                  @for (doc of producer()!.documents; track doc.id) {
                    <li class="doc-item">
                      <span class="doc-icon">📄</span>
                      <div class="doc-info">
                        <p class="doc-name">{{ doc.name }}</p>
                        <p class="doc-type">{{ docTypeLabel(doc.type) }}</p>
                      </div>
                      <a class="doc-link" [href]="doc.url" target="_blank" rel="noopener">
                        Ver
                      </a>
                    </li>
                  }
                </ul>
              }
            </div>
          </div>

          <!-- Rejection reason (if rejected) -->
          @if (producer()!.status === 'rejected' && producer()!.rejectionReason) {
            <div class="rejection-section">
              <h3 class="section-title rejection-title">Motivo de rechazo</h3>
              <p class="rejection-text">{{ producer()!.rejectionReason }}</p>
            </div>
          }

          <!-- Inline rejection form (pending only) -->
          @if (producer()!.status === 'pending' && showRejectForm()) {
            <div class="inline-reject-form">
              <label class="form-label" for="reject-reason">Motivo del rechazo *</label>
              <textarea
                id="reject-reason"
                class="reject-textarea"
                rows="4"
                placeholder="Indica el motivo del rechazo (mínimo 20 caracteres)..."
                [(ngModel)]="rejectReason"
                maxlength="500"
              ></textarea>
              <p class="char-count">{{ rejectReason.length }} / 500</p>
            </div>
          }
        </div>

        <div modal-footer class="detail-footer">
          @if (producer()!.status === 'pending') {
            @if (!showRejectForm()) {
              <button class="btn-reject" type="button" (click)="showRejectForm.set(true)">
                ✕ Rechazar
              </button>
              <button class="btn-approve" type="button" (click)="onApprove()">
                ✓ Aprobar
              </button>
            } @else {
              <button class="btn-cancel" type="button" (click)="cancelReject()">
                Cancelar
              </button>
              <button
                class="btn-confirm-reject"
                type="button"
                [disabled]="rejectReason.trim().length < 20"
                (click)="onConfirmReject()"
              >
                Confirmar rechazo
              </button>
            }
          } @else {
            <button class="btn-close" type="button" (click)="closed.emit()">Cerrar</button>
          }
        </div>
      </app-modal>
    }
  `,
  styleUrl: './producer-detail-modal.component.scss',
})
export class ProducerDetailModalComponent implements OnChanges {
  readonly producer = input<IProducerApproval | null>(null);
  readonly open = input.required<boolean>();

  readonly closed = output<void>();
  readonly approved = output<string>();
  readonly rejected = output<{ id: string; reason: string }>();

  protected readonly showRejectForm = signal(false);
  protected rejectReason = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['producer']) {
      this.showRejectForm.set(false);
      this.rejectReason = '';
    }
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    };
    return map[status] ?? status;
  }

  docTypeLabel(type: string): string {
    const map: Record<string, string> = {
      rut: 'RUT',
      predial: 'Certificado Predial',
      cedula: 'Cédula',
      certificacion: 'Certificación',
      otro: 'Otro',
    };
    return map[type] ?? type;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  onApprove(): void {
    const p = this.producer();
    if (!p) return;
    this.approved.emit(p.id);
  }

  cancelReject(): void {
    this.showRejectForm.set(false);
    this.rejectReason = '';
  }

  onConfirmReject(): void {
    const p = this.producer();
    if (!p || this.rejectReason.trim().length < 20) return;
    this.rejected.emit({ id: p.id, reason: this.rejectReason.trim() });
    this.cancelReject();
  }
}
