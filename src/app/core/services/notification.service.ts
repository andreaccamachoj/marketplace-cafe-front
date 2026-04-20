import { Injectable, signal } from '@angular/core';
import { IToast } from '../../shared/ui/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly toasts = signal<IToast[]>([]);

  success(message: string, title?: string): void {
    this.add({ type: 'success', message, title });
  }

  error(message: string, title?: string): void {
    this.add({ type: 'error', message, title });
  }

  info(message: string, title?: string): void {
    this.add({ type: 'info', message, title });
  }

  warning(message: string, title?: string): void {
    this.add({ type: 'warning', message, title });
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private add(toast: Omit<IToast, 'id'>): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    this.toasts.update(list => [...list, { ...toast, id }]);
    setTimeout(() => this.dismiss(id), toast.duration ?? 3200);
  }
}
