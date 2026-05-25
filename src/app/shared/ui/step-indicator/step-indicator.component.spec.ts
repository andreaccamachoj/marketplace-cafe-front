import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepIndicatorComponent, IStep } from './step-indicator.component';

const STEPS: IStep[] = [
  { label: 'Datos básicos', description: 'Nombre y correo' },
  { label: 'Contraseña' },
  { label: 'Confirmación' },
];

describe('StepIndicatorComponent', () => {
  let fixture: ComponentFixture<StepIndicatorComponent>;
  let el: HTMLElement;

  function create(steps: IStep[], currentStep = 0) {
    fixture = TestBed.createComponent(StepIndicatorComponent);
    fixture.componentInstance.steps       = steps;
    fixture.componentInstance.currentStep = currentStep;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepIndicatorComponent] }).compileComponents();
  });

  it('renders one step per item', () => {
    create(STEPS);
    expect(el.querySelectorAll('.step').length).toBe(3);
  });

  it('renders step labels', () => {
    create(STEPS);
    const labels = Array.from(el.querySelectorAll('.step__label')).map(s => s.textContent?.trim());
    expect(labels).toContain('Datos básicos');
    expect(labels).toContain('Contraseña');
  });

  it('shows description when provided', () => {
    create(STEPS);
    expect(el.querySelector('.step__desc')!.textContent?.trim()).toBe('Nombre y correo');
  });

  it('active step has step--active class', () => {
    create(STEPS, 1);
    const steps = el.querySelectorAll('.step');
    expect(steps[1].classList).toContain('step--active');
  });

  it('active step has aria-current="step"', () => {
    create(STEPS, 1);
    expect(el.querySelectorAll('.step')[1].getAttribute('aria-current')).toBe('step');
  });

  it('completed steps have step--completed class', () => {
    create(STEPS, 2);
    const steps = el.querySelectorAll('.step');
    expect(steps[0].classList).toContain('step--completed');
    expect(steps[1].classList).toContain('step--completed');
  });

  it('pending steps have step--pending class', () => {
    create(STEPS, 0);
    const steps = el.querySelectorAll('.step');
    expect(steps[1].classList).toContain('step--pending');
    expect(steps[2].classList).toContain('step--pending');
  });

  it('first step has no connector line', () => {
    create(STEPS);
    const firstStep = el.querySelectorAll('.step')[0];
    expect(firstStep.querySelector('.step__connector')).toBeNull();
  });

  it('non-first steps have connector line', () => {
    create(STEPS);
    const secondStep = el.querySelectorAll('.step')[1];
    expect(secondStep.querySelector('.step__connector')).toBeTruthy();
  });

  it('completed step shows checkmark svg', () => {
    create(STEPS, 2);
    const firstCircle = el.querySelectorAll('.step__circle')[0];
    expect(firstCircle.querySelector('svg')).toBeTruthy();
  });

  it('active step shows step number', () => {
    create(STEPS, 1);
    const activeCircle = el.querySelectorAll('.step__circle')[1];
    expect(activeCircle.textContent?.trim()).toBe('2');
  });
});
