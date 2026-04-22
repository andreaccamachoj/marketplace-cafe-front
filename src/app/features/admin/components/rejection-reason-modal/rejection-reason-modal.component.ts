import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-rejection-reason-modal',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [open]="open()"
      title="Rechazar solicitud"
      size="sm"
      (closed)="closed.emit()"
    >
      <div class="rejection-body">
        <p class="rejection-text">
          Estás rechazando la solicitud de <strong>{{ producerName() }}</strong>.
          Por favor indica el motivo:
        </p>
        <textarea
          class="rejection-textarea"
          [class.invalid]="showError()"
          rows="5"
          placeholder="Describe el motivo del rechazo (mínimo 20 caracteres)..."
          [(ngModel)]="reason"
          (input)="onInput()"
          maxlength="500"
        ></textarea>
        @if (showError()) {
          <p class="error-hint">El motivo debe tener al menos 20 caracteres.</p>
        }
        <p class="char-count">{{ reason.length }} / 500</p>
      </div>

      <div modal-footer class="rejection-footer">
        <button class="btn-cancel" type="button" (click)="closed.emit()">Cancelar</button>
        <button
          class="btn-confirm"
          type="button"
          [disabled]="reason.length < 20"
          (click)="onConfirm()"
        >
          Confirmar rechazo
        </button>
      </div>
    </app-modal>
  `,
  styleUrl: './rejection-reason-modal.component.scss',
})
export class RejectionReasonModalComponent {
  readonly producerName = input.required<string>();
  readonly open = input.required<boolean>();

  readonly closed = output<void>();
  readonly confirmed = output<string>();

  protected reason = '';
  protected readonly showError = signal(false);

  onInput(): void {
    if (this.showError() && this.reason.length >= 20) {
      this.showError.set(false);
    }
  }

  onConfirm(): void {
    if (this.reason.trim().length < 20) {
      this.showError.set(true);
      return;
    }
    this.confirmed.emit(this.reason.trim());
    this.reason = '';
    this.showError.set(false);
  }
}
