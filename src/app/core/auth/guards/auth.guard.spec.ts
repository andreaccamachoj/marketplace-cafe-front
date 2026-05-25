import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    authSpy   = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('returns true when user is authenticated', () => {
    authSpy.isAuthenticated.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeTrue();
  });

  it('redirects to /auth/login when user is not authenticated', () => {
    authSpy.isAuthenticated.and.returnValue(false);
    TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });

  it('returns a UrlTree when not authenticated', () => {
    authSpy.isAuthenticated.and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toEqual({} as UrlTree);
  });
});
