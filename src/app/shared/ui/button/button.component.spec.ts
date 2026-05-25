import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let el: HTMLElement;

  function create(inputs: Partial<{
    variant: ButtonComponent['variant'];
    size: ButtonComponent['size'];
    type: ButtonComponent['type'];
    disabled: boolean;
    loading: boolean;
    block: boolean;
    iconLeft: string;
    iconRight: string;
  }> = {}) {
    fixture   = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
  });

  it('renders a <button> element', () => {
    create();
    expect(el.querySelector('button')).toBeTruthy();
  });

  it('default type is "button"', () => {
    create();
    expect(el.querySelector('button')?.type).toBe('button');
  });

  it('applies primary and md classes by default', () => {
    create();
    const classes = el.querySelector('button')!.className;
    expect(classes).toContain('btn--primary');
    expect(classes).toContain('btn--md');
  });

  it('applies custom variant class', () => {
    create({ variant: 'danger' });
    expect(el.querySelector('button')!.className).toContain('btn--danger');
  });

  it('applies secondary variant class', () => {
    create({ variant: 'secondary' });
    expect(el.querySelector('button')!.className).toContain('btn--secondary');
  });

  it('applies custom size class lg', () => {
    create({ size: 'lg' });
    expect(el.querySelector('button')!.className).toContain('btn--lg');
  });

  it('applies custom size class sm', () => {
    create({ size: 'sm' });
    expect(el.querySelector('button')!.className).toContain('btn--sm');
  });

  it('applies btn--block class when block=true', () => {
    create({ block: true });
    expect(el.querySelector('button')!.className).toContain('btn--block');
  });

  it('applies btn--loading class when loading=true', () => {
    create({ loading: true });
    expect(el.querySelector('button')!.className).toContain('btn--loading');
  });

  it('disables the button when disabled=true', () => {
    create({ disabled: true });
    expect(el.querySelector('button')!.disabled).toBeTrue();
  });

  it('disables the button when loading=true', () => {
    create({ loading: true });
    expect(el.querySelector('button')!.disabled).toBeTrue();
  });

  it('shows spinner element when loading=true', () => {
    create({ loading: true });
    expect(el.querySelector('.btn__spinner')).toBeTruthy();
  });

  it('hides spinner when not loading', () => {
    create();
    expect(el.querySelector('.btn__spinner')).toBeNull();
  });

  it('shows left icon when iconLeft set and not loading', () => {
    create({ iconLeft: '←' });
    expect(el.querySelector('.btn__icon--left')?.textContent?.trim()).toBe('←');
  });

  it('hides left icon when loading', () => {
    create({ iconLeft: '←', loading: true });
    expect(el.querySelector('.btn__icon--left')).toBeNull();
  });

  it('shows right icon when iconRight set and not loading', () => {
    create({ iconRight: '→' });
    expect(el.querySelector('.btn__icon--right')?.textContent?.trim()).toBe('→');
  });

  it('hides right icon when loading', () => {
    create({ iconRight: '→', loading: true });
    expect(el.querySelector('.btn__icon--right')).toBeNull();
  });

  it('sets type="submit" when input type is submit', () => {
    create({ type: 'submit' });
    expect(el.querySelector('button')!.type).toBe('submit');
  });

  it('sets type="reset"', () => {
    create({ type: 'reset' });
    expect(el.querySelector('button')!.type).toBe('reset');
  });

  it('btnClasses excludes empty strings', () => {
    create();
    expect(component.btnClasses).not.toContain('  ');
    expect(component.btnClasses.trim()).not.toBe('');
  });

  it('ghost variant applies btn--ghost', () => {
    create({ variant: 'ghost' });
    expect(el.querySelector('button')!.className).toContain('btn--ghost');
  });
});
