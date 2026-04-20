import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type StatTrend = 'up' | 'down' | 'neutral';
export type StatColor = 'espresso' | 'green' | 'amber' | 'blue' | 'purple' | 'neutral';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="stat-card"
      [ngClass]="'stat-card--' + color"
      [attr.aria-label]="label + ': ' + value"
    >
      <!-- icon slot -->
      @if (icon) {
        <div class="stat-card__icon" aria-hidden="true">
          <span class="material-icon">{{ icon }}</span>
        </div>
      }

      <div class="stat-card__body">
        <p class="stat-card__label">{{ label }}</p>
        <p class="stat-card__value">{{ value }}</p>

        @if (change !== null) {
          <p
            class="stat-card__change"
            [ngClass]="{
              'stat-card__change--up':      trendResolved() === 'up',
              'stat-card__change--down':    trendResolved() === 'down',
              'stat-card__change--neutral': trendResolved() === 'neutral'
            }"
            aria-live="polite"
          >
            <span aria-hidden="true">{{ trendIcon() }}</span>
            {{ changeLabel }}
          </p>
        }
      </div>
    </article>
  `,
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() color: StatColor = 'neutral';
  /** Numeric change value (positive = up, negative = down). Null hides the row. */
  @Input() change: number | null = null;
  /** Human-readable change label e.g. "vs. mes anterior" */
  @Input() changeLabel = '';
  /** Override automatic trend detection */
  @Input() trend: StatTrend | '' = '';

  protected readonly trendResolved = computed((): StatTrend => {
    if (this.trend) return this.trend as StatTrend;
    if (this.change === null || this.change === 0) return 'neutral';
    return this.change > 0 ? 'up' : 'down';
  });

  protected readonly trendIcon = computed(() => {
    switch (this.trendResolved()) {
      case 'up':   return '↑';
      case 'down': return '↓';
      default:     return '→';
    }
  });
}
