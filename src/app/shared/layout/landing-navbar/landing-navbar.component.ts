import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { CartService } from '@features/buyer/services/cart.service';
import { Role } from '@core/auth/models/role.enum';

/**
 * Barra de navegación pública de World Coffee Marketplace.
 *
 * Diseñada para ser reutilizada en todas las páginas públicas
 * (catálogo, detalle de producto, landing, etc.).
 *
 * Inputs (signal-based):
 *   showSearch  – mostrar/ocultar caja de búsqueda (default: true)
 *   showLinks   – mostrar/ocultar links de sección (default: true)
 *
 * Outputs:
 *   searchChange – emite el texto cada vez que el usuario escribe
 *
 * Estado de autenticación y carrito gestionados internamente via signals.
 */
@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-navbar.component.html',
  styleUrl: './landing-navbar.component.scss',
})
export class LandingNavbarComponent {
  /* ── Services ── */
  protected readonly auth     = inject(AuthService);
  protected readonly cartSvc  = inject(CartService);
  private   readonly router   = inject(Router);

  /* ── Inputs (signal-based) ── */
  readonly showSearch = input(true);
  readonly showLinks  = input(true);

  /* ── Outputs ── */
  readonly searchChange = output<string>();

  /* ── Auth computed state ── */
  protected readonly isLoggedIn  = computed(() => this.auth.isAuthenticated());
  protected readonly userRole    = computed(() => this.auth.currentUser()?.roles[0] ?? null);
  protected readonly firstName   = computed(() => {
    const name = this.auth.currentUser()?.fullName ?? '';
    return name.split(' ')[0];
  });
  protected readonly userInitial = computed(() => this.firstName()[0]?.toUpperCase() ?? '?');

  /* ── Cart computed state (only relevant for buyers) ── */
  protected readonly cartCount = this.cartSvc.count;

  /* ── Private UI state ── */
  protected readonly searchValue = signal('');

  /* ── Handlers ── */
  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.searchChange.emit(value.trim());
  }

  protected clearSearch(): void {
    this.searchValue.set('');
    this.searchChange.emit('');
  }

  /**
   * Al pulsar Enter en páginas distintas al catálogo,
   * navega al catálogo con el término como query param.
   */
  protected onSearchEnter(): void {
    const q = this.searchValue().trim();
    if (!q) return;
    this.router.navigate(['/'], { queryParams: { q } });
  }

  protected goToCart(): void {
    void this.router.navigate(['/panel/comprador']);
  }

  protected goToDashboard(): void {
    const role = this.userRole();
    if (role === Role.BUYER)         void this.router.navigate(['/panel/comprador']);
    else if (role === Role.PRODUCER) void this.router.navigate(['/panel/productor']);
    else if (role === Role.ADMIN)    void this.router.navigate(['/panel/admin']);
  }

  protected logout(): void {
    this.auth.logout();
  }
}
