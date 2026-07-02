import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;
  let el: HTMLElement;

  function create(inputs: Partial<ModalComponent> = {}) {
    fixture   = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();
  });

  afterEach(() => {
    document.body.classList.remove('modal-open');
  });

  it('does not render dialog when open=false', () => {
    create({ open: false });
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders dialog when open=true', () => {
    create({ open: true });
    expect(el.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('shows title in header', () => {
    create({ open: true, title: 'Mi Modal' });
    expect(el.querySelector('.modal__title')!.textContent?.trim()).toBe('Mi Modal');
  });

  it('renders close button when showClose=true', () => {
    create({ open: true, showClose: true });
    expect(el.querySelector('.modal__close')).toBeTruthy();
  });

  it('hides close button when showClose=false', () => {
    create({ open: true, showClose: false, title: 'T' });
    expect(el.querySelector('.modal__close')).toBeNull();
  });

  it('close button click emits closed', () => {
    create({ open: true, showClose: true, title: 'T' });
    const spy = jasmine.createSpy('closed');
    component.closed.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.modal__close')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('backdrop click emits closed when closeOnBackdrop=true', () => {
    create({ open: true, closeOnBackdrop: true });
    const spy = jasmine.createSpy('closed');
    component.closed.subscribe(spy);
    el.querySelector<HTMLElement>('.modal-backdrop')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('backdrop click does not emit when closeOnBackdrop=false', () => {
    create({ open: true, closeOnBackdrop: false });
    const spy = jasmine.createSpy('closed');
    component.closed.subscribe(spy);
    el.querySelector<HTMLElement>('.modal-backdrop')!.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('applies size class to dialog', () => {
    create({ open: true, size: 'lg' });
    expect(el.querySelector('[role="dialog"]')!.classList).toContain('modal--lg');
  });

  it('Escape key emits closed when open=true', () => {
    create({ open: true });
    const spy = jasmine.createSpy('closed');
    component.closed.subscribe(spy);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(spy).toHaveBeenCalled();
  });

  it('Escape key does not emit when open=false', () => {
    create({ open: false });
    const spy = jasmine.createSpy('closed');
    component.closed.subscribe(spy);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('adds modal-open class to body when open changes to true', () => {
    create({ open: false });
    component.open = true;
    component.ngOnChanges({ open: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
    expect(document.body.classList).toContain('modal-open');
  });

  it('removes modal-open class from body when open changes to false', () => {
    create({ open: false });
    component.open = true;
    component.ngOnChanges({ open: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
    expect(document.body.classList).toContain('modal-open');
    component.open = false;
    component.ngOnChanges({ open: { currentValue: false, previousValue: true, firstChange: false, isFirstChange: () => false } });
    expect(document.body.classList).not.toContain('modal-open');
  });

  it('ngOnDestroy removes modal-open class', () => {
    document.body.classList.add('modal-open');
    create({ open: false });
    component.ngOnDestroy();
    expect(document.body.classList).not.toContain('modal-open');
  });

  it('renders backdrop with visible class when open', () => {
    create({ open: true });
    expect(el.querySelector('.modal-backdrop')!.classList).toContain('modal-backdrop--visible');
  });

  it('no title element when title is empty', () => {
    create({ open: true, title: '', showClose: true });
    expect(el.querySelector('.modal__title')).toBeNull();
  });
});
