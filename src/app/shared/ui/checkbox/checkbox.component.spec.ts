import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>;
  let component: CheckboxComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CheckboxComponent] }).compileComponents();
    fixture   = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders a checkbox input', () => {
    expect(el.querySelector('input[type="checkbox"]')).toBeTruthy();
  });

  it('is unchecked by default', () => {
    expect(el.querySelector<HTMLInputElement>('input')!.checked).toBeFalse();
  });

  it('writeValue(true) checks the checkbox', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(el.querySelector<HTMLInputElement>('input')!.checked).toBeTrue();
  });

  it('writeValue(false) unchecks the checkbox', () => {
    component.writeValue(true);
    fixture.detectChanges();
    component.writeValue(false);
    fixture.detectChanges();
    expect(el.querySelector<HTMLInputElement>('input')!.checked).toBeFalse();
  });

  it('toggles checked on change event', () => {
    const input = el.querySelector<HTMLInputElement>('input')!;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component['checked']()).toBeTrue();
  });

  it('calls onChange with new value on toggle', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    el.querySelector<HTMLInputElement>('input')!.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    el.querySelector<HTMLInputElement>('input')!.dispatchEvent(new Event('change'));
    expect(component['checked']()).toBeFalse();
  });

  it('setDisabledState disables the input', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(el.querySelector<HTMLInputElement>('input')!.disabled).toBeTrue();
  });

  it('adds checkbox--checked class when checked', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(el.querySelector('label')!.classList).toContain('checkbox--checked');
  });

  it('adds checkbox--disabled class when disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(el.querySelector('label')!.classList).toContain('checkbox--disabled');
  });

  it('shows checkmark SVG when checked', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(el.querySelector('svg')).toBeTruthy();
  });

  it('hides checkmark SVG when unchecked', () => {
    component.writeValue(false);
    fixture.detectChanges();
    expect(el.querySelector('svg')).toBeNull();
  });

  it('registerOnTouched fires on blur', () => {
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    el.querySelector<HTMLInputElement>('input')!.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });
});
