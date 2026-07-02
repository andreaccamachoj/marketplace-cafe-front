import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [open]="open"
      [title]="title"
      size="sm"
      [closeOnBackdrop]="false"
      (closed)="onCancel()"
    >
      @if (message) {
        <p class="confirm-dialog__message">{{ message }}</p>
      }

      <ng-content />

      <div class="confirm-dialog__actions" modal-footer>
        <app-button
          variant="ghost"
          [disabled]="busy()"
          (click)="onCancel()"
        >
          {{ cancelLabel }}
        </app-button>
        <app-button
          [variant]="variant === 'danger' ? 'danger' : 'primary'"
          [loading]="busy()"
          (click)="onConfirm()"
        >
          {{ confirmLabel }}
        </app-button>
      </div>
    </app-modal>
  `,
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = '¿Estás seguro?';
  @Input() message = '';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() variant: ConfirmDialogVariant = 'danger';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  protected readonly busy = signal(false);

  protected onConfirm(): void {
    this.busy.set(true);
    this.confirmed.emit();
    // Parent is expected to close the dialog; reset busy after a tick
    setTimeout(() => this.busy.set(false), 400);
  }

  protected onCancel(): void {
    if (!this.busy()) this.cancelled.emit();
  }
}
