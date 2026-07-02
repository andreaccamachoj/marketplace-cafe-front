import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from '../../services/notification.service';
import { Role } from '../models/role.enum';
import { ProducerStatus } from '../models/producer-status.enum';
import { IUser } from '../models/user.model';

function makeJwt(sub: string, email: string, role: string): string {
  const payload = btoa(JSON.stringify({ sub, email, role }));
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
}

const BACKEND_USER = {
  id: 'u1',
  email: 'buyer@test.com',
  fullName: 'Test Buyer',
  phone: '123',
  status: 'active',
  createdAt: '2025-01-01',
};

const MOCK_USER: IUser = {
  id: 'u1',
  email: 'buyer@test.com',
  fullName: 'Test Buyer',
  phone: '123',
  roles: [Role.BUYER],
  status: 'active',
  createdAt: '2025-01-01',
};

describe('AuthService', () => {
  let svc: AuthService;
  let httpCtrl: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<TokenStorageService>;
  let notifySpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    routerSpy  = jasmine.createSpyObj('Router', ['navigate']);
    storageSpy = jasmine.createSpyObj('TokenStorageService', [
      'getToken', 'setToken', 'removeToken',
      'getUser', 'setUser', 'removeUser', 'clear',
    ]);
    notifySpy = jasmine.createSpyObj('NotificationService', ['info', 'success', 'error', 'warning']);

    storageSpy.getUser.and.returnValue(null);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: TokenStorageService, useValue: storageSpy },
        { provide: NotificationService, useValue: notifySpy },
      ],
    });
    svc     = TestBed.inject(AuthService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpCtrl.verify());

  describe('initial state', () => {
    it('isAuthenticated is false when no stored user', () => {
      expect(svc.isAuthenticated()).toBeFalse();
    });

    it('currentUser is null initially', () => {
      expect(svc.currentUser()).toBeNull();
    });

    it('currentRole is null initially', () => {
      expect(svc.currentRole()).toBeNull();
    });
  });

  describe('login()', () => {
    it('stores token, sets user, and navigates by role', fakeAsync(() => {
      const jwt = makeJwt('u1', 'buyer@test.com', 'buyer');
      svc.login({ email: 'buyer@test.com', password: 'pass' });

      httpCtrl.expectOne('/auth/login').flush({ accessToken: jwt, refreshToken: 'r' });
      flushMicrotasks();

      httpCtrl.expectOne('/auth/me').flush(BACKEND_USER);
      flushMicrotasks();

      expect(storageSpy.setToken).toHaveBeenCalledWith(jwt);
      expect(storageSpy.setUser).toHaveBeenCalled();
      expect(svc.isAuthenticated()).toBeTrue();
      expect(svc.currentRole()).toBe(Role.BUYER);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/panel/comprador']);
    }));

    it('navigates to /panel/productor for producer role', fakeAsync(() => {
      const jwt = makeJwt('u2', 'prod@test.com', 'producer');
      svc.login({ email: 'prod@test.com', password: 'pass' });

      httpCtrl.expectOne('/auth/login').flush({ accessToken: jwt, refreshToken: 'r' });
      flushMicrotasks();

      httpCtrl.expectOne('/auth/me').flush({ ...BACKEND_USER, email: 'prod@test.com' });
      flushMicrotasks();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/panel/productor']);
    }));

    it('navigates to /panel/admin for admin role', fakeAsync(() => {
      const jwt = makeJwt('u3', 'admin@test.com', 'admin');
      svc.login({ email: 'admin@test.com', password: 'pass' });

      httpCtrl.expectOne('/auth/login').flush({ accessToken: jwt, refreshToken: 'r' });
      flushMicrotasks();

      httpCtrl.expectOne('/auth/me').flush({ ...BACKEND_USER, email: 'admin@test.com' });
      flushMicrotasks();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/panel/admin']);
    }));
  });

  describe('register()', () => {
    it('posts to /auth/register/buyer for buyer role', fakeAsync(() => {
      const jwt = makeJwt('u1', 'new@test.com', 'buyer');
      svc.register({ fullName: 'N', email: 'new@test.com', password: 'p', role: 'buyer' });

      const req = httpCtrl.expectOne('/auth/register/buyer');
      expect(req.request.method).toBe('POST');
      req.flush({ accessToken: jwt, refreshToken: 'r' });
      flushMicrotasks();

      httpCtrl.expectOne('/auth/me').flush(BACKEND_USER);
      flushMicrotasks();
    }));

    it('posts to /auth/register/producer for producer role', fakeAsync(() => {
      const jwt = makeJwt('u2', 'p@test.com', 'producer');
      svc.register({ fullName: 'N', email: 'p@test.com', password: 'p', role: 'producer' });

      const req = httpCtrl.expectOne('/auth/register/producer');
      expect(req.request.method).toBe('POST');
      req.flush({ accessToken: jwt, refreshToken: 'r' });
      flushMicrotasks();

      httpCtrl.expectOne('/auth/me').flush({ ...BACKEND_USER, email: 'p@test.com' });
      flushMicrotasks();
    }));
  });

  describe('logout()', () => {
    it('clears storage, resets user and navigates to login', () => {
      svc.currentUser.set(MOCK_USER);
      svc.logout();
      expect(storageSpy.clear).toHaveBeenCalled();
      expect(svc.currentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('recoverPassword()', () => {
    it('posts to /auth/password-reset/request and shows info toast', fakeAsync(() => {
      svc.recoverPassword('user@test.com');

      httpCtrl.expectOne('/auth/password-reset/request').flush({});
      flushMicrotasks();

      expect(notifySpy.info).toHaveBeenCalled();
    }));
  });

  describe('hasRole()', () => {
    it('returns true when user has the role', () => {
      svc.currentUser.set(MOCK_USER);
      expect(svc.hasRole(Role.BUYER)).toBeTrue();
    });

    it('returns false when user does not have the role', () => {
      svc.currentUser.set(MOCK_USER);
      expect(svc.hasRole(Role.ADMIN)).toBeFalse();
    });

    it('returns false when no user', () => {
      expect(svc.hasRole(Role.BUYER)).toBeFalse();
    });
  });

  describe('isProducerApproved()', () => {
    it('returns true when producerStatus is APPROVED', () => {
      svc.currentUser.set({ ...MOCK_USER, producerStatus: ProducerStatus.APPROVED });
      expect(svc.isProducerApproved()).toBeTrue();
    });

    it('returns false when producerStatus is PENDING', () => {
      svc.currentUser.set({ ...MOCK_USER, producerStatus: ProducerStatus.PENDING });
      expect(svc.isProducerApproved()).toBeFalse();
    });
  });

  describe('updateProfile()', () => {
    it('merges patch into current user', () => {
      svc.currentUser.set(MOCK_USER);
      svc.updateProfile({ fullName: 'New Name' });
      expect(svc.currentUser()?.fullName).toBe('New Name');
    });

    it('persists updated user to storage', () => {
      svc.currentUser.set(MOCK_USER);
      svc.updateProfile({ phone: '999' });
      expect(storageSpy.setUser).toHaveBeenCalled();
    });

    it('is a no-op when currentUser is null', () => {
      svc.updateProfile({ fullName: 'X' });
      expect(svc.currentUser()).toBeNull();
    });
  });

  describe('changePassword()', () => {
    it('patches /auth/me/password with old and new passwords', () => {
      svc.changePassword('old', 'new$Pass1').subscribe();
      const req = httpCtrl.expectOne('/auth/me/password');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ oldPassword: 'old', newPassword: 'new$Pass1' });
      req.flush(null);
    });
  });

  describe('isBuyer computed', () => {
    it('returns true when currentRole is BUYER', () => {
      svc.currentUser.set(MOCK_USER);
      expect(svc.isBuyer()).toBeTrue();
    });

    it('returns false when currentRole is not BUYER', () => {
      svc.currentUser.set({ ...MOCK_USER, roles: [Role.ADMIN] });
      expect(svc.isBuyer()).toBeFalse();
    });
  });

  describe('mapStatus (via login flow)', () => {
    it('maps "banned" backend status to "suspended"', fakeAsync(() => {
      const jwt = makeJwt('u1', 'buyer@test.com', 'buyer');
      svc.login({ email: 'buyer@test.com', password: 'pass' });

      httpCtrl.expectOne('/auth/login').flush({ accessToken: jwt, refreshToken: 'r' });
      flushMicrotasks();

      httpCtrl.expectOne('/auth/me').flush({ ...BACKEND_USER, status: 'banned' });
      flushMicrotasks();

      expect(svc.currentUser()?.status).toBe('suspended');
    }));
  });
});
