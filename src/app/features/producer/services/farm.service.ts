import { Injectable, computed, signal } from '@angular/core';
import { IFarm, IFarmCertification } from '../models/farm.model';
import { ICertification } from '../models/certification.model';

const SEED_FARM: IFarm = {
  id: 'f1',
  name: 'Finca La Esperanza',
  municipality: 'Pitalito',
  department: 'Huila, Colombia',
  altitude: '1.780 msnm',
  area: '12,5 hectáreas',
  mainVariety: 'Caturra · Castillo',
  process: 'Lavado · Natural',
  description:
    'Ubicada en el corazón del Macizo Colombiano, Finca La Esperanza es una propiedad familiar con más de 30 años de tradición cafetera. Cultivamos café bajo sombra de guamos y plátanos, con prácticas agroecológicas que protegen las fuentes hídricas y la biodiversidad nativa. Nuestro proceso de beneficio húmedo y secado en cama africana garantiza una taza limpia con notas de frutos rojos, chocolate y panela.',
  certifications: [
    {
      id: 'c1',
      icon: '🌿',
      iconBg: 'var(--verde-light)',
      name: 'Café Orgánico Certificado',
      body: 'BioLatina · Certificado hasta dic 2026',
      validUntil: 'Dic 2026',
      status: 'valid',
    },
    {
      id: 'c2',
      icon: '⚖️',
      iconBg: 'var(--amber-light)',
      name: 'Fairtrade Internacional',
      body: 'FLO-CERT GmbH · Vence en 3 meses',
      validUntil: 'Sep 2025',
      status: 'expiring',
    },
    {
      id: 'c3',
      icon: '🌊',
      iconBg: 'var(--blue-light)',
      name: 'Rainforest Alliance',
      body: 'Rainforest Alliance · Certificado hasta ago 2026',
      validUntil: 'Ago 2026',
      status: 'valid',
    },
  ],
  metrics: {
    annualProduction: '240 sacos',
    yieldPerHa: '19,2 sacos',
    process: 'Lavado · Natural',
    harvestSeason: 'Sep – Dic',
    treeCount: '8.400',
    cuppingScore: '87 puntos SCA',
  },
  profileStatus: {
    status: 'approved',
    approvedBy: 'Admin WCMP',
    approvalDate: '15 ene 2025',
    verifiedDocs: 3,
  },
};

@Injectable({ providedIn: 'root' })
export class FarmService {
  private readonly _farm = signal<IFarm>(SEED_FARM);

  readonly farm = this._farm.asReadonly();

  readonly certifications = computed(() => this._farm().certifications ?? []);

  updateFarm(data: Partial<IFarm>): void {
    this._farm.update(f => ({ ...f, ...data }));
  }

  addCertification(cert: Omit<ICertification, 'id'>): void {
    const id = 'cert-' + Date.now();
    const farmCert: IFarmCertification = {
      id,
      icon:       this.certTypeToIcon(cert.type),
      iconBg:     this.certTypeToIconBg(cert.type),
      name:       cert.name,
      body:       `${cert.issuer} · Vence ${this.formatDate(cert.expiryDate)}`,
      validUntil: this.formatDate(cert.expiryDate),
      status:     cert.status === 'vigente' ? 'valid' : 'expiring',
    };
    this._farm.update(f => ({
      ...f,
      certifications: [...(f.certifications ?? []), farmCert],
    }));
  }

  removeCertification(id: string): void {
    this._farm.update(f => ({
      ...f,
      certifications: (f.certifications ?? []).filter(c => c.id !== id),
    }));
  }

  private certTypeToIcon(type: ICertification['type']): string {
    const map: Record<ICertification['type'], string> = {
      'organic':       '🌿',
      'utz':           '✅',
      'fair-trade':    '⚖️',
      'rainforest':    '🌊',
      'bird-friendly': '🐦',
      'direct-trade':  '🤝',
      'shade-grown':   '🌳',
      'other':         '🏅',
    };
    return map[type];
  }

  private certTypeToIconBg(type: ICertification['type']): string {
    const map: Record<ICertification['type'], string> = {
      'organic':       'var(--verde-light)',
      'utz':           'var(--verde-light)',
      'fair-trade':    'var(--amber-light)',
      'rainforest':    'var(--blue-light, #E0F2F8)',
      'bird-friendly': 'var(--verde-light)',
      'direct-trade':  'var(--marfil-light)',
      'shade-grown':   'var(--verde-light)',
      'other':         'var(--marfil-light)',
    };
    return map[type];
  }

  private formatDate(isoDate: string): string {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('es-CO', { month: 'short', year: 'numeric' });
  }
}
