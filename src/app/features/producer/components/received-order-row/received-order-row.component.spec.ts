import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceivedOrderRowComponent } from './received-order-row.component';
import { IReceivedOrder } from '../../models/received-order.model';

const MOCK_ORDER: IReceivedOrder = {
  id: 'ord-1', number: 'WCM-001', buyerName: 'Ana García', buyerInitials: 'AG',
  buyerCity: 'Medellín', date: '10 ene. 2025', status: 'confirmed',
  items: [
    { name: 'Café Sierra', qty: 2, emoji: '☕' },
    { name: 'Café Nariño', qty: 1, emoji: '🌿' },
  ],
  total: 90000, shipping: 'standard',
};

describe('ReceivedOrderRowComponent', () => {
  let fixture: ComponentFixture<ReceivedOrderRowComponent>;
  let component: ReceivedOrderRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedOrderRowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ReceivedOrderRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', MOCK_ORDER);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('itemsLabel shows N productos for multiple items', () => {
    expect(component['itemsLabel']()).toBe('2 productos');
  });

  it('itemsLabel shows 1 producto for single item', () => {
    fixture.componentRef.setInput('order', { ...MOCK_ORDER, items: [{ name: 'Café', qty: 1, emoji: '☕' }] });
    fixture.detectChanges();
    expect(component['itemsLabel']()).toBe('1 producto');
  });

  it('statusSelectClass contains confirmed class', () => {
    expect(component['statusSelectClass']()).toContain('ss-confirmed');
  });

  it('statusSelectClass contains preparing class for preparing orders', () => {
    fixture.componentRef.setInput('order', { ...MOCK_ORDER, status: 'preparing' });
    fixture.detectChanges();
    expect(component['statusSelectClass']()).toContain('ss-preparing');
  });

  it('isDisabled returns true for already-passed statuses', () => {
    expect(component['isDisabled']('confirmed')).toBe(true);
  });

  it('isDisabled returns false for forward statuses', () => {
    expect(component['isDisabled']('preparing')).toBe(false);
  });

  it('statusChange emits id and new status', () => {
    let emitted: { id: string; status: string } | undefined;
    component.statusChange.subscribe(e => (emitted = e));
    const event = { target: { value: 'preparing' } } as unknown as Event;
    component['onStatusChange'](event);
    expect(emitted).toEqual({ id: 'ord-1', status: 'preparing' });
  });
});
