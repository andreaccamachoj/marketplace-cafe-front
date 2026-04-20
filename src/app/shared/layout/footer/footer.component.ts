import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer__container">
        <div class="footer__section">
          <h3 class="footer__heading">World Coffee Marketplace</h3>
          <p class="footer__text">
            Conectando productores de café colombianos con consumidores de toda Colombia.
          </p>
        </div>

        <div class="footer__section">
          <h4 class="footer__subheading">Enlaces</h4>
          <ul class="footer__links">
            <li><a href="#" class="footer__link">Inicio</a></li>
            <li><a href="#" class="footer__link">Catálogo</a></li>
            <li><a href="#" class="footer__link">Sobre nosotros</a></li>
            <li><a href="#" class="footer__link">Contacto</a></li>
          </ul>
        </div>

        <div class="footer__section">
          <h4 class="footer__subheading">Legal</h4>
          <ul class="footer__links">
            <li><a href="#" class="footer__link">Términos de servicio</a></li>
            <li><a href="#" class="footer__link">Política de privacidad</a></li>
            <li><a href="#" class="footer__link">Política de cookies</a></li>
          </ul>
        </div>

        <div class="footer__section">
          <h4 class="footer__subheading">Síguenos</h4>
          <div class="footer__socials">
            <a href="#" class="footer__social" aria-label="Facebook">f</a>
            <a href="#" class="footer__social" aria-label="Instagram">📷</a>
            <a href="#" class="footer__social" aria-label="Twitter">𝕏</a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ year }} World Coffee Marketplace. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
