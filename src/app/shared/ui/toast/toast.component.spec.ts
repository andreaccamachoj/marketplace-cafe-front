import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent, IToast } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let component: ToastComponent;
  let el: HTMLElement;

  function makeToast(overrides: Partial<IToast> = {}): IToast {
    return { id: 't1', type: 'info', message: 'Hola', ...overrides };
  }

  function create(toast: IToast) {
    fixture   = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    component.toast = toast;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToastComponent] }).compileComponents();
  });

  it('renders the toast container', () => {
    create(makeToast());
    expect(el.querySelector('.toast')).toBeTruthy();
  });

  it('applies type class', () => {
    create(makeToast({ type: 'success' }));
    expect(el.querySelector('.toast')!.classList).toContain('toast--success');
  });

  it('shows message', () => {
    create(makeToast({ message: 'Guardado correctamente' }));
    expect(el.querySelector('.toast__message')!.textContent?.trim()).toBe('Guardado correctamente');
  });

  it('shows title when provided', () => {
    create(makeToast({ title: 'Éxito' }));
    expect(el.querySelector('.toast__title')!.textContent?.trim()).toBe('Éxito');
  });

  it('hides title when not provided', () => {
    create(makeToast());
    expect(el.querySelector('.toast__title')).toBeNull();
  });

  it('error type shows error icon', () => {
    create(makeToast({ type: 'error' }));
    expect(el.querySelector('.toast__icon')!.textContent?.trim()).toBe('✕');
  });

  it('success type shows check icon', () => {
    create(makeToast({ type: 'success' }));
    expect(el.querySelector('.toast__icon')!.textContent?.trim()).toBe('✓');
  });

  it('warning type shows warning icon', () => {
    create(makeToast({ type: 'warning' }));
    expect(el.querySelector('.toast__icon')!.textContent?.trim()).toBe('⚠');
  });

  it('info type shows info icon', () => {
    create(makeToast({ type: 'info' }));
    expect(el.querySelector('.toast__icon')!.textContent?.trim()).toBe('ℹ');
  });

  it('error type has role="alert"', () => {
    create(makeToast({ type: 'error' }));
    expect(el.querySelector('.toast')!.getAttribute('role')).toBe('alert');
  });

  it('success type has role="status"', () => {
    create(makeToast({ type: 'success' }));
    expect(el.querySelector('.toast')!.getAttribute('role')).toBe('status');
  });

  it('close button emits dismiss with toast id', () => {
    const toast = makeToast({ id: 'abc' });
    create(toast);
    const spy = jasmine.createSpy('dismiss');
    component.dismiss.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.toast__close')!.click();
    expect(spy).toHaveBeenCalledWith('abc');
  });
});
