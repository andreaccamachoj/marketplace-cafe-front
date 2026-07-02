import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;
  let el: HTMLElement;

  function create(inputs: Partial<InputComponent> = {}) {
    fixture   = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputComponent] }).compileComponents();
  });

  it('renders an input field', () => {
    create();
    expect(el.querySelector('input.input-field')).toBeTruthy();
  });

  it('applies error class when showError=true', () => {
    create({ showError: true });
    expect(el.querySelector('.input-wrapper')!.classList).toContain('input-wrapper--error');
  });

  it('does not apply error class when showError=false', () => {
    create();
    expect(el.querySelector('.input-wrapper')!.classList).not.toContain('input-wrapper--error');
  });

  it('shows prefix icon when provided', () => {
    create({ prefixIcon: '🔍' });
    expect(el.querySelector('.input-prefix')?.textContent?.trim()).toBe('🔍');
  });

  it('hides prefix when not provided', () => {
    create();
    expect(el.querySelector('.input-prefix')).toBeNull();
  });

  it('shows suffix icon for non-password type', () => {
    create({ suffixIcon: '✓' });
    expect(el.querySelector('.input-suffix')?.textContent?.trim()).toBe('✓');
  });

  it('shows password toggle button for type="password"', () => {
    create({ type: 'password' });
    expect(el.querySelector('.input-suffix--btn')).toBeTruthy();
  });

  it('toggles password visibility on button click', () => {
    create({ type: 'password' });
    const btn = el.querySelector<HTMLButtonElement>('.input-suffix--btn')!;
    expect(el.querySelector('input')!.type).toBe('password');
    btn.click();
    fixture.detectChanges();
    expect(el.querySelector('input')!.type).toBe('text');
  });

  it('toggles back to password after second click', () => {
    create({ type: 'password' });
    const btn = el.querySelector<HTMLButtonElement>('.input-suffix--btn')!;
    btn.click();
    fixture.detectChanges();
    btn.click();
    fixture.detectChanges();
    expect(el.querySelector('input')!.type).toBe('password');
  });

  it('writeValue stores the value internally', () => {
    create();
    component.writeValue('hello');
    expect(component['innerValue']).toBe('hello');
  });

  it('writeValue with null sets empty string', () => {
    create();
    component.writeValue(null as unknown as string);
    expect(component['innerValue']).toBe('');
  });

  it('setDisabledState disables the input', () => {
    create();
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBeTrue();
  });

  it('setDisabledState(false) re-enables the input', () => {
    create();
    component.setDisabledState(true);
    component.setDisabledState(false);
    expect(component['isDisabled']()).toBeFalse();
  });

  it('registerOnChange — callback fires on input event', () => {
    create();
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    const input = el.querySelector<HTMLInputElement>('input')!;
    input.value = 'world';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('world');
  });

  it('registerOnTouched — callback fires on blur', () => {
    create();
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    el.querySelector<HTMLInputElement>('input')!.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('sets placeholder attribute', () => {
    create({ placeholder: 'Escribe aquí' });
    expect(el.querySelector<HTMLInputElement>('input')!.placeholder).toBe('Escribe aquí');
  });

  it('sets aria-required when required=true', () => {
    create({ required: true });
    expect(el.querySelector('input')!.getAttribute('aria-required')).toBe('true');
  });
});
