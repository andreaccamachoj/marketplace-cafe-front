import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let el: HTMLElement;
  let mockAuth: jasmine.SpyObj<Pick<AuthService, 'login'>>;
  let mockNotify: { error: jasmine.Spy; success: jasmine.Spy };

  beforeEach(async () => {
    mockAuth   = { login: jasmine.createSpy('login').and.returnValue(Promise.resolve()) };
    mockNotify = { error: jasmine.createSpy('error'), success: jasmine.createSpy('success') };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService,        useValue: mockAuth   },
        { provide: NotificationService, useValue: mockNotify },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the login form', () => {
    expect(el.querySelector('app-login-form')).toBeTruthy();
  });

  it('renders brand panel', () => {
    expect(el.querySelector('app-brand-panel')).toBeTruthy();
  });

  it('calls auth.login with credentials on submit', fakeAsync(() => {
    component.onSubmit({ email: 'buyer@wcm.co', password: 'Cafe#2025' });
    tick();
    expect(mockAuth.login).toHaveBeenCalledWith({ email: 'buyer@wcm.co', password: 'Cafe#2025' });
  }));

  it('sets loading to true during login', fakeAsync(() => {
    let loadingDuringCall = false;
    mockAuth.login.and.callFake(() => {
      loadingDuringCall = component['loading']();
      return Promise.resolve();
    });
    component.onSubmit({ email: 'buyer@wcm.co', password: 'Cafe#2025' });
    tick();
    expect(loadingDuringCall).toBeTrue();
  }));

  it('sets loading to false after login resolves', fakeAsync(() => {
    component.onSubmit({ email: 'buyer@wcm.co', password: 'Cafe#2025' });
    tick();
    expect(component['loading']()).toBeFalse();
  }));

  it('calls notify.error when login rejects', fakeAsync(() => {
    mockAuth.login.and.returnValue(Promise.reject(new Error('Credenciales inválidas')));
    component.onSubmit({ email: 'x@x.co', password: 'wrong' });
    tick();
    expect(mockNotify.error).toHaveBeenCalledWith('Credenciales inválidas');
  }));

  it('calls notify.error with default message on non-Error rejection', fakeAsync(() => {
    mockAuth.login.and.returnValue(Promise.reject('fail'));
    component.onSubmit({ email: 'x@x.co', password: 'wrong' });
    tick();
    expect(mockNotify.error).toHaveBeenCalledWith('Error al iniciar sesión');
  }));

  it('sets loading to false even when login rejects', fakeAsync(() => {
    mockAuth.login.and.returnValue(Promise.reject(new Error('fail')));
    component.onSubmit({ email: 'x@x.co', password: 'wrong' });
    tick();
    expect(component['loading']()).toBeFalse();
  }));

  it('renders skip link', () => {
    expect(el.querySelector('a.skip-link')).toBeTruthy();
  });
});
