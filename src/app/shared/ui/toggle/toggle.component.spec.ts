import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  let fixture: ComponentFixture<ToggleComponent>;
  let component: ToggleComponent;
  let el: HTMLElement;

  function create(inputs: Partial<ToggleComponent> = {}) {
    fixture   = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToggleComponent] }).compileComponents();
  });

  it('renders a toggle label with checkbox inside', () => {
    create();
    expect(el.querySelector('label.toggle')).toBeTruthy();
    expect(el.querySelector('input[type="checkbox"]')).toBeTruthy();
  });

  it('is off (unchecked) by default', () => {
    create();
    expect(el.querySelector<HTMLInputElement>('input')!.checked).toBeFalse();
  });

  it('shows label text when label is provided', () => {
    create({ label: 'Activar notificaciones' });
    expect(el.querySelector('.toggle__label')?.textContent?.trim()).toBe('Activar notificaciones');
  });

  it('hides label element when label is empty', () => {
    create({ label: '' });
    expect(el.querySelector('.toggle__label')).toBeNull();
  });

  it('writeValue(true) turns on the toggle', () => {
    create();
    component.writeValue(true);
    fixture.detectChanges();
    expect(component['checked']()).toBeTrue();
  });

  it('writeValue(false) turns off the toggle', () => {
    create();
    component.writeValue(true);
    fixture.detectChanges();
    component.writeValue(false);
    fixture.detectChanges();
    expect(component['checked']()).toBeFalse();
  });

  it('dispatching change event toggles state and calls onChange', () => {
    create();
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    const input = el.querySelector<HTMLInputElement>('input')!;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    expect(component['checked']()).toBeTrue();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('setDisabledState disables the input', () => {
    create();
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(el.querySelector<HTMLInputElement>('input')!.disabled).toBeTrue();
  });

  it('adds toggle--disabled class when disabled', () => {
    create();
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(el.querySelector('label')!.classList).toContain('toggle--disabled');
  });

  it('registerOnTouched is called after toggle', () => {
    create();
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    const input = el.querySelector<HTMLInputElement>('input')!;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalled();
  });

  it('sets aria-label on the checkbox from label input', () => {
    create({ label: 'Mi toggle' });
    expect(el.querySelector('input')!.getAttribute('aria-label')).toBe('Mi toggle');
  });
});
