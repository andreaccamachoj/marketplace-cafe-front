import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface IToast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="toast"
      [ngClass]="'toast--' + toast.type"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span class="toast__icon" aria-hidden="true">{{ icon }}</span>

      <div class="toast__content">
        @if (toast.title) {
          <strong class="toast__title">{{ toast.title }}</strong>
        }
        <span class="toast__message">{{ toast.message }}</span>
      </div>

      <button
        type="button"
        class="toast__close"
        aria-label="Cerrar notificación"
        (click)="dismiss.emit(toast.id)"
      >×</button>
    </div>
  `,
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @Input({ required: true }) toast!: IToast;
  @Output() dismiss = new EventEmitter<string>();

  get icon(): string {
    switch (this.toast.type) {
      case 'success': return '✓';
      case 'error':   return '✕';
      case 'warning': return '⚠';
      default:        return 'ℹ';
    }
  }
}
