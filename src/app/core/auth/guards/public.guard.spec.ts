import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { signal } from '@angular/core';
import { publicGuard } from './public.guard';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

describe('publicGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function setup(isAuthenticated: boolean, role: Role | null = null) {
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    const authStub = {
      isAuthenticated: signal(isAuthenticated),
      currentRole: signal(role),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: Router, useValue: routerSpy },
      ],
    });
  }

  it('returns true when user is NOT authenticated', () => {
    setup(false);
    const result = TestBed.runInInjectionContext(() => publicGuard(route, state));
    expect(result).toBeTrue();
  });

  it('redirects buyer to /panel/comprador', () => {
    setup(true, Role.BUYER);
    TestBed.runInInjectionContext(() => publicGuard(route, state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/panel/comprador']);
  });

  it('redirects producer to /panel/productor', () => {
    setup(true, Role.PRODUCER);
    TestBed.runInInjectionContext(() => publicGuard(route, state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/panel/productor']);
  });

  it('redirects admin to /panel/admin', () => {
    setup(true, Role.ADMIN);
    TestBed.runInInjectionContext(() => publicGuard(route, state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/panel/admin']);
  });

  it('redirects to / when role is unknown', () => {
    setup(true, null);
    TestBed.runInInjectionContext(() => publicGuard(route, state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});
