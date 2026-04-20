import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortBy } from '../../models/product.model';

interface CatChip { value: string; label: string; }
interface CertChip { id: string; label: string; cssClass: string; }

@Component({
  selector: 'app-filters-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-bar" role="region" aria-label="Filtros del catálogo" id="catalog">
      <div class="filters-inner">
        <span class="filter-label" aria-hidden="true">Filtrar por</span>

        <!-- Categorías — chips tipo pill -->
        <div class="cat-chips" role="group" aria-label="Categorías de producto">
          @for (cat of catChips; track cat.value) {
            <button
              class="chip"
              [class.active]="(selectedCategory ?? 'todos') === cat.value"
              [attr.aria-pressed]="(selectedCategory ?? 'todos') === cat.value"
              (click)="onCatClick(cat.value)"
            >{{ cat.label }}</button>
          }
        </div>

        <div class="filter-sep" aria-hidden="true"></div>

        <!-- Certificaciones — chips coloreados -->
        <div class="cert-chips" role="group" aria-label="Filtrar por certificación">
          @for (cert of certChips; track cert.id) {
            <button
              class="cert-chip"
              [ngClass]="cert.cssClass"
              [class.active]="selectedCerts.includes(cert.id)"
              [attr.aria-pressed]="selectedCerts.includes(cert.id)"
              (click)="onCertClick(cert.id)"
            >{{ cert.label }}</button>
          }
        </div>

        <!-- Sort + contador -->
        <div class="sort-wrap">
          <span class="results-count" aria-live="polite">
            {{ resultCount }} producto{{ resultCount !== 1 ? 's' : '' }}
          </span>
          <label for="sortSelect" class="sr-only">Ordenar por</label>
          <select
            class="sort-select"
            id="sortSelect"
            [value]="sortBy"
            (change)="onSortChange($event)"
            aria-label="Ordenar productos"
          >
            @for (opt of sortOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  @Input() selectedCategory: string | null = null;
  @Input() selectedCerts: string[] = [];
  @Input() sortBy: SortBy = 'relevance';
  @Input() resultCount = 0;
  @Output() categoryChange = new EventEmitter<string | null>();
  @Output() certChange     = new EventEmitter<string[]>();
  @Output() sortChange     = new EventEmitter<SortBy>();

  protected readonly catChips: CatChip[] = [
    { value: 'todos',        label: 'Todos' },
    { value: 'grano',        label: 'Grano entero' },
    { value: 'molido',       label: 'Molido' },
    { value: 'medio',        label: 'Tostado medio' },
    { value: 'oscuro',       label: 'Tostado oscuro' },
    { value: 'descafeinado', label: 'Descafeinado' },
  ];

  protected readonly certChips: CertChip[] = [
    { id: 'ORGANIC',    label: '🌿 Orgánico',   cssClass: 'cert-chip-org'  },
    { id: 'FAIRTRADE',  label: '⚖️ Fairtrade',  cssClass: 'cert-chip-fair' },
    { id: 'RAINFOREST', label: '🌊 Rainforest', cssClass: 'cert-chip-rain' },
  ];

  protected readonly sortOptions = [
    { value: 'relevance',  label: 'Destacados' },
    { value: 'price-asc',  label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' },
    { value: 'rating',     label: 'Mejor valorados' },
    { value: 'newest',     label: 'Más recientes' },
  ];

  protected onCatClick(value: string): void {
    this.categoryChange.emit(value === 'todos' ? null : value);
  }

  protected onCertClick(certId: string): void {
    const updated = this.selectedCerts.includes(certId)
      ? this.selectedCerts.filter(c => c !== certId)
      : [...this.selectedCerts, certId];
    this.certChange.emit(updated);
  }

  protected onSortChange(event: Event): void {
    this.sortChange.emit((event.target as HTMLSelectElement).value as SortBy);
  }
}
