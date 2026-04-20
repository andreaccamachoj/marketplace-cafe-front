import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [NgClass, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="textarea-wrapper" [ngClass]="{ 'textarea-wrapper--error': showError }">
      <textarea
        class="textarea-field"
        [attr.id]="textareaId"
        [attr.rows]="rows"
        [attr.maxlength]="maxLength ?? null"
        [placeholder]="placeholder"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabel"
        [attr.aria-invalid]="showError || null"
        [(ngModel)]="innerValue"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      ></textarea>
      @if (maxLength) {
        <span class="textarea-counter" [ngClass]="{ 'textarea-counter--warn': charCount() >= maxLength * 0.9 }">
          {{ charCount() }}/{{ maxLength }}
        </span>
      }
    </div>
  `,
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() textareaId = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() maxLength: number | null = null;
  @Input() ariaLabel = '';
  @Input() showError = false;

  protected innerValue = '';
  protected readonly isDisabled = signal(false);
  protected readonly charCount = computed(() => this.innerValue.length);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  writeValue(value: string): void { this.innerValue = value ?? ''; }
  registerOnChange(fn: (val: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled.set(isDisabled); }
}
