import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { emailValidator } from '@shared/utils/validators/email.validator';
import { BrandPanelComponent } from '@shared/layout/brand-panel/brand-panel.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, BrandPanelComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-layout">
      <div class="auth-layout__brand">
        <app-brand-panel
          title="Recupera tu acceso"
          subtitle="Te enviaremos un enlace para restablecer tu contraseña"
        ></app-brand-panel>
      </div>

      <main class="auth-layout__form" id="main-content">
        <div class="forgot-wrap">
          <h2 class="forgot-wrap__title">¿Olvidaste tu contraseña?</h2>
          <p class="forgot-wrap__desc">
            Ingresa tu correo y te enviaremos un enlace de recuperación.
          </p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="forgot-form">
            <div class="field">
              <label class="field__label" for="forgot-email">Correo electrónico</label>
              <input
                id="forgot-email"
                type="email"
                class="field__input"
                [class.field__input--error]="emailInvalid()"
                formControlName="email"
                placeholder="tu@correo.com"
                aria-required="true"
              />
              @if (emailInvalid()) {
                <span class="field__error" role="alert">{{ emailError() }}</span>
              }
            </div>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [loading]="loading()"
              [disabled]="form.invalid || loading()"
              class="forgot-form__submit"
            >
              Enviar enlace
            </app-button>
          </form>

          <a routerLink="/auth/login" class="forgot-wrap__back">
            ← Volver al inicio de sesión
          </a>
        </div>
      </main>
    </div>
  `,
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly auth   = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly fb     = inject(NonNullableFormBuilder);

  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    email: this.fb.control('', [Validators.required, emailValidator]),
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

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    try {
      await this.auth.recoverPassword(this.form.controls.email.value);
    } finally {
      this.loading.set(false);
    }
  }
}
