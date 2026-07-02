import {
  Component, Input, Output, EventEmitter, OnInit, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { IRoastLevel } from '../../models/product.model';

@Component({
  selector: 'app-product-options',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Presentation chips -->
    @if (presentationTypes.length) {
      <div class="opts-section">
        <p class="opts-label">Presentación</p>
        <div class="chips" role="listbox" aria-label="Presentación">
          @for (pt of presentationTypes; track pt) {
            <button
              class="chip"
              [class.chip--active]="selectedPresentation() === pt"
              type="button"
              role="option"
              [attr.aria-selected]="selectedPresentation() === pt"
              (click)="selectPresentation(pt)"
            >{{ pt }}</button>
          }
        </div>
      </div>
    }

    <!-- Roast level cards -->
    @if (roastLevels.length) {
      <div class="opts-section">
        <p class="opts-label">Nivel de Tostado</p>
        <div class="roast-grid" role="listbox" aria-label="Nivel de tostado">
          @for (roast of roastLevels; track roast.id) {
            <button
              class="roast-card"
              [class.roast-card--active]="selectedRoast() === roast.id"
              type="button"
              role="option"
              [attr.aria-selected]="selectedRoast() === roast.id"
              (click)="selectRoast(roast.id)"
            >
              <span class="roast-card__icon" aria-hidden="true">{{ roast.icon }}</span>
              <span class="roast-card__name">{{ roast.name }}</span>
              <span class="roast-card__sub">{{ roast.sub }}</span>
            </button>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './product-options.component.scss',
})
export class ProductOptionsComponent implements OnInit {
  @Input() presentationTypes: string[] = [];
  @Input() roastLevels: IRoastLevel[] = [];

  @Output() presentationChange = new EventEmitter<string>();
  @Output() roastChange = new EventEmitter<string>();

  protected readonly selectedPresentation = signal('');
  protected readonly selectedRoast = signal('');

  ngOnInit(): void {
    if (this.presentationTypes.length) {
      this.selectedPresentation.set(this.presentationTypes[0]);
    }
    if (this.roastLevels.length) {
      this.selectedRoast.set(this.roastLevels[0].id);
    }
  }

  protected selectPresentation(pt: string): void {
    this.selectedPresentation.set(pt);
    this.presentationChange.emit(pt);
  }

  protected selectRoast(id: string): void {
    this.selectedRoast.set(id);
    this.roastChange.emit(id);
  }
}
