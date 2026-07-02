import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { ProducerApprovalService } from './producer-approval.service';
import { IProducerApproval } from '../models/producer-approval.model';

const MOCK_BACKEND_APPROVAL = {
  id: 'apr-1', producerNameSnapshot: 'Carlos Ramírez', farmNameSnapshot: 'El Edén',
  region: 'Eje Cafetero', department: 'Quindío', submittedAt: '2025-01-10T10:00:00Z',
  status: 'pending', hectares: 5, mainVariety: 'Caturra',
  email: 'carlos@wcm.co', phone: '3109876543',
};

const MOCK_APPROVAL: IProducerApproval = {
  id: 'apr-1', producerName: 'Carlos Ramírez', farmName: 'El Edén',
  region: 'Eje Cafetero', department: 'Quindío', submittedAt: '2025-01-10T10:00:00Z',
  status: 'pending', documents: [], hectares: 5, mainVariety: 'Caturra',
  email: 'carlos@wcm.co', phone: '3109876543',
};

describe('ProducerApprovalService', () => {
  let service: ProducerApprovalService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(ProducerApprovalService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes all as empty array', () => {
    expect(service.all()).toEqual([]);
  });

  it('pending starts as empty array', () => {
    expect(service.pending()).toEqual([]);
  });

  it('pendingCount starts at 0', () => {
    expect(service.pendingCount()).toBe(0);
  });

  /* ── constructor loads when browser ── */

  it('loads approvals from /admin/producer-approvals when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(ProducerApprovalService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/producer-approvals').flush([MOCK_BACKEND_APPROVAL]);
    expect(svc.all().length).toBe(1);
    expect(svc.all()[0].producerName).toBe('Carlos Ramírez');
    expect(svc.all()[0].status).toBe('pending');
    httpCtrl.verify();
  });

  it('maps pending_review backend status to pending', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(ProducerApprovalService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/producer-approvals').flush([{ ...MOCK_BACKEND_APPROVAL, status: 'pending_review' }]);
    expect(svc.all()[0].status).toBe('pending');
    httpCtrl.verify();
  });

  /* ── approve ── */

  it('approve() PATCHes /admin/producer-approvals/:id/approve and updates status', () => {
    (service as any)._approvals.set([MOCK_APPROVAL]);
    service.approve('apr-1', 'admin@wcm.co');
    const req = http.expectOne('/admin/producer-approvals/apr-1/approve');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
    expect(service.all()[0].status).toBe('approved');
    expect(service.all()[0].reviewedAt).toBeDefined();
  });

  /* ── reject ── */

  it('reject() PATCHes /admin/producer-approvals/:id/reject and updates status', () => {
    (service as any)._approvals.set([MOCK_APPROVAL]);
    service.reject('apr-1', 'Documentos incompletos', 'admin@wcm.co');
    const req = http.expectOne('/admin/producer-approvals/apr-1/reject');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ reason: 'Documentos incompletos' });
    req.flush({});
    expect(service.all()[0].status).toBe('rejected');
    expect(service.all()[0].rejectionReason).toBe('Documentos incompletos');
  });

  /* ── getById ── */

  it('getById returns approval by id', () => {
    (service as any)._approvals.set([MOCK_APPROVAL]);
    const found = service.getById('apr-1');
    expect(found).toEqual(MOCK_APPROVAL);
  });

  it('getById returns undefined when id not found', () => {
    expect(service.getById('nonexistent')).toBeUndefined();
  });

  /* ── computed ── */

  it('pending computed filters to only pending approvals', () => {
    (service as any)._approvals.set([
      MOCK_APPROVAL,
      { ...MOCK_APPROVAL, id: 'apr-2', status: 'approved' },
    ]);
    expect(service.pending().length).toBe(1);
    expect(service.pendingCount()).toBe(1);
  });
});
