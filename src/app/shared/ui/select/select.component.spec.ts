import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, ISelectOption } from './select.component';

const OPTIONS: ISelectOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
];

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectComponent>;
  let component: SelectComponent;
  let el: HTMLElement;

  function create(inputs: Partial<SelectComponent> = {}) {
    fixture   = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectComponent] }).compileComponents();
  });

  it('renders a select element', () => {
    create({ options: OPTIONS });
    expect(el.querySelector('select.select-field')).toBeTruthy();
  });

  it('renders one option per item in options array', () => {
    create({ options: OPTIONS });
    // options only (no placeholder)
    expect(el.querySelectorAll('option').length).toBe(OPTIONS.length);
  });

  it('renders placeholder option when provided', () => {
    create({ options: OPTIONS, placeholder: 'Elige...' });
    const opts = el.querySelectorAll('option');
    expect(opts.length).toBe(OPTIONS.length + 1);
    expect(opts[0].textContent?.trim()).toBe('Elige...');
  });

  it('placeholder option is disabled', () => {
    create({ options: OPTIONS, placeholder: 'Elige...' });
    expect((el.querySelectorAll('option')[0] as HTMLOptionElement).disabled).toBeTrue();
  });

  it('renders option labels', () => {
    create({ options: OPTIONS });
    const labels = Array.from(el.querySelectorAll('option')).map(o => o.textContent?.trim());
    expect(labels).toContain('Option A');
    expect(labels).toContain('Option B');
  });

  it('disables options marked as disabled', () => {
    create({ options: OPTIONS });
    const opts = el.querySelectorAll<HTMLOptionElement>('option');
    expect(opts[2].disabled).toBeTrue();
  });

  it('applies error class when showError=true', () => {
    create({ options: OPTIONS, showError: true });
    expect(el.querySelector('.select-wrapper')!.classList).toContain('select-wrapper--error');
  });

  it('writeValue stores the selected value internally', () => {
    create({ options: OPTIONS });
    component.writeValue('b');
    expect(component['innerValue']).toBe('b');
  });

  it('setDisabledState disables the select', () => {
    create({ options: OPTIONS });
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBeTrue();
  });

  it('registerOnChange — callback fires on change event', () => {
    create({ options: OPTIONS });
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    const sel = el.querySelector<HTMLSelectElement>('select')!;
    sel.value = 'b';
    sel.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('registerOnTouched — callback fires on blur', () => {
    create({ options: OPTIONS });
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    el.querySelector<HTMLSelectElement>('select')!.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('shows the select-arrow indicator', () => {
    create({ options: [] });
    expect(el.querySelector('.select-arrow')).toBeTruthy();
  });
});
