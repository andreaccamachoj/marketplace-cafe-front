import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label
      class="checkbox"
      [ngClass]="{ 'checkbox--checked': checked(), 'checkbox--disabled': isDisabled() }"
      [attr.for]="checkboxId"
    >
      <input
        type="checkbox"
        class="checkbox__input sr-only"
        [id]="checkboxId"
        [checked]="checked()"
        [disabled]="isDisabled()"
        (change)="toggle()"
        (blur)="onTouched()"
      />
      <span class="checkbox__box" aria-hidden="true">
        @if (checked()) {
          <svg viewBox="0 0 12 10" fill="none">
            <path d="M1.5 5L4.5 8L10.5 2" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
      </span>
      <span class="checkbox__label"><ng-content /></span>
    </label>
  `,
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() checkboxId = '';

  protected readonly checked = signal(false);
  protected readonly isDisabled = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (val: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
  }

  writeValue(value: boolean): void { this.checked.set(!!value); }
  registerOnChange(fn: (val: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled.set(isDisabled); }
}
