import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  template: `
    <label class="toggle" [class.toggle--disabled]="isDisabled()">
      <input
        type="checkbox"
        class="toggle__input"
        [checked]="checked()"
        [disabled]="isDisabled()"
        [attr.aria-label]="label || null"
        (change)="onToggle($event)"
      />
      <span class="toggle__track" aria-hidden="true">
        <span class="toggle__thumb"></span>
      </span>
      @if (label) {
        <span class="toggle__label">{{ label }}</span>
      }
    </label>
  `,
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label = '';

  protected readonly checked = signal(false);
  protected readonly isDisabled = signal(false);

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: boolean): void { this.checked.set(!!val); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  protected onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.onChange(checked);
    this.onTouched();
  }
}
