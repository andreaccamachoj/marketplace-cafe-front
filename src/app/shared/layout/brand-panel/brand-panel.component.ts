import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="brand-panel">
      <div class="brand-panel__logo" aria-hidden="true">☕</div>
      <div class="brand-panel__info">
        <h1 class="brand-panel__title">{{ title }}</h1>
        @if (subtitle) {
          <p class="brand-panel__subtitle">{{ subtitle }}</p>
        }
      </div>
    </div>
  `,
  styleUrl: './brand-panel.component.scss',
})
export class BrandPanelComponent {
  @Input() title = 'World Coffee';
  @Input() subtitle = '';
}
