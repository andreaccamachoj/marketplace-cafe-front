import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ILoginCredentials } from '@core/auth/models/auth-response.model';
import { emailValidator } from '@shared/utils/validators/email.validator';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="login-form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <h2 class="login-form__title">Iniciar sesión</h2>
      <p class="login-form__subtitle">Accede a tu cuenta de World Coffee Marketplace</p>

      <div class="field">
        <label class="field__label" for="login-email">Correo electrónico</label>
        <input
          id="login-email"
          type="email"
          class="field__input"
          [class.field__input--error]="emailInvalid()"
          formControlName="email"
          autocomplete="email"
          placeholder="tu@correo.com"
          aria-required="true"
          [attr.aria-invalid]="emailInvalid()"
          aria-describedby="login-email-error"
        />
        @if (emailInvalid()) {
          <span id="login-email-error" class="field__error" role="alert">
            {{ emailError() }}
          </span>
        }
      </div>

      <div class="field">
        <label class="field__label" for="login-password">Contraseña</label>
        <div class="field__input-wrap">
          <input
            id="login-password"
            [type]="showPassword() ? 'text' : 'password'"
            class="field__input"
            [class.field__input--error]="passwordInvalid()"
            formControlName="password"
            autocomplete="current-password"
            placeholder="Tu contraseña"
            aria-required="true"
            [attr.aria-invalid]="passwordInvalid()"
          />
          <button
            type="button"
            class="field__toggle-visibility"
            (click)="showPassword.set(!showPassword())"
            [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            {{ showPassword() ? '👁' : '👁‍🗨' }}
          </button>
        </div>
        @if (passwordInvalid()) {
          <span class="field__error" role="alert">La contraseña es requerida</span>
        }
      </div>

      <div class="login-form__actions">
        <a routerLink="/auth/forgot-password" class="login-form__forgot">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <app-button
        type="submit"
        variant="primary"
        size="lg"
        [loading]="loading"
        [disabled]="form.invalid || loading"
        class="login-form__submit"
      >
        Iniciar sesión
      </app-button>

      <p class="login-form__register">
        ¿No tienes cuenta?
        <a routerLink="/auth/register" class="login-form__register-link">Regístrate</a>
      </p>
    </form>
  `,
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Input() loading = false;
  @Output() submitted = new EventEmitter<ILoginCredentials>();

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.group({
    email:    this.fb.control('', [Validators.required, emailValidator]),
    password: this.fb.control('', [Validators.required]),
  });

  protected emailInvalid(): boolean {
    const c = this.form.controls.email;
    return c.invalid && (c.dirty || c.touched);
  }

  protected emailError(): string {
    const errors = this.form.controls.email.errors;
    if (errors?.['required']) return 'El correo es requerido';
    if (errors?.['invalidEmail']) return 'Ingresa un correo válido';
    return '';
  }

  protected passwordInvalid(): boolean {
    const c = this.form.controls.password;
    return c.invalid && (c.dirty || c.touched);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.getRawValue());
  }
}
