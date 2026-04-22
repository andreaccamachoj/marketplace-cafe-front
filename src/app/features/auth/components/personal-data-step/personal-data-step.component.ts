import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPersonalData } from '../../services/register-flow.state';
import { emailValidator } from '@shared/utils/validators/email.validator';
import { passwordStrengthValidator, evaluatePasswordStrength } from '@shared/utils/validators/password.validator';
import { matchFieldValidator } from '@shared/utils/validators/match-field.validator';

@Component({
  selector: 'app-personal-data-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="personal-form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

      <!-- Nombre + Apellido -->
      <div class="personal-form__row">
        <div class="field">
          <label class="field__label" for="reg-first-name">
            Nombre <span class="field__req" aria-hidden="true">*</span>
          </label>
          <input
            id="reg-first-name"
            type="text"
            class="field__input"
            [class.field__input--error]="isInvalid('firstName')"
            formControlName="firstName"
            placeholder="Tu nombre"
            autocomplete="given-name"
            [attr.aria-invalid]="isInvalid('firstName')"
            aria-required="true"
          />
          @if (isInvalid('firstName')) {
            <span class="field__error" role="alert">El nombre es requerido</span>
          }
        </div>

        <div class="field">
          <label class="field__label" for="reg-last-name">
            Apellido <span class="field__req" aria-hidden="true">*</span>
          </label>
          <input
            id="reg-last-name"
            type="text"
            class="field__input"
            [class.field__input--error]="isInvalid('lastName')"
            formControlName="lastName"
            placeholder="Tu apellido"
            autocomplete="family-name"
            [attr.aria-invalid]="isInvalid('lastName')"
            aria-required="true"
          />
          @if (isInvalid('lastName')) {
            <span class="field__error" role="alert">El apellido es requerido</span>
          }
        </div>
      </div>

      <!-- Email -->
      <div class="field">
        <label class="field__label" for="reg-email">
          Correo electrónico <span class="field__req" aria-hidden="true">*</span>
        </label>
        <input
          id="reg-email"
          type="email"
          class="field__input"
          [class.field__input--error]="isInvalid('email')"
          formControlName="email"
          placeholder="tu@correo.com"
          autocomplete="email"
          [attr.aria-invalid]="isInvalid('email')"
          aria-required="true"
        />
        @if (isInvalid('email')) {
          <span class="field__error" role="alert">{{ emailError() }}</span>
        }
      </div>

      <!-- Teléfono -->
      <div class="field">
        <label class="field__label" for="reg-phone">
          Teléfono
          <span class="field__hint">(opcional)</span>
        </label>
        <input
          id="reg-phone"
          type="tel"
          class="field__input"
          formControlName="phone"
          placeholder="3001112233"
          autocomplete="tel"
        />
      </div>

      <!-- Contraseña -->
      <div class="field">
        <label class="field__label" for="reg-password">
          Contraseña <span class="field__req" aria-hidden="true">*</span>
        </label>
        <div class="field__input-wrap">
          <input
            id="reg-password"
            [type]="showPassword() ? 'text' : 'password'"
            class="field__input"
            [class.field__input--error]="isInvalid('password')"
            formControlName="password"
            placeholder="Mín. 8 caracteres"
            autocomplete="new-password"
            [attr.aria-invalid]="isInvalid('password')"
            aria-required="true"
          />
          <button
            type="button"
            class="field__toggle-visibility"
            (click)="showPassword.set(!showPassword())"
            [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            @if (showPassword()) {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            }
          </button>
        </div>

        @if (passwordValue()) {
          <div class="password-strength" role="status"
            [attr.aria-label]="'Fortaleza de contraseña: ' + passwordStrength().label">
            <div class="password-strength__bars" aria-hidden="true">
              @for (bar of [1, 2, 3, 4]; track bar) {
                <div
                  class="password-strength__bar"
                  [class]="passwordStrength().score >= bar ? 'password-strength__bar password-strength__bar--' + passwordStrength().score : 'password-strength__bar'"
                ></div>
              }
            </div>
            <span class="password-strength__label">{{ passwordStrength().label }}</span>
          </div>
        }
        @if (isInvalid('password')) {
          <span class="field__error" role="alert">{{ passwordError() }}</span>
        }
      </div>

      <!-- Confirmar contraseña -->
      <div class="field">
        <label class="field__label" for="reg-confirm">
          Confirmar contraseña <span class="field__req" aria-hidden="true">*</span>
        </label>
        <div class="field__input-wrap">
          <input
            id="reg-confirm"
            [type]="showPassword() ? 'text' : 'password'"
            class="field__input"
            [class.field__input--error]="isInvalid('confirmPassword')"
            formControlName="confirmPassword"
            placeholder="Repite tu contraseña"
            autocomplete="new-password"
            [attr.aria-invalid]="isInvalid('confirmPassword')"
            aria-required="true"
          />
        </div>
        @if (isInvalid('confirmPassword')) {
          <span class="field__error" role="alert">Las contraseñas no coinciden</span>
        }
      </div>

      <!-- Términos -->
      <div class="field field--checkbox">
        <label class="checkbox-label">
          <input type="checkbox" formControlName="acceptTerms" />
          <span class="checkbox-label__box"></span>
          <span class="checkbox-label__text">
            Acepto los
            <a href="#" class="checkbox-label__link">términos y condiciones</a>
            y la
            <a href="#" class="checkbox-label__link">política de privacidad</a>
          </span>
        </label>
        @if (isInvalid('acceptTerms')) {
          <span class="field__error" role="alert">Debes aceptar los términos para continuar</span>
        }
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn-submit"
        [disabled]="form.invalid"
      >
        <span>Continuar</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

    </form>
  `,
  styleUrl: './personal-data-step.component.scss',
})
export class PersonalDataStepComponent {
  @Output() submitted = new EventEmitter<IPersonalData>();

  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.group(
    {
      firstName:       this.fb.control('', [Validators.required]),
      lastName:        this.fb.control('', [Validators.required]),
      email:           this.fb.control('', [Validators.required, emailValidator]),
      phone:           this.fb.control(''),
      password:        this.fb.control('', [Validators.required, passwordStrengthValidator]),
      confirmPassword: this.fb.control('', [Validators.required]),
      acceptTerms:     this.fb.control(false, [Validators.requiredTrue]),
    },
    { validators: matchFieldValidator('password', 'confirmPassword') }
  );

  protected passwordValue(): string { return this.form.controls.password.value; }

  protected passwordStrength() {
    return evaluatePasswordStrength(this.passwordValue());
  }

  protected isInvalid(field: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.dirty || c.touched);
  }

  protected emailError(): string {
    const errors = this.form.controls.email.errors;
    if (errors?.['required'])     return 'El correo es requerido';
    if (errors?.['invalidEmail']) return 'Ingresa un correo válido';
    return '';
  }

  protected passwordError(): string {
    const errors = this.form.controls.password.errors;
    if (errors?.['required'])    return 'La contraseña es requerida';
    if (errors?.['weakPassword']) return 'La contraseña es demasiado débil (mín. 8 chars, mayúscula, número)';
    return '';
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { firstName, lastName, email, phone, password, acceptTerms } = this.form.getRawValue();
    this.submitted.emit({ firstName, lastName, email, phone, password, acceptTerms });
  }
}
