import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface IBrandPillar {
  icon: string;
  iconClass: 'green' | 'amber' | 'earth';
  title: string;
  sub: string;
}

@Component({
  selector: 'app-brand-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="panel-brand" aria-hidden="true">

      <!-- Logo header -->
      <div class="brand-header">
        <div class="brand-logo-circle">☕</div>
        <div class="brand-name-group">
          <div class="brand-name">World Coffee Marketplace</div>
          <div class="brand-tagline">Est. 2025 · Colombia</div>
        </div>
      </div>

      <!-- Ilustración copa SVG -->
      <div class="brand-illustration">
        <div class="cup-illustration">
          <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="v1" d="M80 52 Q84 38 80 26" stroke="rgba(205,196,181,.45)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path class="v2" d="M110 46 Q115 30 110 18" stroke="rgba(205,196,181,.35)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <path class="v3" d="M140 52 Q136 38 140 26" stroke="rgba(205,196,181,.4)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <ellipse cx="110" cy="236" rx="78" ry="12" fill="rgba(153,120,93,.25)"/>
            <ellipse cx="110" cy="232" rx="74" ry="10" fill="rgba(55,38,23,.35)"/>
            <ellipse cx="110" cy="230" rx="70" ry="8"  fill="rgba(80,55,35,.4)"/>
            <path d="M50 80 L58 220 Q58 230 110 230 Q162 230 162 220 L170 80 Z"
                  fill="rgba(62,41,25,.9)" stroke="rgba(153,120,93,.3)" stroke-width="1.5"/>
            <path d="M52 120 L168 120" stroke="rgba(205,196,181,.08)" stroke-width="1"/>
            <path d="M53 155 L167 155" stroke="rgba(205,196,181,.08)" stroke-width="1"/>
            <path d="M55 190 L165 190" stroke="rgba(205,196,181,.08)" stroke-width="1"/>
            <ellipse cx="110" cy="80" rx="60" ry="14" fill="rgba(100,68,40,.95)"/>
            <ellipse cx="110" cy="80" rx="58" ry="12" fill="rgba(120,82,50,.9)"/>
            <ellipse cx="94" cy="76" rx="18" ry="5" fill="rgba(160,115,75,.3)" transform="rotate(-12 94 76)"/>
            <path d="M95 80 Q110 68 125 80 Q110 92 95 80Z" fill="rgba(205,196,181,.12)"/>
            <path d="M107 74 L113 86" stroke="rgba(205,196,181,.15)" stroke-width="1" stroke-linecap="round"/>
            <path d="M162 110 Q195 110 195 145 Q195 180 162 180"
                  stroke="rgba(153,120,93,.6)" stroke-width="10" stroke-linecap="round" fill="none"/>
            <path d="M162 110 Q188 110 188 145 Q188 180 162 180"
                  stroke="rgba(62,41,25,.9)" stroke-width="5" stroke-linecap="round" fill="none"/>
            <path d="M50 80 Q110 70 170 80" stroke="rgba(153,120,93,.35)" stroke-width="2" fill="none"/>
          </svg>
        </div>
      </div>

      <!-- Texto + pilares -->
      <div class="brand-body">
        <h2 class="brand-headline" [innerHTML]="headlineHtml"></h2>
        <p class="brand-desc">{{ description }}</p>

        <div class="brand-pillars" role="list">
          @for (p of pillars; track p.title) {
            <div class="pillar" role="listitem">
              <div class="pillar-icon" [class]="p.iconClass">{{ p.icon }}</div>
              <div class="pillar-text">
                <span class="pillar-title">{{ p.title }}</span>
                <span class="pillar-sub">{{ p.sub }}</span>
              </div>
            </div>
          }
        </div>
      </div>

    </aside>
  `,
  styleUrl: './brand-panel.component.scss',
})
export class BrandPanelComponent {
  @Input() headlineHtml  = 'Del origen<br>a tu <em>taza.</em>';
  @Input() description   = 'Conectamos productores verificados de las mejores regiones cafeteras con compradores que valoran lo auténtico.';
  @Input() pillars: IBrandPillar[] = [
    { icon: '🌿', iconClass: 'green', title: '100% Sostenible',    sub: 'Orgánico · Fairtrade · Rainforest' },
    { icon: '🔍', iconClass: 'amber', title: 'Trazabilidad total', sub: 'De la finca a tu pedido' },
    { icon: '☕', iconClass: 'earth', title: 'Sabor auténtico',    sub: 'Productores certificados' },
  ];

  /** @deprecated usa headlineHtml / description en su lugar */
  @Input() set title(v: string) { /* backward-compat, ignorado */ }
  @Input() set subtitle(v: string) { /* backward-compat, ignorado */ }
}
