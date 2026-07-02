import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="avatar"
      [ngClass]="['avatar--' + size, online !== null ? (online ? 'avatar--online' : 'avatar--offline') : '']"
      [attr.aria-label]="name || 'Avatar'"
      role="img"
    >
      @if (src && !imgError()) {
        <img
          [src]="src"
          [alt]="name"
          class="avatar__img"
          (error)="imgError.set(true)"
          loading="lazy"
        />
      } @else if (initials()) {
        <span class="avatar__initials" aria-hidden="true">{{ initials() }}</span>
      } @else {
        <!-- Default person icon -->
        <svg class="avatar__fallback" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      }

      @if (online !== null) {
        <span
          class="avatar__status-dot"
          [attr.aria-label]="online ? 'En línea' : 'Desconectado'"
        ></span>
      }
    </div>
  `,
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() src = '';
  @Input() name = '';
  @Input() size: AvatarSize = 'md';
  /** null = don't show status dot, true = online, false = offline */
  @Input() online: boolean | null = null;

  protected readonly imgError = signal(false);

  protected readonly initials = computed((): string => {
    if (!this.name) return '';
    const parts = this.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });
}
