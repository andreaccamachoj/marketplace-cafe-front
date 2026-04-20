import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '@core/auth/services/auth.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, ClickOutsideDirective, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar" role="navigation" aria-label="Barra superior">
      <div class="navbar__container">
        <!-- Left: empty for now (could add search) -->
        <div class="navbar__left"></div>

        <!-- Right: user menu -->
        <div class="navbar__right">
          <div class="user-menu" (clickOutside)="menuOpen.set(false)">
            <button
              type="button"
              class="user-menu__toggle"
              [attr.aria-expanded]="menuOpen()"
              (click)="toggleMenu()"
              aria-label="Menú de usuario"
            >
              <app-avatar
                [name]="auth.currentUser()?.fullName || 'Usuario'"
                size="sm"
                aria-hidden="true"
              />
              <span class="user-menu__name">{{ auth.currentUser()?.fullName }}</span>
              <span class="user-menu__icon" aria-hidden="true">▼</span>
            </button>

            @if (menuOpen()) {
              <div class="user-menu__dropdown" role="menu">
                <a href="#" class="user-menu__item" role="menuitem" (click)="goToProfile($event)">
                  👤 Mi Perfil
                </a>
                <a href="#" class="user-menu__item" role="menuitem" (click)="goToSettings($event)">
                  ⚙️ Configuración
                </a>
                <hr class="user-menu__divider" />
                <button
                  type="button"
                  class="user-menu__item user-menu__item--logout"
                  role="menuitem"
                  (click)="logout()"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly menuOpen = signal(false);

  @Output() logoutClick = new EventEmitter<void>();

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected goToProfile(e: Event): void {
    e.preventDefault();
    this.menuOpen.set(false);
    // TODO: navigate to profile
  }

  protected goToSettings(e: Event): void {
    e.preventDefault();
    this.menuOpen.set(false);
    // TODO: navigate to settings
  }

  protected logout(): void {
    this.auth.logout();
    this.logoutClick.emit();
  }
}
