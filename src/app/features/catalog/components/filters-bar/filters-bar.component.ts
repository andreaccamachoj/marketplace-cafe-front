import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { SortBy } from '../../models/product.model';
import { ICategory } from '../../models/category.model';
import { ICertification } from '../../services/certification.service';

const CERT_CSS: Record<string, string> = {
  ORGANIC:    'cert-chip-org',
  FAIRTRADE:  'cert-chip-fair',
  RAINFOREST: 'cert-chip-rain',
};

const CERT_ICON: Record<string, string> = {
  ORGANIC:    '🌿',
  FAIRTRADE:  '⚖️',
  RAINFOREST: '🌊',
};

@Component({
  selector: 'app-filters-bar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-bar" role="region" aria-label="Filtros del catálogo" id="catalog">
      <div class="filters-inner">
        <span class="filter-label" aria-hidden="true">Filtrar por</span>

        <!-- Categorías reales desde BD -->
        <div class="cat-chips" role="group" aria-label="Categorías de producto">
          <button
            class="chip"
            [class.active]="!selectedCategory"
            [attr.aria-pressed]="!selectedCategory"
            (click)="onCatClick(null)"
          >Todos</button>
          @for (cat of categories; track cat.id) {
            <button
              class="chip"
              [class.active]="selectedCategory === cat.name"
              [attr.aria-pressed]="selectedCategory === cat.name"
              (click)="onCatClick(cat.name)"
            >{{ cat.name }}</button>
          }
        </div>

        <div class="filter-sep" aria-hidden="true"></div>

        <!-- Certificaciones reales desde BD -->
        @if (certifications.length) {
          <div class="cert-chips" role="group" aria-label="Filtrar por certificación">
            @for (cert of certifications; track cert.code) {
              <button
                class="cert-chip"
                [ngClass]="certCss(cert.code)"
                [class.active]="selectedCerts.includes(cert.code)"
                [attr.aria-pressed]="selectedCerts.includes(cert.code)"
                (click)="onCertClick(cert.code)"
              >{{ certIcon(cert.code) }} {{ cert.name }}</button>
            }
          </div>
          <div class="filter-sep" aria-hidden="true"></div>
        }

        <!-- Presentaciones derivadas de los productos -->
        @if (presentations.length) {
          <div class="cat-chips" role="group" aria-label="Filtrar por presentación">
            <button
              class="chip"
              [class.active]="!selectedPresentation"
              [attr.aria-pressed]="!selectedPresentation"
              (click)="onPresentationClick(null)"
            >Todas</button>
            @for (pres of presentations; track pres) {
              <button
                class="chip"
                [class.active]="selectedPresentation === pres"
                [attr.aria-pressed]="selectedPresentation === pres"
                (click)="onPresentationClick(pres)"
              >{{ pres }}</button>
            }
          </div>
          <div class="filter-sep" aria-hidden="true"></div>
        }

        <!-- Sort + contador -->
        <div class="sort-wrap">
          <span class="results-count" aria-live="polite">
            {{ resultCount }} producto{{ resultCount !== 1 ? 's' : '' }}
          </span>
          <label for="sortSelect" class="sr-only">Ordenar por</label>
          <select
            class="sort-select"
            id="sortSelect"
            aria-label="Ordenar productos"
            (change)="onSortChange($event)"
          >
            @for (opt of sortOptions; track opt.value) {
              <option [value]="opt.value" [selected]="opt.value === sortBy">{{ opt.label }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  @Input() categories:          ICategory[]      = [];
  @Input() certifications:      ICertification[] = [];
  @Input() presentations:       string[]         = [];
  @Input() selectedCategory:    string | null    = null;
  @Input() selectedCerts:       string[]         = [];
  @Input() selectedPresentation: string | null   = null;
  @Input() sortBy:              SortBy           = 'relevance';
  @Input() resultCount = 0;

  @Output() categoryChange     = new EventEmitter<string | null>();
  @Output() certChange         = new EventEmitter<string[]>();
  @Output() presentationChange = new EventEmitter<string | null>();
  @Output() sortChange         = new EventEmitter<SortBy>();

  protected readonly sortOptions = [
    { value: 'relevance',  label: 'Destacados'             },
    { value: 'price-asc',  label: 'Precio: menor a mayor'  },
    { value: 'price-desc', label: 'Precio: mayor a menor'  },
    { value: 'rating',     label: 'Mejor valorados'        },
    { value: 'newest',     label: 'Más recientes'          },
  ];

  protected certCss(code: string): string  { return CERT_CSS[code]  ?? 'cert-chip-org'; }
  protected certIcon(code: string): string { return CERT_ICON[code] ?? '🏅'; }

  protected onCatClick(name: string | null): void {
    this.categoryChange.emit(name);
  }

  protected onCertClick(code: string): void {
    const updated = this.selectedCerts.includes(code)
      ? this.selectedCerts.filter(c => c !== code)
      : [...this.selectedCerts, code];
    this.certChange.emit(updated);
  }

  protected onPresentationClick(pres: string | null): void {
    this.presentationChange.emit(pres);
  }

  protected onSortChange(event: Event): void {
    this.sortChange.emit((event.target as HTMLSelectElement).value as SortBy);
  }
}
