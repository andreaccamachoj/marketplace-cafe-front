import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Certification } from '../../models/product.model';

interface IProducerCard {
  name: string;
  region: string;
  avatar: string;
  avatarBg: string;
  certs: { label: string; cls: string }[];
}

const CERT_CONFIG: Record<Certification, { label: string; cls: string }> = {
  ORGANIC:    { label: 'Orgánico',   cls: 'badge-org'  },
  FAIRTRADE:  { label: 'Fairtrade',  cls: 'badge-fair' },
  RAINFOREST: { label: 'Rainforest', cls: 'badge-rain' },
};

const AVATARS   = ['👨‍🌾', '👩‍🌾', '👨‍🌾', '👩‍🌾'];
const AVATAR_BGS = [
  'rgba(74,140,86,.12)',
  'rgba(192,120,32,.12)',
  'rgba(26,107,138,.12)',
  'rgba(153,120,93,.15)',
];

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
          @for (p of producers(); track p.name) {
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
  private readonly productSvc = inject(ProductService);

  protected readonly producers = computed<IProducerCard[]>(() => {
    const seen = new Map<string, IProducerCard>();
    let idx = 0;

    for (const product of this.productSvc.list()) {
      if (!product.producerName || seen.has(product.producerName)) continue;

      const certSet = new Set<Certification>(product.certifications);
      const certs = Array.from(certSet)
        .filter(c => CERT_CONFIG[c])
        .map(c => CERT_CONFIG[c]);

      seen.set(product.producerName, {
        name:     product.producerName,
        region:   product.region || 'Colombia',
        avatar:   AVATARS[idx % AVATARS.length],
        avatarBg: AVATAR_BGS[idx % AVATAR_BGS.length],
        certs,
      });
      idx++;
    }

    return Array.from(seen.values()).slice(0, 8);
  });
}
