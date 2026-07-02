import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DragDropDirective } from '../../directives/drag-drop.directive';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [NgClass, DragDropDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadZoneComponent),
      multi: true,
    },
  ],
  template: `
    <div class="upload-zone-wrap">
      <!-- Drop area -->
      <div
        class="drop-zone"
        [ngClass]="{
          'drop-zone--dragover': isDragOver(),
          'drop-zone--error':   hasError,
          'drop-zone--disabled': isDisabled()
        }"
        role="button"
        tabindex="0"
        aria-label="Zona de carga. Haz clic o arrastra imágenes."
        appDragDrop
        (fileDropped)="onDrop($event)"
        (dragOverChange)="isDragOver.set($event)"
        (click)="fileInput.click()"
        (keydown.enter)="fileInput.click()"
        (keydown.space)="fileInput.click()"
      >
        <input
          #fileInput
          type="file"
          multiple
          [accept]="acceptAttr"
          class="drop-zone__hidden-input"
          aria-hidden="true"
          tabindex="-1"
          (change)="onFileSelected($event)"
        />

        <div class="drop-zone__content" aria-hidden="true">
          <span class="drop-zone__icon">📷</span>
          <p class="drop-zone__text">Haz clic o arrastra tus imágenes aquí</p>
          <small class="drop-zone__hint">
            JPG, PNG, WebP · máx. {{ maxSizeMb }} MB por imagen
            @if (minFiles > 0) { · mín. {{ minFiles }} archivo{{ minFiles > 1 ? 's' : '' }} }
          </small>
        </div>
      </div>

      <!-- Validation errors -->
      @if (validationError()) {
        <p class="upload-error" role="alert">{{ validationError() }}</p>
      }

      <!-- Preview grid -->
      @if (files().length > 0) {
        <div class="preview-grid" aria-label="Previsualización de imágenes">
          @for (preview of previews(); track preview.name) {
            <div class="preview-item">
              <img [src]="preview.url" [alt]="preview.name" class="preview-item__img" loading="lazy" />
              @if (!isDisabled()) {
                <button
                  type="button"
                  class="preview-item__remove"
                  [attr.aria-label]="'Eliminar ' + preview.name"
                  (click)="removeFile(preview.name)"
                >×</button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './upload-zone.component.scss',
})
export class UploadZoneComponent implements ControlValueAccessor {
  @Input() maxSizeMb = MAX_SIZE_MB;
  @Input() minFiles = 0;
  @Input() hasError = false;

  @Output() filesChange = new EventEmitter<File[]>();

  protected readonly files = signal<File[]>([]);
  protected readonly isDragOver = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly validationError = signal('');

  protected readonly previews = computed(() =>
    this.files().map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
  );

  protected readonly acceptAttr = ACCEPTED_TYPES.join(',');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (v: File[]) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  writeValue(val: File[]): void { this.files.set(val ?? []); }
  registerOnChange(fn: (v: File[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  protected onDrop(fileList: FileList): void {
    this.addFiles(Array.from(fileList));
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
  }

  protected removeFile(name: string): void {
    this.update(this.files().filter(f => f.name !== name));
  }

  private addFiles(newFiles: File[]): void {
    this.validationError.set('');
    const valid: File[] = [];
    for (const f of newFiles) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        this.validationError.set('Solo se permiten imágenes JPG, PNG o WebP.');
        continue;
      }
      if (f.size > this.maxSizeMb * 1024 * 1024) {
        this.validationError.set(`El archivo "${f.name}" supera el tamaño máximo de ${this.maxSizeMb} MB.`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length) this.update([...this.files(), ...valid]);
    this.onTouched();
  }

  private update(files: File[]): void {
    this.files.set(files);
    this.onChange(files);
    this.filesChange.emit(files);
  }
}
