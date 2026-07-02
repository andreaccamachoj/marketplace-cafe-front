import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingSelectorComponent } from './shipping-selector.component';
import { IShippingOption } from '../../models/shipping.model';

const MOCK_OPTIONS: IShippingOption[] = [
  { id: 'standard', name: 'Envío estándar', days: '5–8 días hábiles', price: 0 },
  { id: 'express', name: 'Envío express', days: '2–3 días hábiles', price: 12000 },
];

describe('ShippingSelectorComponent', () => {
  let fixture: ComponentFixture<ShippingSelectorComponent>;
  let component: ShippingSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingSelectorComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ShippingSelectorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', MOCK_OPTIONS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives options input correctly', () => {
    expect(component.options()).toEqual(MOCK_OPTIONS);
    expect(component.options().length).toBe(2);
  });

  it('selected defaults to null', () => {
    expect(component.selected()).toBeNull();
  });

  it('reflects selected input when set', () => {
    fixture.componentRef.setInput('selected', 'standard');
    fixture.detectChanges();
    expect(component.selected()).toBe('standard');
  });

  it('selectedChange output can emit', () => {
    const emitted: string[] = [];
    component.selectedChange.subscribe(v => emitted.push(v));
    component.selectedChange.emit('express');
    expect(emitted).toEqual(['express']);
  });
});
