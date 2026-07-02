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

export interface ISelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgClass, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="select-wrapper" [ngClass]="{ 'select-wrapper--error': showError, 'select-wrapper--disabled': isDisabled() }">
      <select
        class="select-field"
        [attr.id]="selectId"
        [attr.aria-label]="ariaLabel"
        [attr.aria-invalid]="showError || null"
        [disabled]="isDisabled()"
        [(ngModel)]="innerValue"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      >
        @if (placeholder) {
          <option value="" disabled [selected]="!innerValue">{{ placeholder }}</option>
        }
        @for (opt of options; track opt.value) {
          <option [value]="opt.value" [disabled]="opt.disabled ?? false">{{ opt.label }}</option>
        }
      </select>
      <span class="select-arrow" aria-hidden="true">▾</span>
    </div>
  `,
  styleUrl: './select.component.scss',
})
export class SelectComponent implements ControlValueAccessor {
  @Input() selectId = '';
  @Input() options: ISelectOption[] = [];
  @Input() placeholder = '';
  @Input() ariaLabel = '';
  @Input() showError = false;

  protected innerValue: string | number = '';
  protected readonly isDisabled = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (val: string | number) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  writeValue(value: string | number): void { this.innerValue = value ?? ''; }
  registerOnChange(fn: (val: string | number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled.set(isDisabled); }
}
