import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  let fixture: ComponentFixture<TextareaComponent>;
  let component: TextareaComponent;
  let el: HTMLElement;

  function create(inputs: Partial<TextareaComponent> = {}) {
    fixture   = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TextareaComponent] }).compileComponents();
  });

  it('renders a textarea element', () => {
    create();
    expect(el.querySelector('textarea.textarea-field')).toBeTruthy();
  });

  it('applies rows attribute', () => {
    create({ rows: 6 });
    expect(el.querySelector('textarea')!.getAttribute('rows')).toBe('6');
  });

  it('sets placeholder', () => {
    create({ placeholder: 'Escribe tu mensaje' });
    expect(el.querySelector<HTMLTextAreaElement>('textarea')!.placeholder).toBe('Escribe tu mensaje');
  });

  it('applies error class when showError=true', () => {
    create({ showError: true });
    expect(el.querySelector('.textarea-wrapper')!.classList).toContain('textarea-wrapper--error');
  });

  it('does not show counter when maxLength is null', () => {
    create({ maxLength: null });
    expect(el.querySelector('.textarea-counter')).toBeNull();
  });

  it('shows counter when maxLength is provided', () => {
    create({ maxLength: 200 });
    expect(el.querySelector('.textarea-counter')).toBeTruthy();
  });

  it('counter displays format X/maxLength', () => {
    create({ maxLength: 200 });
    const text = el.querySelector('.textarea-counter')!.textContent?.trim() ?? '';
    expect(text).toContain('/200');
  });

  it('sets maxlength attribute on textarea', () => {
    create({ maxLength: 500 });
    expect(el.querySelector('textarea')!.getAttribute('maxlength')).toBe('500');
  });

  it('writeValue stores the value internally', () => {
    create();
    component.writeValue('some text');
    expect(component['innerValue']).toBe('some text');
  });

  it('setDisabledState disables the textarea', () => {
    create();
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBeTrue();
  });

  it('registerOnChange fires on textarea input event', () => {
    create();
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    const ta = el.querySelector<HTMLTextAreaElement>('textarea')!;
    ta.value = 'hello';
    ta.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('registerOnTouched fires on blur', () => {
    create();
    const spy = jasmine.createSpy('onTouched');
    component.registerOnTouched(spy);
    el.querySelector<HTMLTextAreaElement>('textarea')!.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });
});
