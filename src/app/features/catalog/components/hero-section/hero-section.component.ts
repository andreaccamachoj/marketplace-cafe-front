import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" aria-label="Bienvenida al marketplace">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge" role="note">
            🌿 Café sostenible de origen colombiano
          </div>
          <h1 class="hero-title">
            El mejor café de<br>origen, directo al<br><em>mundo.</em>
          </h1>
          <p class="hero-desc">
            Conectamos productores certificados de las mejores regiones cafeteras
            de Colombia con compradores que valoran la trazabilidad, la ética y
            el sabor auténtico en cada taza.
          </p>
          <div class="hero-ctas">
            <a href="#catalog" class="btn-hero-primary" (click)="onExplore($event)">Explorar catálogo</a>
            <a href="#sus"     class="btn-hero-ghost">Conócenos</a>
          </div>
          <div class="hero-stats" role="list">
            <div class="stat-item" role="listitem">
              <span class="stat-num">120+</span>
              <span class="stat-lbl">Productores</span>
            </div>
            <div class="stat-item" role="listitem">
              <span class="stat-num">18</span>
              <span class="stat-lbl">Regiones</span>
            </div>
            <div class="stat-item" role="listitem">
              <span class="stat-num">100%</span>
              <span class="stat-lbl">Certificado</span>
            </div>
            <div class="stat-item" role="listitem">
              <span class="stat-num">4.9★</span>
              <span class="stat-lbl">Valoración</span>
            </div>
          </div>
        </div>

        <!-- Ilustración copa de café -->
        <div class="hero-art" aria-hidden="true">
          <svg width="260" height="300" viewBox="0 0 260 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="v1" d="M96 60 Q101 44 96 30" stroke="rgba(205,196,181,.4)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path class="v2" d="M130 52 Q136 35 130 20" stroke="rgba(205,196,181,.3)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path class="v3" d="M164 60 Q159 44 164 30" stroke="rgba(205,196,181,.35)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <ellipse cx="130" cy="272" rx="88" ry="13" fill="rgba(153,120,93,.2)"/>
            <ellipse cx="130" cy="268" rx="82" ry="10" fill="rgba(55,38,23,.3)"/>
            <path d="M60 95 L70 255 Q70 265 130 265 Q190 265 190 255 L200 95 Z" fill="rgba(62,41,25,.92)" stroke="rgba(153,120,93,.25)" stroke-width="1.5"/>
            <path d="M62 140 L198 140" stroke="rgba(205,196,181,.07)" stroke-width="1"/>
            <path d="M64 180 L196 180" stroke="rgba(205,196,181,.07)" stroke-width="1"/>
            <path d="M66 218 L194 218" stroke="rgba(205,196,181,.07)" stroke-width="1"/>
            <ellipse cx="130" cy="95" rx="70" ry="16" fill="rgba(100,68,40,.95)"/>
            <ellipse cx="130" cy="95" rx="67" ry="13" fill="rgba(125,87,56,.9)"/>
            <ellipse cx="112" cy="90" rx="22" ry="6" fill="rgba(165,120,80,.28)" transform="rotate(-15 112 90)"/>
            <path d="M112 95 Q130 80 148 95 Q130 110 112 95Z" fill="rgba(205,196,181,.1)"/>
            <path d="M128 88 L132 102" stroke="rgba(205,196,181,.12)" stroke-width="1" stroke-linecap="round"/>
            <path d="M190 128 Q230 128 230 170 Q230 212 190 212" stroke="rgba(153,120,93,.55)" stroke-width="12" stroke-linecap="round" fill="none"/>
            <path d="M190 128 Q223 128 223 170 Q223 212 190 212" stroke="rgba(62,41,25,.9)" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M60 95 Q130 84 200 95" stroke="rgba(153,120,93,.3)" stroke-width="2" fill="none"/>
          </svg>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  @Output() exploreCatalog = new EventEmitter<void>();

  protected onExplore(event: Event): void {
    event.preventDefault();
    this.exploreCatalog.emit();
    const el = document.getElementById('catalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
