import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import {
  evaluatePasswordStrength,
  IPasswordStrength,
} from '../../utils/validators/password.validator';

@Component({
  selector: 'app-password-strength-meter',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="psm" aria-live="polite" role="status">
      <!-- 4 bars -->
      <div class="psm__bars" aria-hidden="true">
        @for (bar of bars; track bar) {
          <div
            class="psm__bar"
            [ngClass]="'psm__bar--' + barClass()"
            [class.psm__bar--active]="bar <= strength().score"
          ></div>
        }
      </div>

      <!-- Label -->
      <span class="psm__label" [ngClass]="'psm__label--' + barClass()">
        {{ strength().label }}
      </span>

      <!-- Requirements checklist (screen readers + optional visual) -->
      <ul class="psm__checks" aria-label="Requisitos de contraseña">
        <li [class.psm__check--ok]="strength().hasMinLength">
          {{ strength().hasMinLength ? '✓' : '○' }} Mínimo 8 caracteres
        </li>
        <li [class.psm__check--ok]="strength().hasUpperCase">
          {{ strength().hasUpperCase ? '✓' : '○' }} Al menos una mayúscula
        </li>
        <li [class.psm__check--ok]="strength().hasNumber">
          {{ strength().hasNumber ? '✓' : '○' }} Al menos un número
        </li>
        <li [class.psm__check--ok]="strength().hasSpecial">
          {{ strength().hasSpecial ? '✓' : '○' }} Al menos un carácter especial
        </li>
      </ul>
    </div>
  `,
  styleUrl: './password-strength-meter.component.scss',
})
export class PasswordStrengthMeterComponent {
  @Input() set password(val: string) {
    this.strength.set(evaluatePasswordStrength(val ?? ''));
  }

  protected readonly strength = signal<IPasswordStrength>({
    score: 0,
    label: 'Muy débil',
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  protected readonly bars = [1, 2, 3, 4];

  protected barClass(): string {
    const score = this.strength().score;
    if (score <= 1) return 'weak';
    if (score === 2) return 'fair';
    if (score === 3) return 'good';
    return 'strong';
  }
}
