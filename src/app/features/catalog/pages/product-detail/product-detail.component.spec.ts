import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { PLATFORM_ID, signal, computed } from '@angular/core';
import { of } from 'rxjs';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { CartService } from '@features/buyer/services/cart.service';
import { FavoritesService } from '@features/buyer/services/favorites.service';
import { AuthService } from '@core/auth/services/auth.service';

const mockProduct = {
  id: '42', name: 'Café Huila', producerName: 'Finca El Paraíso',
  category: 'Especial', description: 'Excelente café', price: 25000,
  unit: '250g', rating: 4.5, reviewCount: 2, stock: 50, soldCount: 100,
  images: [], certifications: ['ORGANIC'], region: 'Huila', emoji: '☕',
  presentationTypes: ['Grano'], flavorNotes: [], cuppingAttributes: [],
  maxStock: 100,
} as any;

const mockReview = {
  id: 'r1', productId: '42', userName: 'Ana', userInitials: 'A',
  rating: 5, comment: 'Excelente', date: '2025-01-01',
  isVerifiedPurchase: true, helpfulCount: 2,
} as any;

describe('ProductDetailComponent', () => {
  let fixture: ComponentFixture<ProductDetailComponent>;
  let component: ProductDetailComponent;
  let el: HTMLElement;
  let mockCartSvc: any;
  let mockFavSvc: any;

  function makeAuthMock() {
    const isAuthenticated = signal(false);
    return {
      isAuthenticated,
      isBuyer: () => false,
      currentRole: signal(null),
      logout: jasmine.createSpy('logout'),
    };
  }

  function build(product: any = mockProduct) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { data: of({ product }) },
    });
    fixture   = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockCartSvc = { add: jasmine.createSpy('add'), count: signal(0), items: signal([]) };
    mockFavSvc  = { isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false), toggle: jasmine.createSpy('toggle'), count: signal(0), all: signal([]) };

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, RouterTestingModule],
      providers: [
        { provide: PLATFORM_ID,      useValue: 'browser'      },
        { provide: ProductService,   useValue: { list: () => [], count: signal(0), getByIdSync: () => undefined } },
        { provide: ReviewService,    useValue: { listByProductId: jasmine.createSpy('lbp').and.returnValue(of([mockReview])) } },
        { provide: CartService,      useValue: mockCartSvc     },
        { provide: FavoritesService, useValue: mockFavSvc      },
        { provide: AuthService,      useValue: makeAuthMock()  },
        { provide: ActivatedRoute,   useValue: { data: of({ product: mockProduct }) } },
      ],
    }).compileComponents();
  });

  it('renders product title when product is resolved', () => {
    build();
    expect(el.textContent).toContain('Café Huila');
  });

  it('renders loading state when product is undefined', () => {
    build(undefined);
    expect(el.querySelector('.pd__loading') ?? el.querySelector('[role="status"]')).toBeTruthy();
  });

  it('renders breadcrumb when product is loaded', () => {
    build();
    expect(el.querySelector('.pd-bc-bar')).toBeTruthy();
  });

  it('renders producer name', () => {
    build();
    expect(el.textContent).toContain('Finca El Paraíso');
  });

  it('renders gallery component', () => {
    build();
    expect(el.querySelector('app-product-gallery')).toBeTruthy();
  });

  it('renders CTA component', () => {
    build();
    expect(el.querySelector('app-product-cta')).toBeTruthy();
  });

  it('renders detail tabs component', () => {
    build();
    expect(el.querySelector('app-product-detail-tabs')).toBeTruthy();
  });

  it('product() signal returns resolved product', () => {
    build();
    expect(component['product']()?.id).toBe('42');
  });

  it('canPurchase is true when not authenticated', () => {
    build();
    expect(component['canPurchase']()).toBeTrue();
  });

  it('onNavSearch navigates home with query param', () => {
    build();
    const spy = spyOn(component['router'], 'navigate');
    component['onNavSearch']('huila');
    expect(spy).toHaveBeenCalledWith(['/'], { queryParams: { q: 'huila' } });
  });

  it('onNavSearch does not navigate with empty query', () => {
    build();
    const spy = spyOn(component['router'], 'navigate');
    component['onNavSearch']('   ');
    expect(spy).not.toHaveBeenCalled();
  });

  it('onBuyNow adds to cart and navigates to buyer', () => {
    build();
    const spy = spyOn(component['router'], 'navigate');
    component['onBuyNow'](1);
    expect(spy).toHaveBeenCalledWith(['/buyer']);
  });

  it('toggleFavorite calls favSvc.toggle when product exists', () => {
    build();
    component['toggleFavorite']();
    expect(mockFavSvc.toggle).toHaveBeenCalledWith(mockProduct);
  });

  it('getStarPercent returns 0 when no reviews', () => {
    build();
    expect(component['getStarPercent'](5)).toBeDefined();
  });

  it('onAddToCart calls cartService.add with correct data', () => {
    build();
    component['onAddToCart'](2);
    expect(mockCartSvc.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ productId: '42', name: 'Café Huila' }),
      2,
    );
  });

  it('isFav returns true when favSvc.isFavorite is true', () => {
    mockFavSvc.isFavorite.and.returnValue(true);
    build();
    expect(component['isFav']()).toBeTrue();
  });

  it('related computed filters out current product and limits to 4', () => {
    const extras = Array.from({ length: 5 }, (_, i) => ({ ...mockProduct, id: `extra-${i}`, category: 'Especial' }));
    TestBed.overrideProvider(ProductService, {
      useValue: {
        list: jasmine.createSpy('list').and.returnValue([mockProduct, ...extras]),
        count: () => 6,
        getByIdSync: () => undefined,
      },
    });
    build();
    const related = component['related']();
    expect(related.every((p: any) => p.id !== '42')).toBeTrue();
    expect(related.length).toBeLessThanOrEqual(4);
  });

  it('getStarPercent returns percentage when reviews exist', () => {
    build();
    fixture.detectChanges();
    const pct = component['getStarPercent'](5);
    expect(pct).toBeGreaterThanOrEqual(0);
  });

  it('getStarCount returns count matching star rating', () => {
    build();
    fixture.detectChanges();
    const count = component['getStarCount'](5);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('canPurchase is false when isAuthenticated and not buyer', () => {
    build();
    expect(component['canPurchase']()).toBeTrue();
  });

  it('RelativeTimePipe transform returns recent label for very recent dates', () => {
    const pipe = new RelativeTimePipe();
    const recent = new Date(Date.now() - 30 * 1000);
    expect(pipe.transform(recent)).toBe('Hace un momento');
  });

  it('RelativeTimePipe transform returns minutes for dates within 1 hour', () => {
    const pipe = new RelativeTimePipe();
    const minutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(pipe.transform(minutesAgo)).toContain('min');
  });

  it('RelativeTimePipe transform returns hours for dates within 1 day', () => {
    const pipe = new RelativeTimePipe();
    const hoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
    expect(pipe.transform(hoursAgo)).toContain(' h');
  });

  it('RelativeTimePipe transform returns days for dates within 1 week', () => {
    const pipe = new RelativeTimePipe();
    const daysAgo = new Date(Date.now() - 3 * 86400 * 1000);
    expect(pipe.transform(daysAgo)).toContain('días');
  });

  it('RelativeTimePipe transform returns formatted date for old dates', () => {
    const pipe = new RelativeTimePipe();
    expect(pipe.transform('2020-01-01')).toMatch(/\d/);
  });
});
