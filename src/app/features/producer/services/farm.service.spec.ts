import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { FarmService } from './farm.service';
import { IFarm, IFarmCertification } from '../models/farm.model';
import { ICertification } from '../models/certification.model';

const MOCK_BACKEND_FARM = {
  id: 'farm-1', name: 'Finca El Edén', municipality: 'Salento',
  department: 'Quindío', altitudeMasl: 1800, areaHectares: 5,
  mainVariety: 'Caturra', process: 'Lavado', description: 'Finca ecológica',
  treeCount: 5000, harvestSeason: 'Oct-Dic', annualProductionSacos: 100,
  yieldPerHa: 20, cuppingScore: 85,
};

const MOCK_BACKEND_CERT = {
  id: 'cert-1', farmId: 'farm-1', certificationId: 1,
  issuer: 'BCS Öko-Garantie', expiryDate: '2026-06-30',
  status: 'approved', notes: 'organic|Orgánico BCS',
};

const MOCK_CERT_PAYLOAD: Omit<ICertification, 'id'> = {
  type: 'organic', name: 'Orgánico', issuer: 'BCS', issueDate: '2024-01-01',
  expiryDate: '2026-06-30', status: 'vigente',
};

describe('FarmService', () => {
  let service: FarmService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(FarmService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes farm with empty defaults', () => {
    expect(service.farm().id).toBe('');
    expect(service.farm().name).toBe('');
  });

  it('certifications computed returns empty array by default', () => {
    expect(service.certifications()).toEqual([]);
  });

  /* ── constructor loads when browser ── */

  it('loads farm and certifications from API when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(FarmService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/producer/farm').flush(MOCK_BACKEND_FARM);
    httpCtrl.expectOne('/producer/farm/certifications').flush([MOCK_BACKEND_CERT]);
    expect(svc.farm().name).toBe('Finca El Edén');
    expect(svc.certifications().length).toBe(1);
    httpCtrl.verify();
  });

  /* ── updateFarm ── */

  it('updateFarm() PATCHes /producer/farm and updates signal', () => {
    (service as any)._farm.set({ ...service.farm(), name: 'Vieja Finca', certifications: [] });
    service.updateFarm({ name: 'Finca El Edén', municipality: 'Salento', department: 'Quindío' });
    const req = http.expectOne('/producer/farm');
    expect(req.request.method).toBe('PATCH');
    req.flush(MOCK_BACKEND_FARM);
    expect(service.farm().name).toBe('Finca El Edén');
    expect(service.farm().municipality).toBe('Salento');
  });

  it('updateFarm() preserves certifications after update', () => {
    const cert: IFarmCertification = {
      id: 'c-1', icon: '🌿', iconBg: 'green', name: 'Orgánico',
      body: 'BCS · Vence jun. 2026', validUntil: 'jun. 2026', status: 'valid',
    };
    (service as any)._farm.set({ ...service.farm(), certifications: [cert] });
    service.updateFarm({ name: 'Nueva Finca' });
    http.expectOne('/producer/farm').flush(MOCK_BACKEND_FARM);
    expect(service.farm().certifications.length).toBe(1);
    expect(service.farm().certifications[0].id).toBe('c-1');
  });

  /* ── addCertification ── */

  it('addCertification() POSTs to /producer/farm/certifications and appends', () => {
    service.addCertification(MOCK_CERT_PAYLOAD);
    const req = http.expectOne('/producer/farm/certifications');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.type).toBe('organic');
    req.flush(MOCK_BACKEND_CERT);
    expect(service.certifications().length).toBe(1);
    expect(service.certifications()[0].id).toBe('cert-1');
  });

  it('addCertification() maps issuer and expiry to body string', () => {
    service.addCertification(MOCK_CERT_PAYLOAD);
    http.expectOne('/producer/farm/certifications').flush(MOCK_BACKEND_CERT);
    expect(service.certifications()[0].name).toBe('Orgánico BCS');
  });

  /* ── removeCertification ── */

  it('removeCertification() DELETEs /producer/farm/certifications/:id and removes from signal', () => {
    const cert: IFarmCertification = {
      id: 'cert-1', icon: '🌿', iconBg: 'green', name: 'Orgánico',
      body: 'BCS', validUntil: 'jun. 2026', status: 'valid',
    };
    (service as any)._farm.update((f: IFarm) => ({ ...f, certifications: [cert] }));
    service.removeCertification('cert-1');
    const req = http.expectOne('/producer/farm/certifications/cert-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(service.certifications().length).toBe(0);
  });

  /* ── certifications computed ── */

  it('certifications reflects farm.certifications signal', () => {
    const cert: IFarmCertification = {
      id: 'c-1', icon: '🌿', iconBg: 'green', name: 'Orgánico',
      body: 'body', validUntil: 'jun. 2026', status: 'valid',
    };
    (service as any)._farm.update((f: IFarm) => ({ ...f, certifications: [cert] }));
    expect(service.certifications().length).toBe(1);
  });

  /* ── farm data mapping ── */

  it('updateFarm() formats altitude and area with locale strings', () => {
    service.updateFarm({ name: 'Test', municipality: 'Salento', department: 'Quindío' });
    http.expectOne('/producer/farm').flush(MOCK_BACKEND_FARM);
    expect(service.farm().altitude).toContain('msnm');
    expect(service.farm().area).toContain('hectáreas');
  });
});
