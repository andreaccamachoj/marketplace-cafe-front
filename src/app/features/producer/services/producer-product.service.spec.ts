import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { ProducerProductService } from './producer-product.service';
import { IManagedProduct } from '../models/managed-product.model';

const MOCK_BACKEND_PRODUCT = {
  id: 'p-1', name: 'Café Sierra Nevada', emoji: '☕', categoryName: 'Arábica',
  categoryId: 'cat-1', description: 'Excelente café', region: 'Sierra Nevada',
  unit: '500g', status: 'active', price: 45000, stock: 100,
  certificationCodes: ['organic'], rating: 4.5, reviewCount: 12, soldCount: 50,
};

const MOCK_PRODUCT: IManagedProduct = {
  id: 'p-1', name: 'Café Sierra Nevada', emoji: '☕', category: 'Arábica',
  categoryId: 'cat-1', description: 'Excelente café', region: 'Sierra Nevada',
  unit: '500g', status: 'active', price: 45000, stock: 100,
  certifications: ['organic'], rating: 4.5, reviewCount: 12, salesCount: 50,
};

describe('ProducerProductService', () => {
  let service: ProducerProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ProducerProductService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne('/producer/products').flush([]);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes products as empty array', () => {
    expect(service.products()).toEqual([]);
  });

  /* ── load ── */

  it('load() GETs /producer/products and populates signal', () => {
    service.load();
    const req = http.expectOne('/producer/products');
    expect(req.request.method).toBe('GET');
    req.flush([MOCK_BACKEND_PRODUCT]);
    expect(service.products().length).toBe(1);
    expect(service.products()[0].name).toBe('Café Sierra Nevada');
  });

  it('load() sets products to empty then fills from response', () => {
    (service as any)._products.set([MOCK_PRODUCT]);
    service.load();
    http.expectOne('/producer/products').flush([]);
    expect(service.products().length).toBe(0);
  });

  /* ── add ── */

  it('add() POSTs to /producer/products and appends to signal', () => {
    service.add({ name: 'Nuevo Café', price: 30000, unit: '250g' });
    const req = http.expectOne('/producer/products');
    expect(req.request.method).toBe('POST');
    req.flush(MOCK_BACKEND_PRODUCT);
    expect(service.products().length).toBe(1);
  });

  /* ── update ── */

  it('update() PUTs to /producer/products/:id and replaces in signal', () => {
    (service as any)._products.set([MOCK_PRODUCT]);
    service.update('p-1', { price: 50000 });
    const req = http.expectOne('/producer/products/p-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...MOCK_BACKEND_PRODUCT, price: 50000 });
    expect(service.products()[0].price).toBe(50000);
  });

  /* ── cover image ── */

  it('add() with a cover file uploads it after creating the product', () => {
    const file = new File([new Uint8Array(4)], 'cover.png', { type: 'image/png' });
    service.add({ name: 'Nuevo Café', price: 30000, unit: '250g' }, file);

    const createReq = http.expectOne('/producer/products');
    expect(createReq.request.method).toBe('POST');
    createReq.flush(MOCK_BACKEND_PRODUCT);

    const coverReq = http.expectOne('/producer/products/p-1/cover');
    expect(coverReq.request.method).toBe('POST');
    expect(coverReq.request.body instanceof FormData).toBe(true);
    coverReq.flush(MOCK_BACKEND_PRODUCT);

    expect(service.products().length).toBe(1);
  });

  it('add() without a cover file does not call the cover endpoint', () => {
    service.add({ name: 'Nuevo Café', price: 30000, unit: '250g' });
    http.expectOne('/producer/products').flush(MOCK_BACKEND_PRODUCT);
    http.expectNone('/producer/products/p-1/cover');
    expect(service.products().length).toBe(1);
  });

  it('update() with a cover file uploads it after updating the product', () => {
    (service as any)._products.set([MOCK_PRODUCT]);
    const file = new File([new Uint8Array(4)], 'cover.jpg', { type: 'image/jpeg' });
    service.update('p-1', { price: 50000 }, file);

    http.expectOne('/producer/products/p-1').flush({ ...MOCK_BACKEND_PRODUCT, price: 50000 });

    const coverReq = http.expectOne('/producer/products/p-1/cover');
    expect(coverReq.request.method).toBe('POST');
    coverReq.flush({ ...MOCK_BACKEND_PRODUCT, price: 50000 });

    expect(service.products()[0].price).toBe(50000);
  });

  it('uploadCover() POSTs FormData and maps the product', () => {
    const file = new File([new Uint8Array(4)], 'cover.png', { type: 'image/png' });
    let result: IManagedProduct | undefined;
    service.uploadCover('p-1', file).subscribe(p => (result = p));
    const req = http.expectOne('/producer/products/p-1/cover');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(MOCK_BACKEND_PRODUCT);
    expect(result!.id).toBe('p-1');
  });

  it('deleteCover() DELETEs the cover endpoint and maps the product', () => {
    let result: IManagedProduct | undefined;
    service.deleteCover('p-1').subscribe(p => (result = p));
    const req = http.expectOne('/producer/products/p-1/cover');
    expect(req.request.method).toBe('DELETE');
    req.flush(MOCK_BACKEND_PRODUCT);
    expect(result!.id).toBe('p-1');
  });

  /* ── remove ── */

  it('remove() removes product from signal immediately (no HTTP)', () => {
    (service as any)._products.set([MOCK_PRODUCT]);
    service.remove('p-1');
    expect(service.products().length).toBe(0);
    http.expectNone('/producer/products/p-1');
  });

  /* ── toggleStatus ── */

  it('toggleStatus() archives an active product via POST', () => {
    (service as any)._products.set([MOCK_PRODUCT]);
    service.toggleStatus('p-1');
    const req = http.expectOne('/producer/products/p-1/archive');
    expect(req.request.method).toBe('POST');
    req.flush({});
    expect(service.products()[0].status).toBe('inactive');
  });

  it('toggleStatus() does nothing when product not found', () => {
    service.toggleStatus('nonexistent');
    http.expectNone('/producer/products/nonexistent/archive');
  });

  /* ── computed ── */

  it('activeCount counts active products', () => {
    (service as any)._products.set([
      MOCK_PRODUCT,
      { ...MOCK_PRODUCT, id: 'p-2', status: 'draft' },
    ]);
    expect(service.activeCount()).toBe(1);
  });

  it('pendingCount counts draft products', () => {
    (service as any)._products.set([
      MOCK_PRODUCT,
      { ...MOCK_PRODUCT, id: 'p-2', status: 'draft' },
      { ...MOCK_PRODUCT, id: 'p-3', status: 'draft' },
    ]);
    expect(service.pendingCount()).toBe(2);
  });
});
