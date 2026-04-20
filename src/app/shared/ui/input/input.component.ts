import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NgClass } from '@angular/common';

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgClass, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [ngClass]="{ 'input-wrapper--error': showError, 'input-wrapper--disabled': isDisabled() }">
      @if (prefixIcon) {
        <span class="input-prefix" aria-hidden="true">{{ prefixIcon }}</span>
      }

      <input
        class="input-field"
        [ngClass]="{ 'input-field--has-prefix': prefixIcon, 'input-field--has-suffix': type === 'password' || suffixIcon }"
        [type]="resolvedType()"
        [placeholder]="placeholder"
        [disabled]="isDisabled()"
        [attr.id]="inputId"
        [attr.aria-label]="ariaLabel"
        [attr.aria-describedby]="ariaDescribedBy"
        [attr.aria-invalid]="showError || null"
        [attr.autocomplete]="autocomplete"
        [(ngModel)]="innerValue"
        (ngModelChange)="onChange($event)"
        (blur)="onBlur()"
      />

      @if (type === 'password') {
        <button
          type="button"
          class="input-suffix input-suffix--btn"
          [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          (click)="togglePassword()"
        >
          {{ showPassword() ? '🙈' : '👁' }}
        </button>
      } @else if (suffixIcon) {
        <span class="input-suffix" aria-hidden="true">{{ suffixIcon }}</span>
      }
    </div>
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() inputId = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() prefixIcon = '';
  @Input() suffixIcon = '';
  @Input() ariaLabel = '';
  @Input() ariaDescribedBy = '';
  @Input() autocomplete = 'off';
  @Input() showError = false;

  protected innerValue = '';
  protected readonly isDisabled = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly isTouched = signal(false);

  protected resolvedType(): string {
    if (this.type === 'password') return this.showPassword() ? 'text' : 'password';
    return this.type;
  }

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  // ControlValueAccessor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.innerValue = value ?? '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}
