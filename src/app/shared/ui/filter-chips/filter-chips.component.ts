import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  computed,
} from '@angular/core';
import { NgClass } from '@angular/common';

export interface IFilterChip {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="filter-chips"
      role="group"
      [attr.aria-label]="groupLabel || 'Filtros'"
    >
      @for (chip of chips; track chip.id) {
        <button
          type="button"
          class="chip"
          [ngClass]="{ 'chip--active': isSelected(chip.id) }"
          [attr.aria-pressed]="isSelected(chip.id)"
          (click)="toggle(chip.id)"
        >
          @if (chip.icon) {
            <span class="chip__icon" aria-hidden="true">{{ chip.icon }}</span>
          }
          {{ chip.label }}
          @if (isSelected(chip.id) && removable) {
            <span class="chip__remove" aria-hidden="true">×</span>
          }
        </button>
      }

      @if (hasSelection()) {
        <button
          type="button"
          class="chip chip--clear"
          aria-label="Limpiar filtros"
          (click)="clearAll()"
        >
          Limpiar
        </button>
      }
    </div>
  `,
  styleUrl: './filter-chips.component.scss',
})
export class FilterChipsComponent {
  @Input() chips: IFilterChip[] = [];
  @Input() groupLabel = '';
  /** Allow selecting multiple chips at once */
  @Input() multi = true;
  /** Show × icon to remove active chip */
  @Input() removable = true;
  /** Pre-selected chip ids */
  @Input() set selected(ids: string[]) {
    this._selected.set(new Set(ids));
  }

  @Output() selectionChange = new EventEmitter<string[]>();

  protected readonly _selected = signal<Set<string>>(new Set());
  protected readonly hasSelection = computed(() => this._selected().size > 0);

  protected isSelected(id: string): boolean {
    return this._selected().has(id);
  }

  protected toggle(id: string): void {
    const current = new Set(this._selected());
    if (current.has(id)) {
      current.delete(id);
    } else {
      if (!this.multi) current.clear();
      current.add(id);
    }
    this._selected.set(current);
    this.selectionChange.emit([...current]);
  }

  protected clearAll(): void {
    this._selected.set(new Set());
    this.selectionChange.emit([]);
  }
}
