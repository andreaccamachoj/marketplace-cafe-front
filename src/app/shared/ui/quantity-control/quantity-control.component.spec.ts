import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantityControlComponent } from './quantity-control.component';

describe('QuantityControlComponent', () => {
  let fixture: ComponentFixture<QuantityControlComponent>;
  let component: QuantityControlComponent;
  let el: HTMLElement;

  function create(inputs: Partial<QuantityControlComponent> = {}) {
    fixture   = TestBed.createComponent(QuantityControlComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function buttons() {
    const btns = el.querySelectorAll<HTMLButtonElement>('button');
    return { dec: btns[0], inc: btns[1] };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [QuantityControlComponent] }).compileComponents();
  });

  it('renders decrement and increment buttons', () => {
    create();
    const { dec, inc } = buttons();
    expect(dec).toBeTruthy();
    expect(inc).toBeTruthy();
  });

  it('shows initial quantity of 1', () => {
    create();
    expect(el.querySelector('.qty__value')!.textContent?.trim()).toBe('1');
  });

  it('writeValue sets the displayed quantity', () => {
    create();
    component.writeValue(5);
    fixture.detectChanges();
    expect(el.querySelector('.qty__value')!.textContent?.trim()).toBe('5');
  });

  it('increment increases quantity', () => {
    create();
    buttons().inc.click();
    fixture.detectChanges();
    expect(component['qty']()).toBe(2);
  });

  it('decrement decreases quantity', () => {
    create();
    component.writeValue(3);
    fixture.detectChanges();
    buttons().dec.click();
    fixture.detectChanges();
    expect(component['qty']()).toBe(2);
  });

  it('decrement does not go below min', () => {
    create({ min: 1 });
    buttons().dec.click();
    fixture.detectChanges();
    expect(component['qty']()).toBe(1);
  });

  it('increment does not exceed max', () => {
    create({ max: 2 });
    component.writeValue(2);
    fixture.detectChanges();
    buttons().inc.click();
    fixture.detectChanges();
    expect(component['qty']()).toBe(2);
  });

  it('decrement button is disabled when qty equals min', () => {
    create({ min: 1 });
    expect(buttons().dec.disabled).toBeTrue();
  });

  it('increment button is disabled when qty equals max', () => {
    create({ max: 1 });
    component.writeValue(1);
    fixture.detectChanges();
    expect(buttons().inc.disabled).toBeTrue();
  });

  it('emits quantityChange on increment', () => {
    create();
    const spy = jasmine.createSpy('quantityChange');
    component.quantityChange.subscribe(spy);
    buttons().inc.click();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('emits quantityChange on decrement', () => {
    create({ min: 0 });
    component.writeValue(2);
    fixture.detectChanges();
    const spy = jasmine.createSpy('quantityChange');
    component.quantityChange.subscribe(spy);
    buttons().dec.click();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('calls onChange on increment', () => {
    create();
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    buttons().inc.click();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('setDisabledState disables both buttons', () => {
    create();
    component.writeValue(3);
    fixture.detectChanges();
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(buttons().dec.disabled).toBeTrue();
    expect(buttons().inc.disabled).toBeTrue();
  });

  it('respects custom step on increment', () => {
    create({ step: 5 });
    buttons().inc.click();
    fixture.detectChanges();
    expect(component['qty']()).toBe(6);
  });
});
