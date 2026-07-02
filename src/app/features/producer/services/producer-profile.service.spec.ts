import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { ProducerProfileService } from './producer-profile.service';
import { AuthService } from '@core/auth/services/auth.service';
import { IProducerProfile, IProducerProfilePayload } from '../models/producer-profile.model';

const MOCK_PROFILE: IProducerProfile = {
  id: 'prod-1', fullName: 'Carlos Ramírez', email: 'producer@wcm.co',
  phone: '3109876543', city: 'Medellín', department: 'Antioquia',
  bio: 'Caficultor con 15 años de experiencia.', avatarInitials: 'CR',
};

describe('ProducerProfileService', () => {
  let service: ProducerProfileService;
  let http: HttpTestingController;
  let authSvc: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authSvc = jasmine.createSpyObj('AuthService', ['updateProfile']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: AuthService, useValue: authSvc },
      ],
    });
    service = TestBed.inject(ProducerProfileService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes profile with empty defaults', () => {
    expect(service.profile().id).toBe('');
    expect(service.profile().fullName).toBe('');
  });

  /* ── constructor loads profile when browser ── */

  it('loads profile from /profile/producer when platform is browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: authSvc },
      ],
    });
    const svc = TestBed.inject(ProducerProfileService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/profile/producer').flush(MOCK_PROFILE);
    expect(svc.profile().fullName).toBe('Carlos Ramírez');
    httpCtrl.verify();
  });

  it('calls auth.updateProfile with producerStatus when profile has status', () => {
    TestBed.resetTestingModule();
    const authSpied = jasmine.createSpyObj('AuthService', ['updateProfile']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: authSpied },
      ],
    });
    const svc = TestBed.inject(ProducerProfileService);
    const httpCtrl = TestBed.inject(HttpTestingController);
    httpCtrl.expectOne('/profile/producer').flush({ ...MOCK_PROFILE, status: 'approved' });
    expect(authSpied.updateProfile).toHaveBeenCalledWith({ producerStatus: 'approved' as any });
    httpCtrl.verify();
  });

  /* ── update ── */

  it('update() PATCHes /profile/producer with avatarInitials and updates signal', () => {
    const payload: IProducerProfilePayload = {
      fullName: 'Carlos Ramírez', phone: '3109876543',
      city: 'Medellín', department: 'Antioquia',
      bio: 'Caficultor con 15 años.',
    };
    let result!: IProducerProfile;
    service.update(payload).subscribe(p => (result = p));
    const req = http.expectOne('/profile/producer');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.avatarInitials).toBe('CR');
    req.flush(MOCK_PROFILE);
    expect(service.profile().fullName).toBe('Carlos Ramírez');
    expect(result).toEqual(MOCK_PROFILE);
    expect(authSvc.updateProfile).toHaveBeenCalledWith({
      fullName: 'Carlos Ramírez', phone: '3109876543',
    });
  });

  it('update() computes avatarInitials correctly from fullName', () => {
    const payload: IProducerProfilePayload = {
      fullName: 'Juan Alberto Reyes', phone: '', city: '', department: '', bio: '',
    };
    service.update(payload).subscribe();
    const req = http.expectOne('/profile/producer');
    expect(req.request.body.avatarInitials).toBe('JA');
    req.flush(MOCK_PROFILE);
  });

  it('profile() returns current signal value', () => {
    (service as any)._profile.set(MOCK_PROFILE);
    expect(service.profile()).toEqual(MOCK_PROFILE);
  });
});
