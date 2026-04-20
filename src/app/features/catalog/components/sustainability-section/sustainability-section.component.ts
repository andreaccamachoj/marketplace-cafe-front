import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sustainability-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sustainability">
      <div class="sustainability__header">
        <h2 class="sustainability__title">Comprometidos con la Sostenibilidad</h2>
        <p class="sustainability__subtitle">
          Cada compra apoya a productores responsables y protege nuestro planeta.
        </p>
      </div>

      <div class="sustainability__grid">
        <div class="sustainability__card">
          <div class="sustainability__icon">🌱</div>
          <h3>Café Orgánico</h3>
          <p>Sin pesticidas ni químicos. Cultivos respetuosos con la tierra.</p>
        </div>

        <div class="sustainability__card">
          <div class="sustainability__icon">👥</div>
          <h3>Comercio Justo</h3>
          <p>Precios justos que benefician directamente a los productores.</p>
        </div>

        <div class="sustainability__card">
          <div class="sustainability__icon">🌳</div>
          <h3>Bosques Protegidos</h3>
          <p>Nuestros productores protegen la biodiversidad forestal.</p>
        </div>
      </div>
    </section>
  `,
  styleUrl: './sustainability-section.component.scss',
})
export class SustainabilitySectionComponent {}
