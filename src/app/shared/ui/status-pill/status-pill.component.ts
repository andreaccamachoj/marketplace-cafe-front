import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type PillVariant = 'green' | 'amber' | 'blue' | 'red' | 'purple' | 'neutral';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="pill"
      [ngClass]="'pill--' + resolvedVariant"
    >
      @if (showDot) {
        <span class="pill__dot" aria-hidden="true"></span>
      }
      {{ status || variant }}
    </span>
  `,
  styleUrl: './status-pill.component.scss',
})
export class StatusPillComponent {
  @Input() variant: PillVariant | '' = '';
  @Input() status = '';
  @Input() showDot = false;

  get resolvedVariant(): PillVariant {
    if (this.variant) return this.variant as PillVariant;
    const map: Record<string, PillVariant> = {
      confirmed: 'green', active: 'green', approved: 'green', delivered: 'green', available: 'green',
      pending: 'amber', preparing: 'amber', processing: 'amber',
      shipped: 'blue', info: 'blue',
      cancelled: 'red', rejected: 'red', error: 'red', suspended: 'red',
      premium: 'purple', featured: 'purple',
    };
    return map[this.status.toLowerCase()] ?? 'neutral';
  }
}
