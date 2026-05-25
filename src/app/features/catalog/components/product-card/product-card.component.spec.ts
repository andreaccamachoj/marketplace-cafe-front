import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductCardComponent } from './product-card.component';
import { FavoritesService } from '@features/buyer/services/favorites.service';
import { IProduct } from '../../models/product.model';

const mockProduct: IProduct = {
  id: '1', name: 'Café Huila', producerName: 'Finca El Paraíso',
  category: 'Especial', description: 'Excelente café', price: 25000,
  unit: '250g', rating: 4.5, reviewCount: 10, stock: 50, soldCount: 100,
  images: [], certifications: ['ORGANIC'] as any, region: 'Huila', emoji: '☕',
  presentationTypes: [],
} as any;

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;
  let el: HTMLElement;
  let mockFavSvc: { isFavorite: jasmine.Spy; toggle: jasmine.Spy };

  function create(overrides: Partial<{ inCart: boolean; canPurchase: boolean }> = {}) {
    fixture   = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    component.inCart  = overrides.inCart ?? false;
    fixture.componentRef.setInput('canPurchase', overrides.canPurchase ?? true);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockFavSvc = {
      isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
      toggle:     jasmine.createSpy('toggle'),
    };

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule],
      providers: [{ provide: FavoritesService, useValue: mockFavSvc }],
    }).compileComponents();
  });

  it('renders product name', () => {
    create();
    expect(el.textContent).toContain('Café Huila');
  });

  it('renders producer name', () => {
    create();
    expect(el.textContent).toContain('Finca El Paraíso');
  });

  it('renders region badge', () => {
    create();
    expect(el.textContent).toContain('Huila');
  });

  it('renders emoji when no images', () => {
    create();
    expect(el.textContent).toContain('☕');
  });

  it('renders certification badges', () => {
    create();
    expect(el.querySelector('.badge')).toBeTruthy();
  });

  it('shows add-to-cart button when canPurchase and stock > 0', () => {
    create({ canPurchase: true });
    expect(el.querySelector('.btn-add-cart')).toBeTruthy();
  });

  it('hides add-to-cart button when canPurchase is false', () => {
    create({ canPurchase: false });
    expect(el.querySelector('.btn-add-cart')).toBeNull();
  });

  it('shows wishlist button when canPurchase is true', () => {
    create({ canPurchase: true });
    expect(el.querySelector('.card-wishlist')).toBeTruthy();
  });

  it('hides wishlist button when canPurchase is false', () => {
    create({ canPurchase: false });
    expect(el.querySelector('.card-wishlist')).toBeNull();
  });

  it('shows "✓ En carrito" when inCart is true', () => {
    create({ inCart: true });
    expect(el.querySelector('.btn-add-cart')?.textContent).toContain('En carrito');
  });

  it('emits add event when cart button clicked', () => {
    create();
    const spy = jasmine.createSpy('add');
    component.add.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.btn-add-cart')!.click();
    expect(spy).toHaveBeenCalledWith(mockProduct);
  });

  it('emits toggleFavorite when wishlist button clicked', () => {
    create({ canPurchase: true });
    const spy = jasmine.createSpy('toggleFavorite');
    component.toggleFavorite.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.card-wishlist')!.click();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('shows "Sin stock" when stock is 0', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 0 });
    fixture.detectChanges();
    expect(el.textContent).toContain('Sin stock');
  });

  it('renders stock progressbar', () => {
    create();
    expect(el.querySelector('[role="progressbar"]')).toBeTruthy();
  });

  it('renders FAIRTRADE cert badge', () => {
    create();
    component.product = { ...mockProduct, certifications: ['FAIRTRADE'] as any };
    fixture.detectChanges();
    expect(el.querySelector('.badge')).toBeTruthy();
  });

  it('shows active wishlist state when isFav returns true', () => {
    mockFavSvc.isFavorite.and.returnValue(true);
    create({ canPurchase: true });
    expect(el.querySelector('.card-wishlist.active')).toBeTruthy();
  });

  it('shows product rating', () => {
    create();
    expect(el.textContent).toContain('4.5');
  });

  it('stockClass returns stock-out when stock is 0', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 0 });
    fixture.detectChanges();
    expect(component['stockClass']()).toBe('stock-out');
  });

  it('stockClass returns stock-high when pct > 60', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 70, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockClass']()).toBe('stock-high');
  });

  it('stockClass returns stock-medium when pct between 20-60', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 40, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockClass']()).toBe('stock-medium');
  });

  it('stockClass returns stock-low when pct <= 20', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 10, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockClass']()).toBe('stock-low');
  });

  it('stockLabel returns Sin stock when stock is 0', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 0 });
    fixture.detectChanges();
    expect(component['stockLabel']()).toBe('Sin stock');
  });

  it('stockLabel returns Stock disponible when pct > 60', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 70, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockLabel']()).toContain('Stock disponible');
  });

  it('stockLabel returns Stock limitado when pct between 20-60', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 40, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockLabel']()).toContain('Stock limitado');
  });

  it('stockLabel returns Últimas unidades when pct <= 20', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 10, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockLabel']()).toContain('Últimas unidades');
  });

  it('stockPct uses maxStock when present', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 50, maxStock: 100 });
    fixture.detectChanges();
    expect(component['stockPct']()).toBe(50);
  });

  it('stockPct falls back to stock when no maxStock', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 30, maxStock: undefined });
    fixture.detectChanges();
    expect(component['stockPct']()).toBe(30);
  });

  it('certBadgeClass returns badge-org for ORGANIC', () => {
    create();
    expect(component['certBadgeClass']('ORGANIC')).toBe('badge-org');
  });

  it('certBadgeClass returns badge-fair for FAIRTRADE', () => {
    create();
    expect(component['certBadgeClass']('FAIRTRADE')).toBe('badge-fair');
  });

  it('certBadgeClass returns badge-rain for RAINFOREST', () => {
    create();
    expect(component['certBadgeClass']('RAINFOREST')).toBe('badge-rain');
  });

  it('certBadgeClass returns empty string for unknown cert', () => {
    create();
    expect(component['certBadgeClass']('OTHER')).toBe('');
  });

  it('certLabel returns Orgánico for ORGANIC', () => {
    create();
    expect(component['certLabel']('ORGANIC')).toBe('Orgánico');
  });

  it('certLabel returns Fairtrade for FAIRTRADE', () => {
    create();
    expect(component['certLabel']('FAIRTRADE')).toBe('Fairtrade');
  });

  it('certLabel returns Rainforest for RAINFOREST', () => {
    create();
    expect(component['certLabel']('RAINFOREST')).toBe('Rainforest');
  });

  it('certLabel returns cert code for unknown cert', () => {
    create();
    expect(component['certLabel']('CUSTOM')).toBe('CUSTOM');
  });

  it('starsHtml includes half star when rating has 0.5 decimal', () => {
    create();
    expect(component['starsHtml'](4.5)).toContain('½');
  });

  it('starsHtml has no half star when rating is whole number', () => {
    create();
    expect(component['starsHtml'](4)).not.toContain('½');
  });

  it('onAdd does not emit when stock is 0', () => {
    create();
    fixture.componentRef.setInput('product', { ...mockProduct, stock: 0 });
    fixture.detectChanges();
    const spy = jasmine.createSpy('add');
    component.add.subscribe(spy);
    component['onAdd']();
    expect(spy).not.toHaveBeenCalled();
  });
});
