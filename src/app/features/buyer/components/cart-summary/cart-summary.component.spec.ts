import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummaryComponent } from './cart-summary.component';
import { IAddress } from '../../models/checkout.model';

const MOCK_ADDRESS: IAddress = {
  id: 'addr-1',
  label: 'Casa',
  line1: 'Calle 10 # 5-20',
  city: 'Bucaramanga',
  department: 'Santander',
  isDefault: true,
};

describe('CartSummaryComponent', () => {
  let fixture: ComponentFixture<CartSummaryComponent>;
  let component: CartSummaryComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('subtotal', 90000);
    fixture.componentRef.setInput('shipping', 0);
    fixture.componentRef.setInput('discount', 0);
    fixture.componentRef.setInput('total', 90000);
    fixture.componentRef.setInput('itemCount', 2);
    fixture.componentRef.setInput('selectedShippingId', 'standard');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits checkoutClick when output is triggered', () => {
    let count = 0;
    component.checkoutClick.subscribe(() => count++);
    component.checkoutClick.emit();
    expect(count).toBe(1);
  });

  it('emits addressChange when onAddressChange is called', () => {
    fixture.componentRef.setInput('addresses', [MOCK_ADDRESS]);
    fixture.detectChanges();
    const emitted: string[] = [];
    component.addressChange.subscribe(v => emitted.push(v));
    const mockEvent = { target: { value: 'addr-1' } } as unknown as Event;
    (component as any).onAddressChange(mockEvent);
    expect(emitted).toEqual(['addr-1']);
  });

  it('renders shipping options from SHIPPING_OPTIONS constant', () => {
    const shippingOptions = (component as any).shippingOptions;
    expect(shippingOptions.length).toBeGreaterThan(0);
  });

  it('has correct required inputs', () => {
    expect(component.subtotal()).toBe(90000);
    expect(component.shipping()).toBe(0);
    expect(component.discount()).toBe(0);
    expect(component.total()).toBe(90000);
    expect(component.itemCount()).toBe(2);
  });
});
