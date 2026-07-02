import { ChangeDetectionStrategy, Component, Input, computed } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stock-indicator',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stock" [ngClass]="'stock--' + level()">
      <div class="stock__bar" role="progressbar"
           [attr.aria-valuenow]="pct()" aria-valuemin="0" aria-valuemax="100"
           [attr.aria-label]="'Stock: ' + label()">
        <div class="stock__fill" [style.width.%]="pct()"></div>
      </div>
      <span class="stock__label">{{ label() }}</span>
    </div>
  `,
  styleUrl: './stock-indicator.component.scss',
})
export class StockIndicatorComponent {
  @Input() stock = 0;
  @Input() maxStock = 100;

  protected readonly pct = computed(() =>
    Math.min(100, Math.round((this.stock / Math.max(1, this.maxStock)) * 100))
  );

  protected readonly level = computed((): 'high' | 'medium' | 'low' | 'out' => {
    const p = this.pct();
    if (p === 0)   return 'out';
    if (p <= 20)   return 'low';
    if (p <= 50)   return 'medium';
    return 'high';
  });

  protected readonly label = computed(() => {
    switch (this.level()) {
      case 'high':   return 'Disponible';
      case 'medium': return 'Pocas unidades';
      case 'low':    return 'Últimas unidades';
      default:       return 'Agotado';
    }
  });
}
