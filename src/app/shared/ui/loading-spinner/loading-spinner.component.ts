import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="spinner"
      [class]="'spinner--' + size + (overlay ? ' spinner--overlay' : '')"
      role="status"
      [attr.aria-label]="label"
    >
      <svg
        class="spinner__circle"
        viewBox="0 0 50 50"
        aria-hidden="true"
      >
        <circle
          class="spinner__track"
          cx="25" cy="25" r="20"
          fill="none"
          stroke-width="4"
        />
        <circle
          class="spinner__arc"
          cx="25" cy="25" r="20"
          fill="none"
          stroke-width="4"
          stroke-dasharray="80 200"
          stroke-linecap="round"
        />
      </svg>
      <span class="sr-only">{{ label }}</span>
    </div>
  `,
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() label = 'Cargando…';
  /** Show as full-page overlay */
  @Input() overlay = false;
}
