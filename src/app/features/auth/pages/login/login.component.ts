import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ILoginCredentials } from '@core/auth/models/auth-response.model';
import { BrandPanelComponent } from '@shared/layout/brand-panel/brand-panel.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BrandPanelComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#main-form" class="skip-link">Saltar al formulario de inicio de sesión</a>

    <!-- Barra de marca para móvil -->
    <div class="mobile-brand-bar" role="banner">
      <span class="mob-logo" aria-hidden="true">☕</span>
      <div>
        <div class="mob-name">World Coffee Marketplace</div>
        <div class="mob-sub">Café sostenible · Colombia</div>
      </div>
    </div>

    <div class="layout">
      <!-- Panel de marca izquierdo -->
      <app-brand-panel></app-brand-panel>

      <!-- Panel formulario derecho -->
      <main class="panel-form" id="main-form">
        <app-login-form
          [loading]="loading()"
          (submitted)="onSubmit($event)"
        ></app-login-form>
      </main>
    </div>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth   = inject(AuthService);
  private readonly notify = inject(NotificationService);

  protected readonly loading = signal(false);

  async onSubmit(credentials: ILoginCredentials): Promise<void> {
    this.loading.set(true);
    try {
      await this.auth.login(credentials);
    } catch (err) {
      this.notify.error(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }
}
