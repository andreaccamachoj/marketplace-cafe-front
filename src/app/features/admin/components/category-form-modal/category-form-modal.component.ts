import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { IAdminCategory } from '../../models/admin-category.model';

const EMOJI_OPTIONS = ['☕', '🌿', '⭐', '🔬', '🧊', '🌱', '🏔️'];

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [open]="open()"
      [title]="category() ? 'Editar categoría' : 'Nueva categoría'"
      size="md"
      (closed)="closed.emit()"
    >
      <form class="cat-form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label" for="cat-name">Nombre *</label>
          <input
            id="cat-name"
            class="form-input"
            type="text"
            placeholder="Nombre de la categoría"
            [(ngModel)]="name"
            name="catName"
            (input)="onNameChange()"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="cat-slug">Slug</label>
          <input
            id="cat-slug"
            class="form-input"
            type="text"
            placeholder="slug-auto-generado"
            [(ngModel)]="slug"
            name="catSlug"
          />
          <p class="form-hint">Auto-generado desde el nombre. Editable.</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="cat-desc">Descripción *</label>
          <textarea
            id="cat-desc"
            class="form-textarea"
            rows="3"
            placeholder="Descripción de la categoría"
            [(ngModel)]="description"
            name="catDesc"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Icono</label>
          <div class="emoji-grid">
            @for (emoji of emojiOptions; track emoji) {
              <button
                class="emoji-btn"
                [class.emoji-btn--selected]="iconEmoji === emoji"
                type="button"
                (click)="iconEmoji = emoji"
              >
                {{ emoji }}
              </button>
            }
          </div>
        </div>

        <div class="form-check">
          <input
            id="cat-active"
            type="checkbox"
            [(ngModel)]="active"
            name="catActive"
          />
          <label for="cat-active" class="check-label">Categoría activa</label>
        </div>
      </form>

      <div modal-footer class="cat-footer">
        <button class="btn-cancel" type="button" (click)="closed.emit()">Cancelar</button>
        <button
          class="btn-save"
          type="button"
          [disabled]="!name.trim() || !description.trim()"
          (click)="onSubmit()"
        >
          {{ category() ? 'Guardar cambios' : 'Crear categoría' }}
        </button>
      </div>
    </app-modal>
  `,
  styleUrl: './category-form-modal.component.scss',
})
export class CategoryFormModalComponent implements OnChanges {
  readonly category = input<IAdminCategory | null>(null);
  readonly open = input.required<boolean>();

  readonly closed = output<void>();
  readonly saved = output<Partial<IAdminCategory>>();

  protected readonly emojiOptions = EMOJI_OPTIONS;

  protected name = '';
  protected slug = '';
  protected description = '';
  protected iconEmoji = '☕';
  protected active = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['category']) {
      const cat = this.category();
      if (cat) {
        this.name = cat.name;
        this.slug = cat.slug;
        this.description = cat.description;
        this.iconEmoji = cat.iconEmoji;
        this.active = cat.active;
      } else {
        this.name = '';
        this.slug = '';
        this.description = '';
        this.iconEmoji = '☕';
        this.active = true;
      }
    }
  }

  onNameChange(): void {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  onSubmit(): void {
    if (!this.name.trim() || !this.description.trim()) return;
    this.saved.emit({
      name: this.name.trim(),
      slug: this.slug,
      description: this.description.trim(),
      iconEmoji: this.iconEmoji,
      active: this.active,
    });
  }
}
