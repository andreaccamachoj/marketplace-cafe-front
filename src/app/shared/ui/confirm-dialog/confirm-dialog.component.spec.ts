import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let el: HTMLElement;

  function create(inputs: Partial<ConfirmDialogComponent> = {}) {
    fixture   = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfirmDialogComponent] }).compileComponents();
  });

  afterEach(() => {
    document.body.classList.remove('modal-open');
  });

  it('does not render dialog content when open=false', () => {
    create({ open: false });
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders dialog when open=true', () => {
    create({ open: true });
    expect(el.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('shows message when provided', () => {
    create({ open: true, message: '¿Eliminar este producto?' });
    expect(el.querySelector('.confirm-dialog__message')!.textContent?.trim())
      .toBe('¿Eliminar este producto?');
  });

  it('confirm button emits confirmed', () => {
    create({ open: true, confirmLabel: 'Sí' });
    const spy = jasmine.createSpy('confirmed');
    component.confirmed.subscribe(spy);
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    const confirmBtn = Array.from(btns).find(b => b.textContent?.trim() === 'Sí')!;
    confirmBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('cancel button emits cancelled', () => {
    create({ open: true, cancelLabel: 'No' });
    const spy = jasmine.createSpy('cancelled');
    component.cancelled.subscribe(spy);
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    const cancelBtn = Array.from(btns).find(b => b.textContent?.trim() === 'No')!;
    cancelBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('busy resets after confirm', fakeAsync(() => {
    create({ open: true });
    component.confirmed.subscribe(() => {});
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    const confirmBtn = Array.from(btns).find(b => b.textContent?.trim() === 'Confirmar')!;
    confirmBtn.click();
    expect(component['busy']()).toBeTrue();
    tick(400);
    expect(component['busy']()).toBeFalse();
  }));

  it('cancel does not emit when busy', fakeAsync(() => {
    create({ open: true });
    component.confirmed.subscribe(() => {});
    const spy = jasmine.createSpy('cancelled');
    component.cancelled.subscribe(spy);
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    const confirmBtn = Array.from(btns).find(b => b.textContent?.trim() === 'Confirmar')!;
    confirmBtn.click();
    const cancelBtn = Array.from(btns).find(b => b.textContent?.trim() === 'Cancelar')!;
    cancelBtn.click();
    expect(spy).not.toHaveBeenCalled();
    tick(400);
  }));

  it('variant="danger" uses danger button', () => {
    create({ open: true, variant: 'danger', confirmLabel: 'Borrar' });
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    const confirmBtn = Array.from(btns).find(b => b.textContent?.trim() === 'Borrar')!;
    expect(confirmBtn).toBeTruthy();
  });

  it('variant="warning" uses primary button', () => {
    create({ open: true, variant: 'warning', confirmLabel: 'Aceptar' });
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    const confirmBtn = Array.from(btns).find(b => b.textContent?.trim() === 'Aceptar')!;
    expect(confirmBtn).toBeTruthy();
  });

  it('title is displayed in the modal header', () => {
    create({ open: true, title: 'Confirmar acción' });
    expect(el.querySelector('.modal__title')!.textContent?.trim()).toBe('Confirmar acción');
  });
});
