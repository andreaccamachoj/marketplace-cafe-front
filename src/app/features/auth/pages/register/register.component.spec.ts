import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { RegisterFlowState } from '../../services/register-flow.state';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let el: HTMLElement;
  let state: RegisterFlowState;
  let mockAuth: { register: jasmine.Spy; login: jasmine.Spy };
  let mockNotify: { success: jasmine.Spy; error: jasmine.Spy };

  beforeEach(async () => {
    mockAuth   = {
      register: jasmine.createSpy('register').and.returnValue(Promise.resolve()),
      login:    jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    };
    mockNotify = { success: jasmine.createSpy('success'), error: jasmine.createSpy('error') };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule],
      providers: [
        { provide: AuthService,        useValue: mockAuth   },
        { provide: NotificationService, useValue: mockNotify },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    state = fixture.debugElement.injector.get(RegisterFlowState);
  });

  it('renders the register page', () => {
    expect(el.querySelector('.layout')).toBeTruthy();
  });

  it('shows step 0 (role selector) initially', () => {
    expect(component['currentStepIndex']()).toBe(0);
    expect(el.querySelector('app-role-selector')).toBeTruthy();
  });

  it('shows step 1 (personal data) after next()', () => {
    state.next();
    fixture.detectChanges();
    expect(component['currentStepIndex']()).toBe(1);
    expect(el.querySelector('app-personal-data-step')).toBeTruthy();
  });

  it('shows step 2 (role-specific) after personal data saved', () => {
    state.next();
    const data = { firstName: 'Ana', lastName: 'G', email: 'a@b.co', phone: '', password: 'P', acceptTerms: true };
    component['onPersonalData'](data);
    fixture.detectChanges();
    expect(component['currentStepIndex']()).toBe(2);
    expect(el.querySelector('app-role-specific-step')).toBeTruthy();
  });

  it('renders step indicator', () => {
    expect(el.querySelector('app-step-indicator')).toBeTruthy();
  });

  it('renders brand panel', () => {
    expect(el.querySelector('app-brand-panel')).toBeTruthy();
  });

  it('onRoleSelected updates state role', () => {
    component['onRoleSelected']('producer');
    expect(state.selectedRole()).toBe('producer');
  });

  it('calls auth.register on onRoleData', fakeAsync(() => {
    state.selectRole('buyer');
    state.savePersonalData({ firstName: 'Ana', lastName: 'G', email: 'a@b.co', phone: '300', password: 'P', acceptTerms: true });
    component.onRoleData({ country: 'Colombia' });
    tick();
    expect(mockAuth.register).toHaveBeenCalled();
  }));

  it('calls notify.success after successful register', fakeAsync(() => {
    state.savePersonalData({ firstName: 'Ana', lastName: 'G', email: 'a@b.co', phone: '', password: 'P', acceptTerms: true });
    component.onRoleData({});
    tick();
    expect(mockNotify.success).toHaveBeenCalledWith('¡Cuenta creada exitosamente!');
  }));

  it('calls notify.error when register rejects', fakeAsync(() => {
    mockAuth.register.and.returnValue(Promise.reject(new Error('Ya existe')));
    state.savePersonalData({ firstName: 'Ana', lastName: 'G', email: 'a@b.co', phone: '', password: 'P', acceptTerms: true });
    component.onRoleData({});
    tick();
    expect(mockNotify.error).toHaveBeenCalledWith('Ya existe');
  }));

  it('resets state after successful register', fakeAsync(() => {
    state.next();
    state.savePersonalData({ firstName: 'Ana', lastName: 'G', email: 'a@b.co', phone: '', password: 'P', acceptTerms: true });
    component.onRoleData({});
    tick();
    expect(state.step()).toBe(1);
  }));

  it('loading is false after register resolves', fakeAsync(() => {
    state.savePersonalData({ firstName: 'A', lastName: 'B', email: 'a@b.co', phone: '', password: 'P', acceptTerms: true });
    component.onRoleData({});
    tick();
    expect(component['loading']()).toBeFalse();
  }));

  it('renders login footer link', () => {
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.some(a => a.textContent?.includes('Inicia sesión'))).toBeTrue();
  });
});
