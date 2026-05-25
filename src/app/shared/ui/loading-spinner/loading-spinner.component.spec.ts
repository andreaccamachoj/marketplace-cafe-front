import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let el: HTMLElement;

  function create(inputs: Partial<{ size: LoadingSpinnerComponent['size']; label: string; overlay: boolean }> = {}) {
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    Object.assign(fixture.componentInstance, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadingSpinnerComponent] }).compileComponents();
  });

  it('renders the spinner container', () => {
    create();
    expect(el.querySelector('.spinner')).toBeTruthy();
  });

  it('applies default md size class', () => {
    create();
    expect(el.querySelector('.spinner')!.className).toContain('spinner--md');
  });

  it('applies lg size class', () => {
    create({ size: 'lg' });
    expect(el.querySelector('.spinner')!.className).toContain('spinner--lg');
  });

  it('applies sm size class', () => {
    create({ size: 'sm' });
    expect(el.querySelector('.spinner')!.className).toContain('spinner--sm');
  });

  it('shows default label in sr-only span', () => {
    create();
    expect(el.querySelector('.sr-only')!.textContent).toContain('Cargando');
  });

  it('shows custom label', () => {
    create({ label: 'Por favor espera' });
    expect(el.querySelector('.sr-only')!.textContent).toContain('Por favor espera');
  });

  it('sets aria-label from label input', () => {
    create({ label: 'Procesando' });
    expect(el.querySelector('.spinner')!.getAttribute('aria-label')).toBe('Procesando');
  });

  it('does not apply overlay class by default', () => {
    create();
    expect(el.querySelector('.spinner')!.className).not.toContain('spinner--overlay');
  });

  it('applies overlay class when overlay=true', () => {
    create({ overlay: true });
    expect(el.querySelector('.spinner')!.className).toContain('spinner--overlay');
  });

  it('has role="status"', () => {
    create();
    expect(el.querySelector('.spinner')!.getAttribute('role')).toBe('status');
  });

  it('renders SVG circle elements', () => {
    create();
    expect(el.querySelectorAll('circle').length).toBeGreaterThanOrEqual(2);
  });
});
