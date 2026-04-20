import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer-inner">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-brand">
            <div class="footer-logo-row">
              <div class="footer-logo-icon" aria-hidden="true">☕</div>
              <div class="footer-logo-name">World Coffee Marketplace</div>
            </div>
            <p class="footer-brand-desc">
              Conectamos productores certificados de las mejores regiones cafeteras
              de Colombia con el mundo.
            </p>
          </div>

          <!-- Marketplace -->
          <div>
            <div class="footer-col-title">Marketplace</div>
            <a routerLink="/"        class="footer-link">Catálogo</a>
            <a href="#prod-sec"      class="footer-link">Productores</a>
            <a href="#sus"           class="footer-link">Certificaciones</a>
            <a href="#prod-sec"      class="footer-link">Regiones</a>
          </div>

          <!-- Cuenta -->
          <div>
            <div class="footer-col-title">Cuenta</div>
            <a routerLink="/auth/login"    class="footer-link">Iniciar sesión</a>
            <a routerLink="/auth/register" class="footer-link">Registrarse</a>
            <a href="#"                    class="footer-link">Mis pedidos</a>
            <a href="#"                    class="footer-link">Perfil</a>
          </div>

          <!-- Legal -->
          <div>
            <div class="footer-col-title">Legal</div>
            <a href="#" class="footer-link">Términos de uso</a>
            <a href="#" class="footer-link">Privacidad</a>
            <a href="#" class="footer-link">Sostenibilidad</a>
            <a href="#" class="footer-link">Contacto</a>
          </div>
        </div>

        <div class="footer-bottom">
          <span class="footer-copy">© {{ year }} World Coffee Marketplace · UNAB · Todos los derechos reservados</span>
          <div class="footer-certs">
            <span class="footer-cert">🌿 Orgánico</span>
            <span class="footer-cert">⚖️ Fairtrade</span>
            <span class="footer-cert">🌲 Rainforest</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
