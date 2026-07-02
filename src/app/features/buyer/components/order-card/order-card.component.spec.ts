import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderCardComponent, ReviewClickEvent } from './order-card.component';
import { IOrder } from '../../models/order.model';

const MOCK_ORDER: IOrder = {
  id: 'ord-1',
  number: 'WCM-001',
  date: '2025-01-10T10:00:00Z',
  status: 'delivered',
  subtotal: 90000,
  shippingAmount: 0,
  discountAmount: 0,
  total: 90000,
  address: 'Calle 10 # 5-20, Bucaramanga',
  shippingOptionId: 'standard',
  buyerId: 'buyer-1',
  items: [
    {
      productId: 'prod-1',
      name: 'Café Sierra',
      productName: 'Café Sierra',
      qty: 2,
      unitPrice: 45000,
      subtotal: 90000,
      emoji: '☕',
    },
  ],
  steps: [
    { label: 'Pendiente', done: true, active: false },
    { label: 'Entregado', done: true, active: true },
  ],
};

describe('OrderCardComponent', () => {
  let fixture: ComponentFixture<OrderCardComponent>;
  let component: OrderCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', MOCK_ORDER);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits orderToggle with order id when onToggle is called', () => {
    const emitted: string[] = [];
    component.orderToggle.subscribe(v => emitted.push(v));
    (component as any).onToggle();
    expect(emitted).toEqual(['ord-1']);
  });

  it('emits reviewClick with correct data when onItemReviewClick is called', () => {
    const emitted: ReviewClickEvent[] = [];
    component.reviewClick.subscribe(v => emitted.push(v));
    (component as any).onItemReviewClick('prod-1', 'Café Sierra');
    expect(emitted).toEqual([{ orderId: 'ord-1', productId: 'prod-1', productName: 'Café Sierra' }]);
  });

  it('getStatusLabel returns correct label for delivered', () => {
    const label = (component as any).getStatusLabel();
    expect(label).toBe('Entregado');
  });

  it('isDelivered returns true for delivered status', () => {
    expect((component as any).isDelivered()).toBeTrue();
  });

  it('isDelivered returns false for pending_verification status', () => {
    fixture.componentRef.setInput('order', { ...MOCK_ORDER, status: 'pending_verification' });
    fixture.detectChanges();
    expect((component as any).isDelivered()).toBeFalse();
  });

  it('canReviewItem returns true when delivered and not already reviewed', () => {
    fixture.componentRef.setInput('reviewedProductIds', []);
    fixture.detectChanges();
    expect((component as any).canReviewItem('prod-1')).toBeTrue();
  });

  it('canReviewItem returns false when product already reviewed', () => {
    fixture.componentRef.setInput('reviewedProductIds', ['prod-1']);
    fixture.detectChanges();
    expect((component as any).canReviewItem('prod-1')).toBeFalse();
  });

  it('canReviewItem returns false when order not delivered', () => {
    fixture.componentRef.setInput('order', { ...MOCK_ORDER, status: 'confirmed' });
    fixture.componentRef.setInput('reviewedProductIds', []);
    fixture.detectChanges();
    expect((component as any).canReviewItem('prod-1')).toBeFalse();
  });
});
