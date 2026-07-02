import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { Role } from '@core/auth/models/role.enum';

@Component({
  selector: 'app-dashboard-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './dashboard-nav.component.html',
  styleUrl: './dashboard-nav.component.scss',
})
export class DashboardNavComponent {
  protected readonly auth = inject(AuthService);

  readonly pageTitle = input<string>('');
  readonly menuToggle = output<void>();

  protected readonly userInitials = computed(() => {
    const name = this.auth.currentUser()?.fullName ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  });

  protected readonly roleLabel = computed(() => {
    const role = this.auth.currentRole();
    const labels: Record<Role, string> = {
      [Role.BUYER]:    'Comprador',
      [Role.PRODUCER]: 'Productor',
      [Role.ADMIN]:    'Administrador',
    };
    return role ? (labels[role] ?? '') : '';
  });

  protected readonly avatarColor = computed(() => {
    const role = this.auth.currentRole();
    const colors: Record<Role, string> = {
      [Role.BUYER]:    'var(--cafe-medio)',
      [Role.PRODUCER]: 'var(--verde-fresco)',
      [Role.ADMIN]:    '#5B3E8F',
    };
    return role ? (colors[role] ?? 'var(--cafe-medio)') : 'var(--cafe-medio)';
  });

  protected onHamburgerClick(): void {
    this.menuToggle.emit();
  }

  protected logout(): void {
    this.auth.logout();
  }
}
