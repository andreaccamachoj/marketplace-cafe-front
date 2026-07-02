import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutOverlayComponent } from './checkout-overlay.component';
import { PaymentMethodService } from '../../services/payment-method.service';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { IAddress } from '../../models/checkout.model';

const MOCK_ADDRESS: IAddress = {
  id: 'addr-1',
  label: 'Casa',
  line1: 'Calle 10 # 5-20',
  city: 'Bucaramanga',
  department: 'Santander',
  isDefault: true,
};

describe('CheckoutOverlayComponent', () => {
  let fixture: ComponentFixture<CheckoutOverlayComponent>;
  let component: CheckoutOverlayComponent;
  let paymentSvcSpy: jasmine.SpyObj<PaymentMethodService>;

  beforeEach(async () => {
    const _methods = signal<any[]>([]);
    paymentSvcSpy = jasmine.createSpyObj('PaymentMethodService', [], {
      paymentMethods: _methods.asReadonly(),
    });

    await TestBed.configureTestingModule({
      imports: [CheckoutOverlayComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PaymentMethodService, useValue: paymentSvcSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutOverlayComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits confirmed when onConfirm is called and not confirming', () => {
    let count = 0;
    component.confirmed.subscribe(() => count++);
    fixture.componentRef.setInput('confirming', false);
    fixture.detectChanges();
    (component as any).onConfirm();
    expect(count).toBe(1);
  });

  it('does not emit confirmed when confirming is true', () => {
    let count = 0;
    component.confirmed.subscribe(() => count++);
    fixture.componentRef.setInput('confirming', true);
    fixture.detectChanges();
    (component as any).onConfirm();
    expect(count).toBe(0);
  });

  it('emits cancelled when onCancel is called and not confirming', () => {
    let count = 0;
    component.cancelled.subscribe(() => count++);
    fixture.componentRef.setInput('confirming', false);
    fixture.detectChanges();
    (component as any).onCancel();
    expect(count).toBe(1);
  });

  it('does not emit cancelled when confirming is true', () => {
    let count = 0;
    component.cancelled.subscribe(() => count++);
    fixture.componentRef.setInput('confirming', true);
    fixture.detectChanges();
    (component as any).onCancel();
    expect(count).toBe(0);
  });

  it('emits cancelled on backdrop click when not confirming', () => {
    let count = 0;
    component.cancelled.subscribe(() => count++);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('confirming', false);
    fixture.detectChanges();
    (component as any).onBackdropClick();
    expect(count).toBe(1);
  });

  it('emits cancelled on Escape when open and not confirming', () => {
    let count = 0;
    component.cancelled.subscribe(() => count++);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('confirming', false);
    fixture.detectChanges();
    (component as any).onEscape();
    expect(count).toBe(1);
  });

  it('does not emit cancelled on Escape when closed', () => {
    let count = 0;
    component.cancelled.subscribe(() => count++);
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    (component as any).onEscape();
    expect(count).toBe(0);
  });

  it('renders selectedAddress info when provided', () => {
    fixture.componentRef.setInput('selectedAddress', MOCK_ADDRESS);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(component.selectedAddress()).toEqual(MOCK_ADDRESS);
  });
});
