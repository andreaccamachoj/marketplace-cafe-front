import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ILoginCredentials } from '@core/auth/models/auth-response.model';
import { BrandPanelComponent } from '@shared/layout/brand-panel/brand-panel.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, BrandPanelComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-layout">
      <div class="auth-layout__brand">
        <app-brand-panel
          title="World Coffee Marketplace"
          subtitle="Conectando productores de café sostenible con compradores conscientes"
        ></app-brand-panel>
      </div>

      <main class="auth-layout__form" id="main-content">
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
      this.notify.success('¡Bienvenido de vuelta!');
    } catch (err) {
      this.notify.error(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }
}
