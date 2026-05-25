import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

describe('roleGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const state = {} as RouterStateSnapshot;

  function makeRoute(role?: Role): ActivatedRouteSnapshot {
    return { data: role ? { role } : {} } as unknown as ActivatedRouteSnapshot;
  }

  beforeEach(() => {
    authSpy   = jasmine.createSpyObj('AuthService', ['hasRole']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('returns true when user has the required role', () => {
    authSpy.hasRole.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => roleGuard(makeRoute(Role.BUYER), state));
    expect(result).toBeTrue();
  });

  it('redirects to / when user does not have the required role', () => {
    authSpy.hasRole.and.returnValue(false);
    TestBed.runInInjectionContext(() => roleGuard(makeRoute(Role.ADMIN), state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('returns true when no requiredRole is set on route data', () => {
    const result = TestBed.runInInjectionContext(() => roleGuard(makeRoute(), state));
    expect(result).toBeTrue();
  });

  it('calls hasRole with the role from route data', () => {
    authSpy.hasRole.and.returnValue(true);
    TestBed.runInInjectionContext(() => roleGuard(makeRoute(Role.PRODUCER), state));
    expect(authSpy.hasRole).toHaveBeenCalledWith(Role.PRODUCER);
  });
});
