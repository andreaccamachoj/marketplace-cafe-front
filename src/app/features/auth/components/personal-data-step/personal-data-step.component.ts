import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IPersonalData } from '../../services/register-flow.state';
import { emailValidator } from '@shared/utils/validators/email.validator';
import { passwordStrengthValidator, evaluatePasswordStrength } from '@shared/utils/validators/password.validator';
import { matchFieldValidator } from '@shared/utils/validators/match-field.validator';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-personal-data-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="personal-form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div class="personal-form__row">
        <div class="field">
          <label class="field__label" for="reg-first-name">Nombre</label>
          <input
            id="reg-first-name"
            type="text"
            class="field__input"
            [class.field__input--error]="isInvalid('firstName')"
            formControlName="firstName"
            placeholder="Tu nombre"
            aria-required="true"
          />
          @if (isInvalid('firstName')) {
            <span class="field__error" role="alert">El nombre es requerido</span>
          }
        </div>

        <div class="field">
          <label class="field__label" for="reg-last-name">Apellido</label>
          <input
            id="reg-last-name"
            type="text"
            class="field__input"
            [class.field__input--error]="isInvalid('lastName')"
            formControlName="lastName"
            placeholder="Tu apellido"
            aria-required="true"
          />
          @if (isInvalid('lastName')) {
            <span class="field__error" role="alert">El apellido es requerido</span>
          }
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="reg-email">Correo electrónico</label>
        <input
          id="reg-email"
          type="email"
          class="field__input"
          [class.field__input--error]="isInvalid('email')"
          formControlName="email"
          placeholder="tu@correo.com"
          aria-required="true"
        />
        @if (isInvalid('email')) {
          <span class="field__error" role="alert">{{ emailError() }}</span>
        }
      </div>

      <div class="field">
        <label class="field__label" for="reg-phone">Teléfono (opcional)</label>
        <input
          id="reg-phone"
          type="tel"
          class="field__input"
          formControlName="phone"
          placeholder="3001112233"
          autocomplete="tel"
        />
      </div>

      <div class="field">
        <label class="field__label" for="reg-password">Contraseña</label>
        <div class="field__input-wrap">
          <input
            id="reg-password"
            [type]="showPassword() ? 'text' : 'password'"
            class="field__input"
            [class.field__input--error]="isInvalid('password')"
            formControlName="password"
            placeholder="Mín. 8 caracteres"
            aria-required="true"
          />
          <button
            type="button"
            class="field__toggle-visibility"
            (click)="showPassword.set(!showPassword())"
            [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >{{ showPassword() ? '👁' : '👁‍🗨' }}</button>
        </div>
        @if (passwordValue()) {
          <div class="password-strength">
            <div class="password-strength__bar">
              <div
                class="password-strength__fill"
                [style.width.%]="passwordStrength().score * 25"
                [ngClass]="'password-strength__fill--' + passwordStrength().score"
              ></div>
            </div>
            <span class="password-strength__label">{{ passwordStrength().label }}</span>
          </div>
        }
        @if (isInvalid('password')) {
          <span class="field__error" role="alert">{{ passwordError() }}</span>
        }
      </div>

      <div class="field">
        <label class="field__label" for="reg-confirm">Confirmar contraseña</label>
        <input
          id="reg-confirm"
          [type]="showPassword() ? 'text' : 'password'"
          class="field__input"
          [class.field__input--error]="isInvalid('confirmPassword')"
          formControlName="confirmPassword"
          placeholder="Repite tu contraseña"
          aria-required="true"
        />
        @if (isInvalid('confirmPassword')) {
          <span class="field__error" role="alert">Las contraseñas no coinciden</span>
        }
      </div>

      <div class="field field--checkbox">
        <label class="checkbox-label">
          <input type="checkbox" formControlName="acceptTerms" />
          Acepto los
          <a href="#" class="checkbox-label__link">términos y condiciones</a>
        </label>
        @if (isInvalid('acceptTerms')) {
          <span class="field__error" role="alert">Debes aceptar los términos</span>
        }
      </div>

      <div class="personal-form__footer">
        <app-button type="submit" variant="primary" size="lg" [disabled]="form.invalid">
          Continuar
        </app-button>
      </div>
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
    if (errors?.['required']) return 'El correo es requerido';
    if (errors?.['invalidEmail']) return 'Ingresa un correo válido';
    return '';
  }

  protected passwordError(): string {
    const errors = this.form.controls.password.errors;
    if (errors?.['required']) return 'La contraseña es requerida';
    if (errors?.['weakPassword']) return 'La contraseña es demasiado débil';
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
