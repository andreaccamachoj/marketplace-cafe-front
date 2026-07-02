import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let svc: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(LoadingService);
  });

  it('isLoading is false initially', () => {
    expect(svc.isLoading()).toBeFalse();
  });

  it('start() activates loading', () => {
    svc.start();
    expect(svc.isLoading()).toBeTrue();
  });

  it('stop() after start() deactivates loading', () => {
    svc.start();
    svc.stop();
    expect(svc.isLoading()).toBeFalse();
  });

  it('stop() without start() stays false (counter floor is 0)', () => {
    svc.stop();
    expect(svc.isLoading()).toBeFalse();
  });

  it('nested start-start-stop keeps loading active', () => {
    svc.start();
    svc.start();
    svc.stop();
    expect(svc.isLoading()).toBeTrue();
  });

  it('nested start-start-stop-stop deactivates loading', () => {
    svc.start();
    svc.start();
    svc.stop();
    svc.stop();
    expect(svc.isLoading()).toBeFalse();
  });

  it('extra stop beyond zero does not go negative (stays false)', () => {
    svc.start();
    svc.stop();
    svc.stop();
    expect(svc.isLoading()).toBeFalse();
  });
});
