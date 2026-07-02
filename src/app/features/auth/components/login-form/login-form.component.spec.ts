import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;
  let el: HTMLElement;

  function create(inputs: Partial<LoginFormComponent> = {}) {
    fixture   = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function fill(email: string, password: string) {
    const emailInput = el.querySelector<HTMLInputElement>('#login-email')!;
    const pwInput    = el.querySelector<HTMLInputElement>('#login-password')!;
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input'));
    pwInput.value = password;
    pwInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('renders the form', () => {
    create();
    expect(el.querySelector('form')).toBeTruthy();
  });

  it('renders email input', () => {
    create();
    expect(el.querySelector('#login-email')).toBeTruthy();
  });

  it('renders password input', () => {
    create();
    expect(el.querySelector('#login-password')).toBeTruthy();
  });

  it('submit button is disabled when form is invalid', () => {
    create();
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBeTrue();
  });

  it('submit button is disabled when loading=true', () => {
    create({ loading: true });
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBeTrue();
  });

  it('shows loading label when loading=true', () => {
    create({ loading: true });
    expect(el.querySelector('.btn-label')!.textContent?.trim()).toBe('Iniciando…');
  });

  it('shows normal label when loading=false', () => {
    create({ loading: false });
    expect(el.querySelector('.btn-label')!.textContent?.trim()).toBe('Iniciar sesión');
  });

  it('shows email error after invalid submit', () => {
    create();
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    expect(el.querySelector('#login-email-error')).toBeTruthy();
  });

  it('shows password error after invalid submit', () => {
    create();
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    expect(el.querySelector('.field-message.error')).toBeTruthy();
  });

  it('shows "correo válido" error for invalid email format', () => {
    create();
    const emailInput = el.querySelector<HTMLInputElement>('#login-email')!;
    emailInput.value = 'notanemail';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('#login-email-error')!.textContent).toContain('correo válido');
  });

  it('shows "correo requerido" error when email is empty and touched', () => {
    create();
    const emailInput = el.querySelector<HTMLInputElement>('#login-email')!;
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('#login-email-error')!.textContent).toContain('correo es requerido');
  });

  it('toggles password visibility on button click', () => {
    create();
    const pwInput = el.querySelector<HTMLInputElement>('#login-password')!;
    expect(pwInput.type).toBe('password');
    el.querySelector<HTMLButtonElement>('.input-action')!.click();
    fixture.detectChanges();
    expect(pwInput.type).toBe('text');
  });

  it('toggle button shows hide icon when password visible', () => {
    create();
    el.querySelector<HTMLButtonElement>('.input-action')!.click();
    fixture.detectChanges();
    expect(component['showPassword']()).toBeTrue();
  });

  it('emits submitted with credentials on valid submit', () => {
    create();
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);
    fill('buyer@wcm.co', 'Cafe#2025');
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(spy).toHaveBeenCalledWith({ email: 'buyer@wcm.co', password: 'Cafe#2025' });
  });

  it('does not emit submitted when form is invalid', () => {
    create();
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('forgot-password link is present', () => {
    create();
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.some(a => a.textContent?.includes('Olvidaste'))).toBeTrue();
  });

  it('register link navigates to /auth/register', () => {
    create();
    const link = el.querySelector<HTMLAnchorElement>('.register-link')!;
    expect(link.getAttribute('routerLink') ?? link.href).toContain('/auth/register');
  });
});
