import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AdminActivityService } from './admin-activity.service';
import { IActivityItem } from '../models/activity.model';

const MOCK_BACKEND_ACTIVITY = {
  id: 'act-1', action: 'user_registered', title: 'Nuevo usuario registrado',
  description: 'Ana García se registró.', createdAt: '2025-01-10T10:00:00Z',
  actorName: 'Ana García',
};

describe('AdminActivityService', () => {
  let service: AdminActivityService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(AdminActivityService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes all as empty array', () => {
    expect(service.all()).toEqual([]);
  });

  it('recent starts as empty array', () => {
    expect(service.recent()).toEqual([]);
  });

  /* ── constructor loads when browser ── */

  it('loads activity from /admin/activity when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const svc = TestBed.inject(AdminActivityService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/admin/activity').flush([MOCK_BACKEND_ACTIVITY]);
    expect(svc.all().length).toBe(1);
    expect(svc.all()[0].type).toBe('user_registered');
    expect(svc.all()[0].actorName).toBe('Ana García');
    expect(svc.all()[0].iconEmoji).toBe('📋');
    expect(svc.all()[0].severity).toBe('info');
    httpCtrl.verify();
  });

  /* ── recent computed ── */

  it('recent returns at most 5 items', () => {
    const items: IActivityItem[] = Array.from({ length: 8 }, (_, i) => ({
      id: `act-${i}`, type: 'user_registered' as const, title: `Act ${i}`,
      description: '', timestamp: '', actorName: '', iconEmoji: '📋', severity: 'info' as const,
    }));
    (service as any)._items.set(items);
    expect(service.recent().length).toBe(5);
  });

  it('all reflects full list even when more than 5 items', () => {
    const items: IActivityItem[] = Array.from({ length: 8 }, (_, i) => ({
      id: `act-${i}`, type: 'user_registered' as const, title: `Act ${i}`,
      description: '', timestamp: '', actorName: '', iconEmoji: '📋', severity: 'info' as const,
    }));
    (service as any)._items.set(items);
    expect(service.all().length).toBe(8);
  });

  it('addItem is a no-op (server-side only)', () => {
    service.addItem({
      type: 'user_registered', title: 'Test', description: '',
      timestamp: '', actorName: '', iconEmoji: '📋', severity: 'info',
    });
    expect(service.all().length).toBe(0);
  });
});
