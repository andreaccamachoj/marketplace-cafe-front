import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { BuyerProfileService } from './buyer-profile.service';
import { IBuyerProfile } from '../models/buyer-profile.model';

const mockProfile: IBuyerProfile = {
  id: 'u1', fullName: 'Juan Pérez', email: 'juan@test.com', phone: '3001234567',
  city: 'Bogotá', department: 'Cundinamarca', preferredPayment: 'transfer',
  newsletterOptIn: true, avatarInitials: 'JP',
};

describe('BuyerProfileService', () => {
  let service: BuyerProfileService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BuyerProfileService);
    http.expectOne('/profile/buyer').flush(mockProfile);
  });

  afterEach(() => http.verify());

  it('loads profile on init', () => {
    expect(service.profile().id).toBe('u1');
    expect(service.profile().fullName).toBe('Juan Pérez');
  });

  it('update() patches /profile/buyer and updates signal', () => {
    const payload = {
      fullName: 'Ana López', phone: '3009876543',
      city: 'Medellín', department: 'Antioquia', preferredPayment: 'card' as const,
      newsletterOptIn: false,
    };
    let result: IBuyerProfile | undefined;
    service.update(payload).subscribe(p => result = p);
    const req = http.expectOne('/profile/buyer');
    expect(req.request.method).toBe('PATCH');
    const updated: IBuyerProfile = { id: 'u1', email: 'ana@test.com', ...payload, avatarInitials: 'AL' };
    req.flush(updated);
    expect(service.profile().fullName).toBe('Ana López');
    expect(result?.avatarInitials).toBe('AL');
  });

  it('update() sends computed avatarInitials in request body', () => {
    const payload = {
      fullName: 'Carlos Ruiz', phone: '300',
      city: 'Cali', department: 'Valle', preferredPayment: 'card' as const, newsletterOptIn: true,
    };
    service.update(payload).subscribe();
    const req = http.expectOne('/profile/buyer');
    expect(req.request.body['avatarInitials']).toBe('CR');
    req.flush({ id: 'u1', email: 'c@test.com', ...payload, avatarInitials: 'CR' });
  });

  it('update() handles single-word name', () => {
    const payload = {
      fullName: 'Juanita', phone: '300',
      city: 'Cali', department: 'Valle', preferredPayment: 'card' as const, newsletterOptIn: false,
    };
    service.update(payload).subscribe();
    const req = http.expectOne('/profile/buyer');
    expect(req.request.body['avatarInitials']).toBe('J');
    req.flush({ id: 'u1', email: 'j@test.com', ...payload, avatarInitials: 'J' });
  });

  it('profile() starts with empty profile before load', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    const svc = TestBed.inject(BuyerProfileService);
    expect(svc.profile().id).toBe('');
    expect(svc.profile().fullName).toBe('');
  });
});
