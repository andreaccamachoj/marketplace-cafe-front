import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalDataStepComponent } from './personal-data-step.component';

describe('PersonalDataStepComponent', () => {
  let fixture: ComponentFixture<PersonalDataStepComponent>;
  let component: PersonalDataStepComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PersonalDataStepComponent] }).compileComponents();
    fixture   = TestBed.createComponent(PersonalDataStepComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function fillField(id: string, value: string) {
    const input = el.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function fillValid() {
    fillField('reg-first-name', 'Ana');
    fillField('reg-last-name', 'García');
    fillField('reg-email', 'ana@test.com');
    fillField('reg-phone', '3001234567');

    const pw = el.querySelector<HTMLInputElement>('#reg-password')!;
    pw.value = 'Secure#2025';
    pw.dispatchEvent(new Event('input'));
    const confirm = el.querySelector<HTMLInputElement>('#reg-confirm')!;
    confirm.value = 'Secure#2025';
    confirm.dispatchEvent(new Event('input'));

    const terms = el.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    terms.checked = true;
    terms.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  it('renders the form', () => {
    expect(el.querySelector('form.personal-form')).toBeTruthy();
  });

  it('renders all required fields', () => {
    expect(el.querySelector('#reg-first-name')).toBeTruthy();
    expect(el.querySelector('#reg-last-name')).toBeTruthy();
    expect(el.querySelector('#reg-email')).toBeTruthy();
    expect(el.querySelector('#reg-password')).toBeTruthy();
    expect(el.querySelector('#reg-confirm')).toBeTruthy();
  });

  it('submit button is disabled initially', () => {
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBeTrue();
  });

  it('shows field errors on submit with empty form', () => {
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    expect(el.querySelectorAll('[role="alert"]').length).toBeGreaterThan(0);
  });

  it('shows firstName error when touched and empty', () => {
    const input = el.querySelector<HTMLInputElement>('#reg-first-name')!;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')!.textContent).toContain('nombre es requerido');
  });

  it('shows email required error when touched empty', () => {
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    const errors = Array.from(el.querySelectorAll('[role="alert"]')).map(e => e.textContent);
    expect(errors.some(e => e?.includes('correo es requerido'))).toBeTrue();
  });

  it('shows email invalid error for bad email format', () => {
    fillField('reg-email', 'notvalid');
    el.querySelector<HTMLInputElement>('#reg-email')!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')!.textContent).toContain('correo válido');
  });

  it('shows password strength meter when password is entered', () => {
    fillField('reg-password', 'pass');
    expect(el.querySelector('.password-strength')).toBeTruthy();
  });

  it('shows password weak error when password is too weak and touched', () => {
    const pw = el.querySelector<HTMLInputElement>('#reg-password')!;
    pw.value = 'weak';
    pw.dispatchEvent(new Event('input'));
    pw.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    const errors = Array.from(el.querySelectorAll('[role="alert"]')).map(e => e.textContent);
    expect(errors.some(e => e?.includes('demasiado débil') || e?.includes('contraseña es requerida'))).toBeTrue();
  });

  it('toggles password visibility', () => {
    const pw = el.querySelector<HTMLInputElement>('#reg-password')!;
    expect(pw.type).toBe('password');
    el.querySelector<HTMLButtonElement>('.field__toggle-visibility')!.click();
    fixture.detectChanges();
    expect(pw.type).toBe('text');
  });

  it('emits submitted with correct data on valid form', () => {
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);
    fillValid();
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@test.com',
      acceptTerms: true,
    }));
  });

  it('does not emit when form is invalid', () => {
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows terms error when not accepted', () => {
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    const alerts = Array.from(el.querySelectorAll('[role="alert"]')).map(e => e.textContent);
    expect(alerts.some(a => a?.includes('términos'))).toBeTrue();
  });
});
