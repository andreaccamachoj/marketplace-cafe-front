import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let svc: TokenStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    svc = TestBed.inject(TokenStorageService);
  });

  afterEach(() => localStorage.clear());

  describe('token', () => {
    it('getToken returns null when nothing stored', () => {
      expect(svc.getToken()).toBeNull();
    });

    it('setToken / getToken round-trip', () => {
      svc.setToken('abc123');
      expect(svc.getToken()).toBe('abc123');
    });

    it('removeToken clears stored token', () => {
      svc.setToken('abc123');
      svc.removeToken();
      expect(svc.getToken()).toBeNull();
    });
  });

  describe('user', () => {
    const user = { id: '1', name: 'Test' };

    it('getUser returns null when nothing stored', () => {
      expect(svc.getUser()).toBeNull();
    });

    it('setUser / getUser round-trip', () => {
      svc.setUser(user);
      expect(svc.getUser<typeof user>()).toEqual(user);
    });

    it('removeUser clears stored user', () => {
      svc.setUser(user);
      svc.removeUser();
      expect(svc.getUser()).toBeNull();
    });
  });

  describe('clear', () => {
    it('removes both token and user', () => {
      svc.setToken('tok');
      svc.setUser({ id: '1' });
      svc.clear();
      expect(svc.getToken()).toBeNull();
      expect(svc.getUser()).toBeNull();
    });
  });

  describe('server platform', () => {
    let serverSvc: TokenStorageService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      serverSvc = TestBed.inject(TokenStorageService);
    });

    it('setToken is a no-op on server', () => {
      serverSvc.setToken('x');
      expect(localStorage.getItem('wcm_token')).toBeNull();
    });

    it('getToken returns null on server', () => {
      expect(serverSvc.getToken()).toBeNull();
    });

    it('getUser returns null on server', () => {
      expect(serverSvc.getUser()).toBeNull();
    });
  });
});
