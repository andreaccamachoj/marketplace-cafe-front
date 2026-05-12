import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { IRegisterPayload } from '@core/auth/models/auth-response.model';
import { BrandPanelComponent } from '@shared/layout/brand-panel/brand-panel.component';
import { StepIndicatorComponent, IStep } from '@shared/ui/step-indicator/step-indicator.component';
import { RoleSelectorComponent } from '../../components/role-selector/role-selector.component';
import { PersonalDataStepComponent } from '../../components/personal-data-step/personal-data-step.component';
import { RoleSpecificStepComponent } from '../../components/role-specific-step/role-specific-step.component';
import { RegisterFlowState, IPersonalData } from '../../services/register-flow.state';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    BrandPanelComponent,
    StepIndicatorComponent,
    RoleSelectorComponent,
    PersonalDataStepComponent,
    RoleSpecificStepComponent,
  ],
  providers: [RegisterFlowState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Ir al formulario</a>

    <!-- Mobile brand bar -->
    <div class="mobile-brand-bar" aria-hidden="true">
      <div class="mobile-brand-bar__logo">☕</div>
      <span class="mobile-brand-bar__name">World Coffee Marketplace</span>
    </div>

    <div class="layout">

      <!-- Left: brand panel -->
      <div class="panel-brand" aria-hidden="true">
        <app-brand-panel
          headlineHtml="Únete a la<br>comunidad <em>cafetera.</em>"
          description="Crea tu cuenta y conecta con productores de café sostenible colombiano."
        />
      </div>

      <!-- Right: form panel -->
      <main class="panel-form" id="main-content">
        <div class="register-wrap">

          <!-- Eyebrow + title -->
          <header class="register-header">
            <p class="register-eyebrow">Crear cuenta</p>
            <h1 class="register-title">{{ stepTitle() }}</h1>
            <p class="register-subtitle">{{ stepSubtitle() }}</p>
          </header>

          <!-- Step indicator -->
          <app-step-indicator
            [steps]="STEPS"
            [currentStep]="currentStepIndex()"
          />

          <!-- Step 1: Role selector -->
          @if (currentStepIndex() === 0) {
            <div class="step-pane">
              <app-role-selector
                [selected]="state.selectedRole()"
                (roleSelected)="onRoleSelected($event)"
              />
              <div class="register-nav register-nav--end">
                <button
                  type="button"
                  class="btn-next"
                  (click)="state.next()"
                >
                  <span>Continuar</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          }

          <!-- Step 2: Personal data -->
          @if (currentStepIndex() === 1) {
            <div class="step-pane">
              <app-personal-data-step
                (submitted)="onPersonalData($event)"
              />
              <div class="register-nav register-nav--back">
                <button type="button" class="btn-back" (click)="state.prev()">
                  ← Atrás
                </button>
              </div>
            </div>
          }

          <!-- Step 3: Role-specific data -->
          @if (currentStepIndex() === 2) {
            <div class="step-pane">
              <app-role-specific-step
                [role]="state.selectedRole()"
                (submitted)="onRoleData($event)"
                (back)="personalDataSaved.set(false)"
              />
            </div>
          }

          <!-- Footer link -->
          <p class="register-footer">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="register-footer__link">Inicia sesión</a>
          </p>

        </div>
      </main>
    </div>
  `,
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  protected readonly state   = inject(RegisterFlowState);
  private  readonly auth     = inject(AuthService);
  private  readonly notify   = inject(NotificationService);

  protected readonly loading           = signal(false);
  protected readonly personalDataSaved = signal(false);

  /** 0 = role, 1 = personal data, 2 = role-specific */
  protected readonly currentStepIndex = computed<number>(() => {
    if (this.state.step() === 1) return 0;
    if (this.state.step() === 2 && !this.personalDataSaved()) return 1;
    return 2;
  });

  protected readonly STEPS: IStep[] = [
    { label: 'Elige tu rol',      description: 'Tipo de cuenta' },
    { label: 'Datos personales',  description: 'Tu información' },
    { label: 'Perfil específico', description: 'Últimos detalles' },
  ];

  protected stepTitle(): string {
    const titles = [
      '¿Cómo deseas participar?',
      'Tus datos personales',
      this.state.selectedRole() === 'producer' ? 'Datos de tu finca' : 'Datos adicionales',
    ];
    return titles[this.currentStepIndex()] ?? '';
  }

  protected stepSubtitle(): string {
    const subs = [
      'Selecciona el tipo de cuenta que mejor describe tu actividad.',
      'Completa tu perfil básico para continuar.',
      'Casi listo — solo unos datos más para terminar.',
    ];
    return subs[this.currentStepIndex()] ?? '';
  }

  protected onRoleSelected(role: 'buyer' | 'producer'): void {
    this.state.selectRole(role);
  }

  protected onPersonalData(data: IPersonalData): void {
    this.state.savePersonalData(data);
    this.personalDataSaved.set(true);
  }

  async onRoleData(_roleData: Record<string, string>): Promise<void> {
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
      this.personalDataSaved.set(false);
    } catch (err) {
      this.notify.error(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      this.loading.set(false);
    }
  }
}
