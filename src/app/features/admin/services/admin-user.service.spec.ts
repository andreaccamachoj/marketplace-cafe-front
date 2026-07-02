import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AdminUserService } from './admin-user.service';
import { IAdminUser } from '../models/admin-user.model';

const MOCK_BACKEND_USER = {
  id: 'u-1', fullName: 'Ana García', email: 'ana@wcm.co',
  role: 'buyer', status: 'active', createdAt: '2025-01-10T10:00:00Z',
};

const MOCK_USER: IAdminUser = {
  id: 'u-1', fullName: 'Ana García', email: 'ana@wcm.co',
  role: 'buyer', status: 'active', joinedAt: '2025-01-10T10:00:00Z',
  avatarInitials: 'AG',
};

describe('AdminUserService', () => {
  let service: AdminUserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(AdminUserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes all as empty array', () => {
    expect(service.all()).toEqual([]);
  });

  it('activeCount starts at 0', () => {
    expect(service.activeCount()).toBe(0);
  });

  it('suspendedCount starts at 0', () => {
    expect(service.suspendedCount()).toBe(0);
  });

  /* ── constructor loads when browser ── */

  it('loads users from /admin/users when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminUserService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/users').flush([MOCK_BACKEND_USER]);
    expect(svc.all().length).toBe(1);
    expect(svc.all()[0].fullName).toBe('Ana García');
    expect(svc.all()[0].avatarInitials).toBe('AG');
    httpCtrl.verify();
  });

  it('maps backend status "banned" to suspended', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminUserService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/users').flush([{ ...MOCK_BACKEND_USER, status: 'banned' }]);
    expect(svc.all()[0].status).toBe('suspended');
    httpCtrl.verify();
  });

  /* ── suspend ── */

  it('suspend() PATCHes /admin/users/:id/ban and updates signal', () => {
    (service as any)._users.set([MOCK_USER]);
    service.suspend('u-1');
    const req = http.expectOne('/admin/users/u-1/ban');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
    expect(service.all()[0].status).toBe('suspended');
  });

  /* ── reactivate ── */

  it('reactivate() PATCHes /admin/users/:id/unban and updates signal', () => {
    (service as any)._users.set([{ ...MOCK_USER, status: 'suspended' }]);
    service.reactivate('u-1');
    const req = http.expectOne('/admin/users/u-1/unban');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
    expect(service.all()[0].status).toBe('active');
  });

  /* ── getByRole ── */

  it('getByRole filters users by role', () => {
    (service as any)._users.set([
      MOCK_USER,
      { ...MOCK_USER, id: 'u-2', role: 'producer' },
    ]);
    expect(service.getByRole('buyer').length).toBe(1);
    expect(service.getByRole('producer').length).toBe(1);
    expect(service.getByRole('admin').length).toBe(0);
  });

  /* ── computed ── */

  it('activeCount counts active users', () => {
    (service as any)._users.set([
      MOCK_USER,
      { ...MOCK_USER, id: 'u-2', status: 'suspended' },
    ]);
    expect(service.activeCount()).toBe(1);
    expect(service.suspendedCount()).toBe(1);
  });
});
