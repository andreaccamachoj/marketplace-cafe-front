import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let svc: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(NotificationService);
  });

  it('starts with an empty toasts list', () => {
    expect(svc.toasts()).toEqual([]);
  });

  it('success() adds a toast of type success', () => {
    svc.success('Done!');
    const toasts = svc.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Done!');
  });

  it('error() adds a toast of type error', () => {
    svc.error('Oops');
    expect(svc.toasts()[0].type).toBe('error');
  });

  it('info() adds a toast of type info', () => {
    svc.info('FYI');
    expect(svc.toasts()[0].type).toBe('info');
  });

  it('warning() adds a toast of type warning', () => {
    svc.warning('Watch out');
    expect(svc.toasts()[0].type).toBe('warning');
  });

  it('stores optional title on the toast', () => {
    svc.success('Saved', 'Great');
    expect(svc.toasts()[0].title).toBe('Great');
  });

  it('dismiss() removes the toast with the given id', () => {
    svc.success('A');
    svc.success('B');
    const id = svc.toasts()[0].id;
    svc.dismiss(id);
    expect(svc.toasts().length).toBe(1);
    expect(svc.toasts()[0].message).toBe('B');
  });

  it('dismiss() with unknown id leaves list unchanged', () => {
    svc.success('A');
    svc.dismiss('nonexistent');
    expect(svc.toasts().length).toBe(1);
  });

  it('toast auto-dismisses after default timeout (3200 ms)', fakeAsync(() => {
    svc.success('Auto');
    expect(svc.toasts().length).toBe(1);
    tick(3200);
    expect(svc.toasts().length).toBe(0);
  }));

  it('toast auto-dismisses after custom duration', fakeAsync(() => {
    svc['add']({ type: 'info', message: 'Custom', duration: 1000 });
    tick(1000);
    expect(svc.toasts().length).toBe(0);
  }));

  it('supports multiple simultaneous toasts', () => {
    svc.success('A');
    svc.error('B');
    svc.info('C');
    expect(svc.toasts().length).toBe(3);
  });

  it('each toast gets a unique id', () => {
    svc.success('A');
    svc.success('B');
    const [a, b] = svc.toasts();
    expect(a.id).not.toBe(b.id);
  });
});
