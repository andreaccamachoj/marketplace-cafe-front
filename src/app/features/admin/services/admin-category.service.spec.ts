import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AdminCategoryService } from './admin-category.service';
import { IAdminCategory } from '../models/admin-category.model';

const MOCK_BACKEND_CAT = {
  id: 'cat-1', name: 'Arábica', slug: 'arabica', description: 'Café arábica premium',
  productCount: 5, active: true, createdAt: '2025-01-01', iconEmoji: '☕',
};

const MOCK_CAT: IAdminCategory = {
  id: 'cat-1', name: 'Arábica', slug: 'arabica', description: 'Café arábica premium',
  productCount: 5, active: true, createdAt: '2025-01-01', iconEmoji: '☕',
};

describe('AdminCategoryService', () => {
  let service: AdminCategoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(AdminCategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes all as empty array', () => {
    expect(service.all()).toEqual([]);
  });

  /* ── constructor loads when browser ── */

  it('loads categories from /admin/categories when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminCategoryService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/categories').flush([MOCK_BACKEND_CAT]);
    expect(svc.all().length).toBe(1);
    expect(svc.all()[0].name).toBe('Arábica');
    httpCtrl.verify();
  });

  it('defaults active to true when backend does not send false', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminCategoryService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/categories').flush([{ ...MOCK_BACKEND_CAT, active: undefined }]);
    expect(svc.all()[0].active).toBe(true);
    httpCtrl.verify();
  });

  /* ── add ── */

  it('add() POSTs to /admin/categories and appends to signal', () => {
    service.add({ name: 'Robusta', slug: 'robusta', description: 'Café robusta', active: true, iconEmoji: '🫘' });
    const req = http.expectOne('/admin/categories');
    expect(req.request.method).toBe('POST');
    req.flush({ ...MOCK_BACKEND_CAT, id: 'cat-2', name: 'Robusta' });
    expect(service.all().length).toBe(1);
    expect(service.all()[0].name).toBe('Robusta');
  });

  /* ── update ── */

  it('update() PUTs to /admin/categories/:id and replaces in signal', () => {
    (service as any)._categories.set([MOCK_CAT]);
    service.update('cat-1', { name: 'Arábica Premium' });
    const req = http.expectOne('/admin/categories/cat-1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...MOCK_BACKEND_CAT, name: 'Arábica Premium' });
    expect(service.all()[0].name).toBe('Arábica Premium');
  });

  /* ── toggleActive ── */

  it('toggleActive() does nothing when category not found', () => {
    service.toggleActive('nonexistent');
    http.expectNone('/admin/categories/nonexistent');
  });

  it('toggleActive() calls update with flipped active flag', () => {
    (service as any)._categories.set([MOCK_CAT]);
    service.toggleActive('cat-1');
    const req = http.expectOne('/admin/categories/cat-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.active).toBe(false);
    req.flush({ ...MOCK_BACKEND_CAT, active: false });
    expect(service.all()[0].active).toBe(false);
  });

  /* ── remove ── */

  it('remove() DELETEs /admin/categories/:id and removes from signal', () => {
    (service as any)._categories.set([MOCK_CAT]);
    service.remove('cat-1');
    const req = http.expectOne('/admin/categories/cat-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(service.all().length).toBe(0);
  });
});
