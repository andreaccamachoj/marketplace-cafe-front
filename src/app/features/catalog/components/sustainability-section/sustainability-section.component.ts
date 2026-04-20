import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sustainability-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section-sus" id="sus" aria-label="Compromiso con la sostenibilidad">
      <div class="sus-inner">
        <div class="section-header">
          <div class="section-eyebrow">Nuestro compromiso</div>
          <h2 class="section-title">Café que cuida el planeta<br>y a quienes lo cultivan</h2>
          <p class="section-desc">
            Cada producto en nuestro marketplace ha sido verificado por su origen,
            prácticas sostenibles y trato justo a los productores.
          </p>
        </div>
        <div class="sus-grid">
          <div class="sus-card">
            <div class="sus-icon sus-icon-green" aria-hidden="true">🌿</div>
            <div class="sus-card-title">100% Orgánico</div>
            <div class="sus-card-desc">Sin pesticidas ni químicos. Cultivo natural en armonía con los ecosistemas de las regiones cafeteras colombianas.</div>
            <div class="sus-num">87%</div>
            <div class="sus-num-label">del catálogo certificado orgánico</div>
          </div>
          <div class="sus-card">
            <div class="sus-icon sus-icon-amber" aria-hidden="true">⚖️</div>
            <div class="sus-card-title">Comercio Justo</div>
            <div class="sus-card-desc">Precio justo garantizado a los productores. Cada compra impacta directamente en el bienestar de las comunidades cafeteras.</div>
            <div class="sus-num">120+</div>
            <div class="sus-num-label">productores certificados Fairtrade</div>
          </div>
          <div class="sus-card">
            <div class="sus-icon sus-icon-earth" aria-hidden="true">🌲</div>
            <div class="sus-card-title">Trazabilidad Total</div>
            <div class="sus-card-desc">Conoce exactamente la finca, altitud, región y proceso de cada café. Del árbol a tu taza con transparencia completa.</div>
            <div class="sus-num">100%</div>
            <div class="sus-num-label">de pedidos con trazabilidad verificada</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './sustainability-section.component.scss',
})
export class SustainabilitySectionComponent {}
