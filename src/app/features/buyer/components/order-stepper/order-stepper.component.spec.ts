import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderStepperComponent } from './order-stepper.component';
import { IOrderStep } from '../../models/order.model';

const MOCK_STEPS: IOrderStep[] = [
  { label: 'Pendiente', done: true, active: false },
  { label: 'Confirmado', done: true, active: false },
  { label: 'En camino', done: false, active: true },
  { label: 'Entregado', done: false, active: false },
];

describe('OrderStepperComponent', () => {
  let fixture: ComponentFixture<OrderStepperComponent>;
  let component: OrderStepperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStepperComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrderStepperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', MOCK_STEPS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives steps input correctly', () => {
    expect(component.steps()).toEqual(MOCK_STEPS);
    expect(component.steps().length).toBe(4);
  });

  it('renders with empty steps array', () => {
    fixture.componentRef.setInput('steps', []);
    fixture.detectChanges();
    expect(component.steps().length).toBe(0);
  });

  it('reflects done and active states in steps', () => {
    const steps = component.steps();
    expect(steps[0].done).toBeTrue();
    expect(steps[2].active).toBeTrue();
    expect(steps[3].done).toBeFalse();
  });
});
