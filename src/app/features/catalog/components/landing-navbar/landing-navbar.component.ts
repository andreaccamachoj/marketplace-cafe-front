import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="nav" role="navigation" aria-label="Navegación principal">
      <div class="nav-inner">

        <!-- Logo -->
        <a routerLink="/" class="nav-logo" aria-label="World Coffee Marketplace — Inicio">
          <div class="nav-logo-icon" aria-hidden="true">☕</div>
          <div class="nav-logo-text">
            <div class="nav-logo-name">World Coffee</div>
            <div class="nav-logo-sub">Marketplace</div>
          </div>
        </a>

        <!-- Búsqueda -->
        <div class="nav-search" role="search">
          <span class="nav-search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="search"
            class="nav-search-input"
            [class.has-value]="searchValue().length > 0"
            [value]="searchValue()"
            placeholder="Buscar café por nombre, región o productor..."
            aria-label="Buscar productos en el catálogo"
            autocomplete="off"
            (input)="onSearch($event)"
          />
          @if (searchValue().length > 0) {
            <button class="nav-search-clear" (click)="clearSearch()" aria-label="Limpiar búsqueda">✕</button>
          }
        </div>

        <!-- Links -->
        <div class="nav-links" role="list">
          <a href="#catalog" class="nav-link active" role="listitem">Catálogo</a>
          <a href="#sus"     class="nav-link"        role="listitem">Sostenibilidad</a>
          <a href="#prod-sec" class="nav-link"       role="listitem">Productores</a>
        </div>

        <!-- Acciones -->
        <div class="nav-actions">
          <button class="btn-cart" (click)="cartClick.emit()" aria-label="Ver carrito de compras">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            @if (cartCount > 0) {
              <span class="cart-badge" aria-live="polite" [attr.aria-label]="cartCount + ' productos en carrito'">
                {{ cartCount }}
              </span>
            }
          </button>
          <a routerLink="/auth/login"    class="btn-nav-ghost">Iniciar sesión</a>
          <a routerLink="/auth/register" class="btn-nav-primary">Registrarse</a>
        </div>

      </div>
    </nav>
  `,
  styleUrl: './landing-navbar.component.scss',
})
export class LandingNavbarComponent {
  @Input() cartCount = 0;
  @Output() searchChange = new EventEmitter<string>();
  @Output() cartClick    = new EventEmitter<void>();

  protected readonly searchValue = signal('');

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.searchChange.emit(value.trim());
  }

  protected clearSearch(): void {
    this.searchValue.set('');
    this.searchChange.emit('');
  }
}
