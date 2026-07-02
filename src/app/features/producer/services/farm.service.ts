import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IFarm, IFarmCertification } from '../models/farm.model';
import { ICertification, CertificationType } from '../models/certification.model';

interface BackendFarm {
  id: string;
  name: string;
  municipality: string;
  department: string;
  altitudeMasl: number | null;
  areaHectares: number | null;
  mainVariety: string | null;
  process: string | null;
  description: string | null;
  treeCount: number | null;
  harvestSeason: string | null;
  annualProductionSacos: number | null;
  yieldPerHa: number | null;
  cuppingScore: number | null;
}

interface BackendCert {
  id: string;
  farmId: string;
  certificationId: number | null;
  issuer: string | null;
  expiryDate: string | null;
  status: string | null;
  notes: string | null;
}

const EMPTY_FARM: IFarm = {
  id: '', name: '', municipality: '', department: '', altitude: '',
  area: '', mainVariety: '', process: '', description: '',
  certifications: [],
  metrics: { annualProduction: '', yieldPerHa: '', process: '', harvestSeason: '', treeCount: '', cuppingScore: '' },
  profileStatus: { status: 'pending', approvedBy: '', approvalDate: '', verifiedDocs: 0 },
};

function mapFarm(b: BackendFarm): IFarm {
  const fmt = (n: number | null, suffix = '') =>
    n != null ? n.toLocaleString('es-CO') + (suffix ? ' ' + suffix : '') : '';
  return {
    id:          b.id,
    name:        b.name,
    municipality: b.municipality,
    department:  b.department,
    altitude:    fmt(b.altitudeMasl, 'msnm'),
    area:        fmt(b.areaHectares, 'hectáreas'),
    mainVariety: b.mainVariety ?? '',
    process:     b.process ?? '',
    description: b.description ?? '',
    certifications: [],
    metrics: {
      annualProduction: fmt(b.annualProductionSacos, 'sacos'),
      yieldPerHa:       fmt(b.yieldPerHa, 'sacos'),
      process:          b.process ?? '',
      harvestSeason:    b.harvestSeason ?? '',
      treeCount:        fmt(b.treeCount),
      cuppingScore:     b.cuppingScore != null ? b.cuppingScore + ' puntos SCA' : '',
    },
    profileStatus: EMPTY_FARM.profileStatus,
  };
}

function parseColNum(s: string): number {
  return parseFloat(s.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
}

const CERT_ICONS: Record<string, string> = {
  'organic': '🌿', 'utz': '✅', 'fair-trade': '⚖️', 'rainforest': '🌊',
  'bird-friendly': '🐦', 'direct-trade': '🤝', 'shade-grown': '🌳', 'other': '🏅',
};
const CERT_BG: Record<string, string> = {
  'organic': 'var(--verde-light)', 'utz': 'var(--verde-light)', 'fair-trade': 'var(--amber-light)',
  'rainforest': 'var(--blue-light, #E0F2F8)', 'bird-friendly': 'var(--verde-light)',
  'direct-trade': 'var(--marfil-light)', 'shade-grown': 'var(--verde-light)', 'other': 'var(--marfil-light)',
};

function mapBackendCert(b: BackendCert): IFarmCertification {
  const parts = (b.notes ?? '').split('|');
  const type = parts[0] ?? 'other';
  const name = parts[1] ?? type;
  const expiry = b.expiryDate
    ? new Date(b.expiryDate).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    : '';
  return {
    id:         b.id,
    icon:       CERT_ICONS[type] ?? '🏅',
    iconBg:     CERT_BG[type] ?? 'var(--marfil-light)',
    name,
    body:       `${b.issuer ?? ''} · Vence ${expiry}`,
    validUntil: expiry,
    status:     b.status === 'approved' ? 'valid' : 'expiring',
  };
}

@Injectable({ providedIn: 'root' })
export class FarmService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _farm = signal<IFarm>(EMPTY_FARM);

  readonly farm = this._farm.asReadonly();
  readonly certifications = computed(() => this._farm().certifications ?? []);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendFarm>('/producer/farm').subscribe({
      next:  b => this._farm.set(mapFarm(b)),
      error: () => {},
    });
    this.http.get<BackendCert[]>('/producer/farm/certifications').subscribe({
      next:  list => this._farm.update(f => ({ ...f, certifications: list.map(mapBackendCert) })),
      error: () => {},
    });
  }

  updateFarm(data: Partial<IFarm>): void {
    const current = this._farm();
    const body = {
      name:          data.name ?? current.name,
      municipality:  data.municipality ?? current.municipality,
      department:    data.department ?? current.department,
      altitudeMasl:  parseColNum(data.altitude ?? current.altitude),
      areaHectares:  parseColNum(data.area ?? current.area),
      mainVariety:   data.mainVariety ?? current.mainVariety,
      process:       data.process ?? current.process,
      description:   data.description ?? current.description,
    };
    this.http.patch<BackendFarm>('/producer/farm', body).subscribe({
      next: b => this._farm.update(f => ({ ...mapFarm(b), certifications: f.certifications })),
    });
  }

  addCertification(cert: Omit<ICertification, 'id'>): void {
    this.http.post<BackendCert>('/producer/farm/certifications', {
      type:       cert.type,
      name:       cert.name,
      issuer:     cert.issuer,
      expiryDate: cert.expiryDate,
    }).subscribe({
      next: saved => this._farm.update(f => ({
        ...f, certifications: [...(f.certifications ?? []), mapBackendCert(saved)],
      })),
    });
  }

  removeCertification(id: string): void {
    this.http.delete(`/producer/farm/certifications/${id}`).subscribe({
      next: () => this._farm.update(f => ({
        ...f, certifications: (f.certifications ?? []).filter(c => c.id !== id),
      })),
    });
  }

  private certTypeToIcon(type: CertificationType): string {
    return CERT_ICONS[type] ?? '🏅';
  }

  private certTypeToIconBg(type: CertificationType): string {
    return CERT_BG[type] ?? 'var(--marfil-light)';
  }
}
