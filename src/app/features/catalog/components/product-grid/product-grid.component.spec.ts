import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductGridComponent } from './product-grid.component';
import { FavoritesService } from '@features/buyer/services/favorites.service';
import { IProduct } from '../../models/product.model';

const makeProduct = (id: string): IProduct => ({
  id, name: `Café ${id}`, producerName: 'Finca',
  category: 'Especial', description: 'Bueno', price: 25000,
  unit: '250g', rating: 4.5, reviewCount: 5, stock: 50, soldCount: 10,
  images: [], certifications: [], region: 'Huila', emoji: '☕',
  presentationTypes: [],
} as any);

describe('ProductGridComponent', () => {
  let fixture: ComponentFixture<ProductGridComponent>;
  let component: ProductGridComponent;
  let el: HTMLElement;
  let mockFavSvc: { isFavorite: jasmine.Spy; toggle: jasmine.Spy };

  function create(overrides: Partial<{ products: IProduct[]; loading: boolean; canPurchase: boolean }> = {}) {
    fixture   = TestBed.createComponent(ProductGridComponent);
    component = fixture.componentInstance;
    component.products = overrides.products ?? [];
    component.loading  = overrides.loading  ?? false;
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
      imports: [ProductGridComponent, RouterTestingModule],
      providers: [{ provide: FavoritesService, useValue: mockFavSvc }],
    }).compileComponents();
  });

  it('renders skeleton loaders when loading=true', () => {
    create({ loading: true });
    expect(el.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('renders empty state when products is empty and not loading', () => {
    create({ products: [], loading: false });
    expect(el.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders product grid when products are provided', () => {
    create({ products: [makeProduct('1'), makeProduct('2')] });
    expect(el.querySelector('.product-grid')).toBeTruthy();
  });

  it('renders correct number of product cards', () => {
    create({ products: [makeProduct('1'), makeProduct('2'), makeProduct('3')] });
    expect(el.querySelectorAll('app-product-card').length).toBe(3);
  });

  it('does not render empty state when loading', () => {
    create({ loading: true });
    expect(el.querySelector('app-empty-state')).toBeNull();
  });

  it('does not render skeleton when not loading with products', () => {
    create({ products: [makeProduct('1')], loading: false });
    expect(el.querySelector('app-skeleton')).toBeNull();
  });

  it('emits addToCart when product card emits add', () => {
    create({ products: [makeProduct('1')] });
    const spy = jasmine.createSpy('addToCart');
    component.addToCart.subscribe(spy);
    component['onAddToCart'](makeProduct('1'));
    expect(spy).toHaveBeenCalled();
  });

  it('emits toggleFavorite when product card emits toggleFavorite', () => {
    create({ products: [makeProduct('1')] });
    const spy = jasmine.createSpy('toggleFavorite');
    component.toggleFavorite.subscribe(spy);
    component['onToggleFavorite']('1');
    expect(spy).toHaveBeenCalledWith('1');
  });
});
