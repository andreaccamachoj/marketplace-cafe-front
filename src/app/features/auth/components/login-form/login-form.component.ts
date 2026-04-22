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
import { ILoginCredentials } from '@core/auth/models/auth-response.model';
import { emailValidator } from '@shared/utils/validators/email.validator';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-card" role="region" aria-label="Formulario de inicio de sesión">

      <div class="form-header">
        <div class="form-eyebrow" aria-hidden="true">Bienvenido de vuelta</div>
        <h1 class="form-title">Inicia sesión</h1>
        <p class="form-subtitle">Accede a tu cuenta para explorar el mejor café de origen.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate aria-label="Inicio de sesión">

        <!-- Email -->
        <div class="field-group" id="field-email">
          <div class="field-label">
            <label for="login-email" class="label-text">
              Correo electrónico
              <span class="label-required" aria-label="campo requerido">*</span>
            </label>
          </div>
          <div class="input-wrap">
            <span class="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </span>
            <input
              id="login-email"
              type="email"
              class="field-input"
              formControlName="email"
              autocomplete="email"
              placeholder="tu@correo.com"
              aria-required="true"
              [attr.aria-invalid]="emailInvalid() ? true : (emailTouched() ? false : null)"
              aria-describedby="login-email-error"
            />
          </div>
          @if (emailInvalid()) {
            <div id="login-email-error" class="field-message error" role="alert">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {{ emailError() }}
            </div>
          }
        </div>

        <!-- Password -->
        <div class="field-group" id="field-password">
          <div class="field-label">
            <label for="login-password" class="label-text">
              Contraseña
              <span class="label-required" aria-label="campo requerido">*</span>
            </label>
            <a routerLink="/auth/forgot-password" class="forgot-link">¿Olvidaste?</a>
          </div>
          <div class="input-wrap">
            <span class="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              id="login-password"
              [type]="showPassword() ? 'text' : 'password'"
              class="field-input"
              formControlName="password"
              autocomplete="current-password"
              placeholder="Tu contraseña"
              aria-required="true"
              [attr.aria-invalid]="passwordInvalid() ? true : (passwordTouched() ? false : null)"
            />
            <button
              type="button"
              class="input-action"
              (click)="showPassword.set(!showPassword())"
              [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              @if (showPassword()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              }
            </button>
          </div>
          @if (passwordInvalid()) {
            <div class="field-message error" role="alert">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              La contraseña es requerida
            </div>
          }
        </div>

        <!-- Opciones -->
        <div class="options-row">
          <label class="custom-check">
            <input type="checkbox" formControlName="remember" />
            <span class="check-box"></span>
            <span class="check-label">Recordar mi sesión</span>
          </label>
        </div>

        <!-- Botón principal -->
        <button
          type="submit"
          class="btn-submit"
          [disabled]="form.invalid || loading"
        >
          @if (loading) {
            <span class="btn-spinner" aria-hidden="true"></span>
          }
          <span class="btn-label">{{ loading ? 'Iniciando…' : 'Iniciar sesión' }}</span>
        </button>

        <!-- OAuth divider -->
        <div class="oauth-divider" aria-hidden="true">
          <span class="oauth-line"></span>
          <span class="oauth-text">o continúa con</span>
          <span class="oauth-line"></span>
        </div>

        <!-- Google -->
        <button type="button" class="btn-google">
          <svg class="google-logo" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>

      </form>

      <!-- Footer -->
      <p class="form-footer">
        ¿No tienes cuenta?
        <a routerLink="/auth/register" class="register-link">Regístrate</a>
      </p>

    </div>
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
    remember: this.fb.control(false),
  });

  protected emailInvalid(): boolean {
    const c = this.form.controls.email;
    return c.invalid && (c.dirty || c.touched);
  }

  protected emailTouched(): boolean {
    return this.form.controls.email.touched;
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

  protected passwordTouched(): boolean {
    return this.form.controls.password.touched;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.submitted.emit({ email, password });
  }
}
