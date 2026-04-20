import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state" role="status" [attr.aria-label]="title">
      @if (illustration) {
        <div class="empty-state__illustration" aria-hidden="true">
          {{ illustration }}
        </div>
      } @else {
        <svg class="empty-state__svg" viewBox="0 0 80 80" fill="none" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="36" fill="#f3f4f6"/>
          <path d="M28 52V36a4 4 0 014-4h16a4 4 0 014 4v16M24 52h32" stroke="#d1d5db"
                stroke-width="2.5" stroke-linecap="round"/>
          <path d="M35 32v-4a5 5 0 0110 0v4" stroke="#d1d5db" stroke-width="2.5"
                stroke-linecap="round"/>
        </svg>
      }

      <h3 class="empty-state__title">{{ title }}</h3>

      @if (description) {
        <p class="empty-state__desc">{{ description }}</p>
      }

      @if (actionLabel) {
        <ng-content />
      }
    </div>
  `,
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() title = 'Sin resultados';
  @Input() description = '';
  /** Emoji or text to show instead of the default SVG */
  @Input() illustration = '';
  /** When provided, renders the ng-content slot (expected: a button) */
  @Input() actionLabel = '';
}
