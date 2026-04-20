import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Dumb button component — wraps a native <button> with design-system styling.
 * Use [type]="'submit'" for form submission to avoid the default "submit" behaviour
 * when you don't intend it.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class]="btnClasses"
      [type]="type"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading || null"
      [attr.aria-disabled]="disabled || loading || null"
    >
      @if (loading) {
        <span class="btn__spinner" aria-hidden="true"></span>
      }
      @if (iconLeft && !loading) {
        <span class="btn__icon btn__icon--left" aria-hidden="true">{{ iconLeft }}</span>
      }
      <ng-content />
      @if (iconRight && !loading) {
        <span class="btn__icon btn__icon--right" aria-hidden="true">{{ iconRight }}</span>
      }
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Input() iconLeft = '';
  @Input() iconRight = '';

  get btnClasses(): string {
    return [
      `btn--${this.variant}`,
      `btn--${this.size}`,
      this.block ? 'btn--block' : '',
      this.loading ? 'btn--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
