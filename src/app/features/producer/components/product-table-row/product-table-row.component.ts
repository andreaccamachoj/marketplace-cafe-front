import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import {
  IManagedProduct,
  ManagedProductStatus,
} from '../../models/managed-product.model';

@Component({
  selector: 'app-product-table-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, NgClass],
  templateUrl: './product-table-row.component.html',
  styleUrl: './product-table-row.component.scss',
})
export class ProductTableRowComponent {
  readonly product = input.required<IManagedProduct>();

  readonly toggleStatus = output<string>();
  readonly edit = output<string>();
  readonly remove = output<string>();

  protected readonly statusLabel = computed(() => {
    const map: Record<ManagedProductStatus, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      draft: 'Borrador',
    };
    return map[this.product().status];
  });

  protected readonly statusClass = computed(() => {
    const map: Record<ManagedProductStatus, string> = {
      active: 'sp-active',
      inactive: 'sp-inactive',
      draft: 'sp-draft',
    };
    return map[this.product().status];
  });

  protected readonly stockClass = computed(() => {
    const stock = this.product().stock;
    if (stock === 0) return 'stock-crit';
    if (stock < 10) return 'stock-warn';
    return '';
  });

  protected readonly stockUnit = computed(() => {
    const stock = this.product().stock;
    if (stock === 0) return 'Agotado';
    if (stock < 10) return 'Stock crítico';
    return this.product().unit;
  });

  protected readonly starsHtml = computed(() => {
    const r = this.product().rating;
    if (!r) return '';
    const full = Math.floor(r);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  });

  protected onToggle(): void {
    this.toggleStatus.emit(this.product().id);
  }

  protected onEdit(): void {
    this.edit.emit(this.product().id);
  }

  protected onRemove(): void {
    this.remove.emit(this.product().id);
  }

  protected hasOrganico(): boolean {
    return this.product().certifications.includes('organico');
  }

  protected hasFairtrade(): boolean {
    return this.product().certifications.includes('fairtrade');
  }

  protected hasRainforest(): boolean {
    return this.product().certifications.includes('rainforest');
  }
}
