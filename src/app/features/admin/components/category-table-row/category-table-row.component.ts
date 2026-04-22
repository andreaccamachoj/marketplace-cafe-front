import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IAdminCategory } from '../../models/admin-category.model';

@Component({
  selector: '[app-category-table-row]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td class="td-name">
      <div class="cell-cat-group">
        <span class="cell-emoji">{{ category().iconEmoji }}</span>
        <div>
          <p class="cell-primary">{{ category().name }}</p>
          <p class="cell-slug">{{ category().slug }}</p>
        </div>
      </div>
    </td>
    <td class="td-desc">
      <p class="cell-desc-truncated">{{ category().description }}</p>
    </td>
    <td class="td-count">{{ category().productCount }}</td>
    <td class="td-status">
      <button
        class="toggle-btn"
        [class.toggle-btn--active]="category().active"
        type="button"
        (click)="toggleActive.emit(category().id)"
      >
        {{ category().active ? 'Activa' : 'Inactiva' }}
      </button>
    </td>
    <td class="td-actions">
      <div class="row-actions">
        <button class="btn-sm btn-ghost" type="button" (click)="edit.emit(category())">
          Editar
        </button>
        <button class="btn-sm btn-danger" type="button" (click)="delete.emit(category().id)">
          Eliminar
        </button>
      </div>
    </td>
  `,
  styleUrl: './category-table-row.component.scss',
})
export class CategoryTableRowComponent {
  readonly category = input.required<IAdminCategory>();

  readonly edit = output<IAdminCategory>();
  readonly toggleActive = output<string>();
  readonly delete = output<string>();
}
