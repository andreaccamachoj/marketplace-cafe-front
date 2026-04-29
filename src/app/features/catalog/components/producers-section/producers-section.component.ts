import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

interface IProducer {
  name: string;
  region: string;
  avatar: string;
  avatarBg: string;
  certs: { label: string; cls: string }[];
}

@Component({
  selector: 'app-producers-section',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section-prod" id="prod-sec" aria-label="Productores destacados">
      <div class="prod-inner">
        <div class="section-header">
          <div class="section-eyebrow">Quiénes están detrás</div>
          <h2 class="section-title">Productores verificados</h2>
          <p class="section-desc">
            Familias y cooperativas colombianas con décadas de tradición cafetera,
            comprometidas con la calidad y la sostenibilidad.
          </p>
        </div>
        <div class="producers-grid">
          @for (p of producers; track p.name) {
            <div class="producer-card">
              <div class="producer-avatar" [style.background]="p.avatarBg">{{ p.avatar }}</div>
              <div class="producer-name">{{ p.name }}</div>
              <div class="producer-region">📍 {{ p.region }}</div>
              <div class="producer-certs">
                @for (cert of p.certs; track cert.label) {
                  <span class="badge" [ngClass]="cert.cls">{{ cert.label }}</span>
                }
              </div>
              <div class="producer-verified">✓ Verificado</div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './producers-section.component.scss',
})
export class ProducersSectionComponent {
  protected readonly producers: IProducer[] = [
    {
      name: 'Finca La Esperanza', region: 'Huila, Colombia',
      avatar: '👨‍🌾', avatarBg: 'rgba(74,140,86,.12)',
      certs: [{ label: 'Orgánico', cls: 'badge-org' }, { label: 'Fairtrade', cls: 'badge-fair' }],
    },
    {
      name: 'Coop. Nariño Verde', region: 'Nariño, Colombia',
      avatar: '👩‍🌾', avatarBg: 'rgba(192,120,32,.12)',
      certs: [{ label: 'Orgánico', cls: 'badge-org' }, { label: 'Rainforest', cls: 'badge-rain' }],
    },
    {
      name: 'Sierra Nevada Farms', region: 'Magdalena, Colombia',
      avatar: '👨‍🌾', avatarBg: 'rgba(26,107,138,.12)',
      certs: [{ label: 'Rainforest', cls: 'badge-rain' }],
    },
    {
      name: 'Coop. Eje Cafetero', region: 'Quindío, Colombia',
      avatar: '👩‍🌾', avatarBg: 'rgba(153,120,93,.15)',
      certs: [
        { label: 'Orgánico',   cls: 'badge-org'  },
        { label: 'Fairtrade',  cls: 'badge-fair' },
        { label: 'Rainforest', cls: 'badge-rain' },
      ],
    },
  ];
}
