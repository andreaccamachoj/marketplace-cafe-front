import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { signal } from '@angular/core';
import { producerApprovedGuard } from './producer-approved.guard';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../services/notification.service';

describe('producerApprovedGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let notifySpy: jasmine.SpyObj<NotificationService>;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function setup(isApproved: boolean) {
    routerSpy  = jasmine.createSpyObj('Router', ['createUrlTree']);
    notifySpy  = jasmine.createSpyObj('NotificationService', ['warning']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    const authStub = { isProducerApproved: signal(isApproved) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: NotificationService, useValue: notifySpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  }

  it('returns true when producer is approved', () => {
    setup(true);
    const result = TestBed.runInInjectionContext(() => producerApprovedGuard(route, state));
    expect(result).toBeTrue();
  });

  it('does not show warning when approved', () => {
    setup(true);
    TestBed.runInInjectionContext(() => producerApprovedGuard(route, state));
    expect(notifySpy.warning).not.toHaveBeenCalled();
  });

  it('redirects to /producer/pending when not approved', () => {
    setup(false);
    TestBed.runInInjectionContext(() => producerApprovedGuard(route, state));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/producer/pending']);
  });

  it('shows warning toast when not approved', () => {
    setup(false);
    TestBed.runInInjectionContext(() => producerApprovedGuard(route, state));
    expect(notifySpy.warning).toHaveBeenCalled();
  });

  it('returns a UrlTree when not approved', () => {
    setup(false);
    const result = TestBed.runInInjectionContext(() => producerApprovedGuard(route, state));
    expect(result).toEqual({} as UrlTree);
  });
});
