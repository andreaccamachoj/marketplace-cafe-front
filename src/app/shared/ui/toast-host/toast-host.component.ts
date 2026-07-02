import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { ToastComponent } from '../toast/toast.component';

/**
 * Toast host — place ONCE in the root app shell (e.g., AppComponent template).
 * Reads toasts from NotificationService signal and renders them.
 */
@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="toast-host"
      aria-label="Notificaciones"
      role="region"
    >
      @for (toast of notifications.toasts(); track toast.id) {
        <app-toast
          [toast]="toast"
          (dismiss)="notifications.dismiss($event)"
        />
      }
    </div>
  `,
  styleUrl: './toast-host.component.scss',
})
export class ToastHostComponent {
  protected readonly notifications = inject(NotificationService);
}
