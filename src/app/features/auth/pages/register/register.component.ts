import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { IRegisterPayload } from '@core/auth/models/auth-response.model';
import { BrandPanelComponent } from '@shared/layout/brand-panel/brand-panel.component';
import { RoleSelectorComponent } from '../../components/role-selector/role-selector.component';
import { PersonalDataStepComponent } from '../../components/personal-data-step/personal-data-step.component';
import { RoleSpecificStepComponent } from '../../components/role-specific-step/role-specific-step.component';
import { RegisterFlowState, IPersonalData } from '../../services/register-flow.state';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BrandPanelComponent,
    RoleSelectorComponent,
    PersonalDataStepComponent,
    RoleSpecificStepComponent,
  ],
  providers: [RegisterFlowState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-layout">
      <div class="auth-layout__brand">
        <app-brand-panel
          title="Únete a World Coffee"
          subtitle="Crea tu cuenta y sé parte del cambio en el café colombiano"
        ></app-brand-panel>
      </div>

      <main class="auth-layout__form" id="main-content">
        <div class="register-wrap">
          <div class="register-steps">
            <span class="register-steps__label">Paso {{ state.step() }} de 2</span>
            <div class="register-steps__bar">
              <div
                class="register-steps__fill"
                [style.width.%]="state.step() * 50"
              ></div>
            </div>
          </div>

          @if (state.step() === 1) {
            <app-role-selector
              [selected]="state.selectedRole()"
              (roleSelected)="onRoleSelected($event)"
            ></app-role-selector>
            <div class="register-next">
              <button type="button" class="btn-primary" (click)="state.next()">
                Continuar →
              </button>
            </div>
          }

          @if (state.step() === 2) {
            @if (!personalDataSaved()) {
              <app-personal-data-step
                (submitted)="onPersonalData($event)"
              ></app-personal-data-step>
            } @else {
              <app-role-specific-step
                [role]="state.selectedRole()"
                (submitted)="onRoleData($event)"
                (back)="personalDataSaved.set(false)"
              ></app-role-specific-step>
            }
          }

          <p class="register-wrap__login">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="register-wrap__login-link">Inicia sesión</a>
          </p>
        </div>
      </main>
    </div>
  `,
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  protected readonly state   = inject(RegisterFlowState);
  private readonly auth      = inject(AuthService);
  private readonly notify    = inject(NotificationService);

  protected readonly loading         = signal(false);
  protected readonly personalDataSaved = signal(false);

  protected onRoleSelected(role: 'buyer' | 'producer'): void {
    this.state.selectRole(role);
  }

  protected onPersonalData(data: IPersonalData): void {
    this.state.savePersonalData(data);
    this.personalDataSaved.set(true);
  }

  async onRoleData(roleData: Record<string, string>): Promise<void> {
    this.loading.set(true);
    const personal = this.state.personalData();
    const payload: IRegisterPayload = {
      fullName: `${personal.firstName ?? ''} ${personal.lastName ?? ''}`.trim(),
      email:    personal.email ?? '',
      phone:    personal.phone ?? '',
      password: personal.password ?? '',
      role:     this.state.selectedRole(),
    };

    try {
      await this.auth.register(payload);
      this.notify.success('¡Cuenta creada exitosamente!');
      this.state.reset();
    } catch (err) {
      this.notify.error(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      this.loading.set(false);
    }
  }
}
