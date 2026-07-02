import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductCtaComponent } from './product-cta.component';
import { QuantityControlComponent } from '@shared/ui/quantity-control/quantity-control.component';

describe('ProductCtaComponent', () => {
  let fixture: ComponentFixture<ProductCtaComponent>;
  let component: ProductCtaComponent;
  let el: HTMLElement;

  function create(overrides: Partial<{
    price: number; originalPrice: number; discountPercent: number;
    unit: string; stock: number; maxStock: number;
    producerName: string; region: string; canPurchase: boolean;
  }> = {}) {
    fixture   = TestBed.createComponent(ProductCtaComponent);
    component = fixture.componentInstance;
    component.price         = 25000;
    component.originalPrice = undefined;
    component.discountPercent = undefined;
    component.unit          = '250g';
    component.stock         = 50;
    component.maxStock      = 100;
    component.producerName  = 'Finca El Paraíso';
    component.region        = 'Huila';
    fixture.componentRef.setInput('canPurchase', overrides.canPurchase ?? true);
    if (overrides.price !== undefined)        component.price         = overrides.price;
    if (overrides.originalPrice !== undefined) component.originalPrice = overrides.originalPrice;
    if (overrides.discountPercent !== undefined) component.discountPercent = overrides.discountPercent;
    if (overrides.unit !== undefined)         component.unit          = overrides.unit;
    if (overrides.stock !== undefined)        component.stock         = overrides.stock;
    if (overrides.maxStock !== undefined)     component.maxStock      = overrides.maxStock;
    if (overrides.producerName !== undefined) component.producerName  = overrides.producerName;
    if (overrides.region !== undefined)       component.region        = overrides.region;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductCtaComponent] }).compileComponents();
  });

  it('renders price', () => {
    create();
    expect(el.querySelector('.price-main')).toBeTruthy();
  });

  it('renders unit', () => {
    create({ unit: '500g' });
    expect(el.textContent).toContain('500g');
  });

  it('shows original price when discount exists', () => {
    create({ price: 25000, originalPrice: 30000, discountPercent: 17 });
    expect(el.querySelector('.price-original')).toBeTruthy();
    expect(el.querySelector('.price-discount-badge')).toBeTruthy();
  });

  it('does not show discount badge without originalPrice', () => {
    create({ originalPrice: undefined });
    expect(el.querySelector('.price-discount-badge')).toBeNull();
  });

  it('shows stock availability text when stock > 10', () => {
    create({ stock: 50 });
    expect(el.textContent).toContain('50 unidades disponibles');
  });

  it('shows "Quedan X" when stock <= 10', () => {
    create({ stock: 5 });
    expect(el.textContent).toContain('Quedan 5 unidades');
  });

  it('shows "Sin stock" when stock is 0', () => {
    create({ stock: 0 });
    expect(el.textContent).toContain('Sin stock');
  });

  it('shows CTA buttons when canPurchase is true', () => {
    create({ canPurchase: true });
    expect(el.querySelector('.btn-buy-now')).toBeTruthy();
    expect(el.querySelector('.btn-add-cart')).toBeTruthy();
  });

  it('hides CTA buttons when canPurchase is false', () => {
    create({ canPurchase: false });
    expect(el.querySelector('.btn-buy-now')).toBeNull();
    expect(el.querySelector('.btn-add-cart')).toBeNull();
  });

  it('emits buyNow when buy-now button clicked', () => {
    create({ canPurchase: true });
    const spy = jasmine.createSpy('buyNow');
    component.buyNow.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.btn-buy-now')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('emits addToCart when add-cart button clicked', () => {
    create({ canPurchase: true });
    const spy = jasmine.createSpy('addToCart');
    component.addToCart.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.btn-add-cart')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('buy-now button disabled when stock is 0', () => {
    create({ canPurchase: true, stock: 0 });
    expect(el.querySelector<HTMLButtonElement>('.btn-buy-now')!.disabled).toBeTrue();
  });

  it('renders producer mini card when producerName provided', () => {
    create({ producerName: 'Finca Test' });
    expect(el.querySelector('.producer-mini')).toBeTruthy();
    expect(el.textContent).toContain('Finca Test');
  });

  it('renders guarantees section when canPurchase', () => {
    create({ canPurchase: true });
    expect(el.querySelector('.guarantees')).toBeTruthy();
  });

  it('wishlist button toggles state when clicked', () => {
    create({ canPurchase: true });
    expect(component['wishlistActive']()).toBeFalse();
    el.querySelector<HTMLButtonElement>('.btn-wishlist-full')!.click();
    fixture.detectChanges();
    expect(component['wishlistActive']()).toBeTrue();
  });

  it('add-cart button shows "¡Agregado!" after click', () => {
    create({ canPurchase: true });
    el.querySelector<HTMLButtonElement>('.btn-add-cart')!.click();
    fixture.detectChanges();
    expect(component['cartAdded']()).toBeTrue();
    expect(el.querySelector('.btn-add-cart')?.textContent).toContain('¡Agregado!');
  });

  it('stock-warn dot shown when stock <= 10', () => {
    create({ stock: 5 });
    expect(el.querySelector('.stock-dot.warn')).toBeTruthy();
  });

  it('stock-out dot shown when stock = 0', () => {
    create({ stock: 0 });
    expect(el.querySelector('.stock-dot.out')).toBeTruthy();
  });

  it('does not render stock bar when stock = 0', () => {
    create({ stock: 0 });
    expect(el.querySelector('.stock-bar-wrap')).toBeNull();
  });

  it('stockBarWidth returns correct percentage', () => {
    create({ stock: 50, maxStock: 100 });
    expect(component['stockBarWidth']).toBe(50);
  });

  it('stockBarWidth caps at 100 when stock exceeds maxStock', () => {
    create({ stock: 150, maxStock: 100 });
    expect(component['stockBarWidth']).toBe(100);
  });

  it('stockBarWidth uses 100 as default when maxStock is 0', () => {
    create({ stock: 50, maxStock: 0 });
    expect(component['stockBarWidth']).toBe(50);
  });

  it('quantity increments when + button clicked in quantity control', () => {
    create({ canPurchase: true, stock: 50 });
    const incBtn = el.querySelector<HTMLButtonElement>('.qty__btn:last-child')!;
    incBtn.click();
    fixture.detectChanges();
    expect(el.querySelector('.qty__value')?.textContent?.trim()).toBe('2');
  });

  it('quantity decrements when - button clicked after increment', () => {
    create({ canPurchase: true, stock: 50 });
    const incBtn = el.querySelector<HTMLButtonElement>('.qty__btn:last-child')!;
    const decBtn = el.querySelector<HTMLButtonElement>('.qty__btn:first-child')!;
    incBtn.click();
    fixture.detectChanges();
    decBtn.click();
    fixture.detectChanges();
    expect(el.querySelector('.qty__value')?.textContent?.trim()).toBe('1');
  });

  it('QuantityControl writeValue updates qty signal', () => {
    create({ canPurchase: true, stock: 50 });
    const qtyEl = fixture.debugElement.query(By.directive(QuantityControlComponent));
    const qtyComp = qtyEl.componentInstance as QuantityControlComponent;
    qtyComp.writeValue(5);
    fixture.detectChanges();
    expect(el.querySelector('.qty__value')?.textContent?.trim()).toBe('5');
  });

  it('QuantityControl registerOnChange stores the callback', () => {
    create({ canPurchase: true, stock: 50 });
    const qtyEl = fixture.debugElement.query(By.directive(QuantityControlComponent));
    const qtyComp = qtyEl.componentInstance as QuantityControlComponent;
    const spy = jasmine.createSpy('onChange');
    qtyComp.registerOnChange(spy);
    qtyEl.nativeElement.querySelector('.qty__btn:last-child').click();
    expect(spy).toHaveBeenCalled();
  });

  it('QuantityControl registerOnTouched stores the callback', () => {
    create({ canPurchase: true, stock: 50 });
    const qtyEl = fixture.debugElement.query(By.directive(QuantityControlComponent));
    const qtyComp = qtyEl.componentInstance as QuantityControlComponent;
    const spy = jasmine.createSpy('onTouched');
    qtyComp.registerOnTouched(spy);
    qtyEl.nativeElement.querySelector('.qty__btn:last-child').click();
    expect(spy).toHaveBeenCalled();
  });

  it('QuantityControl setDisabledState disables buttons', () => {
    create({ canPurchase: true, stock: 50 });
    const qtyEl = fixture.debugElement.query(By.directive(QuantityControlComponent));
    const qtyComp = qtyEl.componentInstance as QuantityControlComponent;
    qtyComp.setDisabledState(true);
    fixture.detectChanges();
    const buttons = Array.from(qtyEl.nativeElement.querySelectorAll('.qty__btn')) as HTMLButtonElement[];
    expect(buttons.every(b => b.disabled)).toBeTrue();
  });
});
