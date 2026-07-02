import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AdminProductService, IAdminProduct } from './admin-product.service';

const MOCK_BACKEND_PRODUCT = {
  id: 'p-1', emoji: '☕', name: 'Café Sierra', categoryName: 'Arábica',
  producerName: 'Carlos Ramírez', price: 45000, stock: 100, status: 'active',
};

const MOCK_PRODUCT: IAdminProduct = {
  id: 'p-1', emoji: '☕', name: 'Café Sierra', category: 'Arábica',
  producer: 'Carlos Ramírez', price: 45000, stock: 100, status: 'active',
};

describe('AdminProductService', () => {
  let service: AdminProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(AdminProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes all as empty array', () => {
    expect(service.all()).toEqual([]);
  });

  it('pendingCount starts at 0', () => {
    expect(service.pendingCount()).toBe(0);
  });

  /* ── constructor loads when browser ── */

  it('loads products from /admin/products when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminProductService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/products').flush([MOCK_BACKEND_PRODUCT]);
    expect(svc.all().length).toBe(1);
    expect(svc.all()[0].name).toBe('Café Sierra');
    expect(svc.all()[0].category).toBe('Arábica');
    httpCtrl.verify();
  });

  it('maps unknown status to draft', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminProductService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/products').flush([{ ...MOCK_BACKEND_PRODUCT, status: 'unknown_status' }]);
    expect(svc.all()[0].status).toBe('draft');
    httpCtrl.verify();
  });

  /* ── activate ── */

  it('activate() PATCHes /admin/products/:id/activate and updates signal', () => {
    (service as any)._products.set([{ ...MOCK_PRODUCT, status: 'draft' }]);
    service.activate('p-1');
    const req = http.expectOne('/admin/products/p-1/activate');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
    expect(service.all()[0].status).toBe('active');
  });

  /* ── pendingCount computed ── */

  it('pendingCount counts draft products', () => {
    (service as any)._products.set([
      MOCK_PRODUCT,
      { ...MOCK_PRODUCT, id: 'p-2', status: 'draft' },
      { ...MOCK_PRODUCT, id: 'p-3', status: 'draft' },
    ]);
    expect(service.pendingCount()).toBe(2);
  });

  it('all computed reflects current signal', () => {
    (service as any)._products.set([MOCK_PRODUCT]);
    expect(service.all().length).toBe(1);
  });
});
