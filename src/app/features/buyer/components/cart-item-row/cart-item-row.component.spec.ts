import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemRowComponent } from './cart-item-row.component';
import { ICartItem } from '../../models/cart.model';

const MOCK_ITEM: ICartItem = {
  id: 'item-1',
  productId: 'prod-1',
  name: 'Café Sierra Nevada',
  producer: 'Finca El Edén',
  price: 45000,
  qty: 2,
  emoji: '☕',
  organic: true,
  fairTrade: false,
  maxStock: 5,
};

describe('CartItemRowComponent', () => {
  let fixture: ComponentFixture<CartItemRowComponent>;
  let component: CartItemRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemRowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CartItemRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', MOCK_ITEM);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits qtyChange with qty-1 when decrease is called and qty > 1', () => {
    const emitted: { id: string; qty: number }[] = [];
    component.qtyChange.subscribe(v => emitted.push(v));
    (component as any).onDecrease();
    expect(emitted).toEqual([{ id: 'item-1', qty: 1 }]);
  });

  it('does not emit qtyChange when decrease is called and qty === 1', () => {
    fixture.componentRef.setInput('item', { ...MOCK_ITEM, qty: 1 });
    fixture.detectChanges();
    const emitted: unknown[] = [];
    component.qtyChange.subscribe(v => emitted.push(v));
    (component as any).onDecrease();
    expect(emitted.length).toBe(0);
  });

  it('emits qtyChange with qty+1 when increase is called and qty < maxStock', () => {
    const emitted: { id: string; qty: number }[] = [];
    component.qtyChange.subscribe(v => emitted.push(v));
    (component as any).onIncrease();
    expect(emitted).toEqual([{ id: 'item-1', qty: 3 }]);
  });

  it('does not emit qtyChange when increase is called and qty === maxStock', () => {
    fixture.componentRef.setInput('item', { ...MOCK_ITEM, qty: 5 });
    fixture.detectChanges();
    const emitted: unknown[] = [];
    component.qtyChange.subscribe(v => emitted.push(v));
    (component as any).onIncrease();
    expect(emitted.length).toBe(0);
  });

  it('emits remove with item id when onRemove is called', () => {
    const emitted: string[] = [];
    component.remove.subscribe(v => emitted.push(v));
    (component as any).onRemove();
    expect(emitted).toEqual(['item-1']);
  });
});
