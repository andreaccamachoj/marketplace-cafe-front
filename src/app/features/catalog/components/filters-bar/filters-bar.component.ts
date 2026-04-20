import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortBy } from '../../models/product.model';

@Component({
  selector: 'app-filters-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-bar">
      <div class="filters-bar__section">
        <h3 class="filters-bar__title">Categoría</h3>
        <select class="filters-bar__select" [value]="selectedCategory || ''" (change)="onCategoryChange($event)">
          <option value="">Todas</option>
          <option value="Café de Origen">Café de Origen</option>
          <option value="Blend">Blend</option>
        </select>
      </div>

      <div class="filters-bar__section">
        <h3 class="filters-bar__title">Certificaciones</h3>
        <div class="filters-bar__checkboxes">
          @for (cert of certOptions; track cert) {
            <label class="filters-bar__checkbox">
              <input
                type="checkbox"
                [checked]="selectedCerts.includes(cert.id)"
                (change)="onCertToggle(cert.id)"
              />
              {{ cert.label }}
            </label>
          }
        </div>
      </div>

      <div class="filters-bar__section">
        <h3 class="filters-bar__title">Ordenar por</h3>
        <select class="filters-bar__select" [value]="sortBy" (change)="onSortChange($event)">
          @for (option of sortOptions; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>

      @if (resultCount > 0) {
        <div class="filters-bar__results">
          {{ resultCount }} producto{{ resultCount !== 1 ? 's' : '' }}
        </div>
      }
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
  @Output() certChange = new EventEmitter<string[]>();
  @Output() sortChange = new EventEmitter<SortBy>();

  protected readonly certOptions = [
    { id: 'ORGANIC', label: 'Orgánico' },
    { id: 'FAIRTRADE', label: 'Comercio Justo' },
    { id: 'RAINFOREST', label: 'Rainforest' },
  ];

  protected readonly sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-asc', label: 'Precio (menor a mayor)' },
    { value: 'price-desc', label: 'Precio (mayor a menor)' },
    { value: 'rating', label: 'Mejor calificados' },
    { value: 'newest', label: 'Más nuevos' },
  ];

  protected onCategoryChange(event: any): void {
    this.categoryChange.emit(event.target.value || null);
  }

  protected onCertToggle(certId: string): void {
    const updated = this.selectedCerts.includes(certId)
      ? this.selectedCerts.filter(c => c !== certId)
      : [...this.selectedCerts, certId];
    this.certChange.emit(updated);
  }

  protected onSortChange(event: any): void {
    this.sortChange.emit(event.target.value);
  }
}
