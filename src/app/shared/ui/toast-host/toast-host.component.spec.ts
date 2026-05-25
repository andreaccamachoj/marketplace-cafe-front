import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ToastHostComponent } from './toast-host.component';
import { NotificationService } from '@core/services/notification.service';
import { IToast } from '../toast/toast.component';

describe('ToastHostComponent', () => {
  let fixture: ComponentFixture<ToastHostComponent>;
  let el: HTMLElement;
  const toastsSignal = signal<IToast[]>([]);
  const dismissSpy = jasmine.createSpy('dismiss');

  const mockNotificationService = {
    toasts: toastsSignal,
    dismiss: dismissSpy,
  };

  beforeEach(async () => {
    toastsSignal.set([]);
    dismissSpy.calls.reset();
    await TestBed.configureTestingModule({
      imports: [ToastHostComponent],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ToastHostComponent);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the toast host region', () => {
    expect(el.querySelector('.toast-host')).toBeTruthy();
  });

  it('renders no toasts when list is empty', () => {
    expect(el.querySelectorAll('app-toast').length).toBe(0);
  });

  it('renders one toast per item', () => {
    toastsSignal.set([
      { id: '1', type: 'success', message: 'A' },
      { id: '2', type: 'error',   message: 'B' },
    ]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.toast').length).toBe(2);
  });

  it('clicking dismiss on a toast calls NotificationService.dismiss', () => {
    toastsSignal.set([{ id: 'x1', type: 'info', message: 'Test' }]);
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.toast__close')!.click();
    expect(dismissSpy).toHaveBeenCalledWith('x1');
  });

  it('removing a toast from the signal removes it from the DOM', () => {
    toastsSignal.set([{ id: '1', type: 'success', message: 'A' }]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.toast').length).toBe(1);
    toastsSignal.set([]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.toast').length).toBe(0);
  });
});
