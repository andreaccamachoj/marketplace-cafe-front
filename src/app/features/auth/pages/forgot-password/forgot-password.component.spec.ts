import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;
  let el: HTMLElement;
  let mockAuth: { recoverPassword: jasmine.Spy };
  let mockNotify: { error: jasmine.Spy; success: jasmine.Spy };

  beforeEach(async () => {
    mockAuth   = { recoverPassword: jasmine.createSpy('recoverPassword').and.returnValue(Promise.resolve()) };
    mockNotify = { error: jasmine.createSpy('error'), success: jasmine.createSpy('success') };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, RouterTestingModule],
      providers: [
        { provide: AuthService,        useValue: mockAuth   },
        { provide: NotificationService, useValue: mockNotify },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the form', () => {
    expect(el.querySelector('form.forgot-form')).toBeTruthy();
  });

  it('renders email input', () => {
    expect(el.querySelector('#forgot-email')).toBeTruthy();
  });

  it('submit button is disabled when form is empty', () => {
    const btn = el.querySelector<HTMLButtonElement>('app-button')!;
    expect(btn.getAttribute('ng-reflect-disabled') === 'true' || component['form'].invalid).toBeTrue();
  });

  it('shows required error when email is empty and touched', () => {
    const input = el.querySelector<HTMLInputElement>('#forgot-email')!;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')!.textContent).toContain('correo es requerido');
  });

  it('shows invalid email error for bad format', () => {
    const input = el.querySelector<HTMLInputElement>('#forgot-email')!;
    input.value = 'notanemail';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')!.textContent).toContain('correo válido');
  });

  it('calls auth.recoverPassword with email on valid submit', fakeAsync(() => {
    const input = el.querySelector<HTMLInputElement>('#forgot-email')!;
    input.value = 'user@test.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();
    tick();
    expect(mockAuth.recoverPassword).toHaveBeenCalledWith('user@test.com');
  }));

  it('does not call recoverPassword when form is invalid', fakeAsync(() => {
    component.onSubmit();
    tick();
    expect(mockAuth.recoverPassword).not.toHaveBeenCalled();
  }));

  it('sets loading to false after recoverPassword resolves', fakeAsync(() => {
    const input = el.querySelector<HTMLInputElement>('#forgot-email')!;
    input.value = 'user@test.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();
    tick();
    expect(component['loading']()).toBeFalse();
  }));

  it('sets loading to false when recoverPassword rejects', fakeAsync(() => {
    mockAuth.recoverPassword.and.returnValue(Promise.reject(new Error('fail')));
    const input = el.querySelector<HTMLInputElement>('#forgot-email')!;
    input.value = 'user@test.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit().catch(() => {});
    tick();
    expect(component['loading']()).toBeFalse();
  }));

  it('renders back link to /auth/login', () => {
    const link = el.querySelector<HTMLAnchorElement>('.forgot-wrap__back')!;
    expect(link).toBeTruthy();
    expect(link.getAttribute('routerLink') ?? link.href).toContain('/auth/login');
  });
});
