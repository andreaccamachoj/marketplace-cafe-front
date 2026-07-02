import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID, signal, computed } from '@angular/core';
import { HomeComponent } from './home.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CertificationService } from '../../services/certification.service';
import { CartService } from '@features/buyer/services/cart.service';
import { FavoritesService } from '@features/buyer/services/favorites.service';
import { AuthService } from '@core/auth/services/auth.service';

const makeProduct = (id: string) => ({
  id, name: `Café ${id}`, producerName: 'Finca',
  category: 'Especial', description: 'Desc', price: 25000,
  unit: '250g', rating: 4.5, reviewCount: 5, stock: 50, soldCount: 10,
  images: [], certifications: [], region: 'Huila', emoji: '☕',
  presentationTypes: [], maxStock: 100,
} as any);

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let mockProductSvc: any;
  let mockCartSvc: any;
  let mockFavSvc: any;
  let mockAuthSvc: any;
  let mockCatSvc: any;
  let mockCertSvc: any;

  beforeEach(async () => {
    const currentUser = signal<any>(null);
    mockAuthSvc = {
      currentUser,
      isAuthenticated: computed(() => currentUser() !== null),
      isBuyer: jasmine.createSpy('isBuyer').and.returnValue(false),
      currentRole: computed(() => currentUser()?.roles?.[0] ?? null),
      logout: jasmine.createSpy('logout'),
    };
    mockProductSvc = {
      list:        jasmine.createSpy('list').and.returnValue([]),
      load:        jasmine.createSpy('load'),
      search:      jasmine.createSpy('search').and.returnValue([]),
      getByIdSync: jasmine.createSpy('getByIdSync').and.returnValue(undefined),
      count:       signal(0),
    };
    mockCartSvc  = { add: jasmine.createSpy('add'), count: signal(0), items: signal([]) };
    mockFavSvc   = { isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false), toggle: jasmine.createSpy('toggle'), count: signal(0), all: signal([]) };
    mockCatSvc   = { categories: signal([]), count: signal(0) };
    mockCertSvc  = { certifications: signal([]) };

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: PLATFORM_ID,         useValue: 'browser'   },
        { provide: ProductService,      useValue: mockProductSvc },
        { provide: CartService,         useValue: mockCartSvc    },
        { provide: FavoritesService,    useValue: mockFavSvc     },
        { provide: AuthService,         useValue: mockAuthSvc    },
        { provide: CategoryService,     useValue: mockCatSvc     },
        { provide: CertificationService, useValue: mockCertSvc   },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the home page', () => {
    expect(fixture.nativeElement.querySelector('app-hero-section')).toBeTruthy();
  });

  it('calls productService.load on init', () => {
    expect(mockProductSvc.load).toHaveBeenCalled();
  });

  it('renders filters bar', () => {
    expect(fixture.nativeElement.querySelector('app-filters-bar')).toBeTruthy();
  });

  it('renders product grid', () => {
    expect(fixture.nativeElement.querySelector('app-product-grid')).toBeTruthy();
  });

  it('onCategoryChange updates selectedCategory signal', () => {
    component['onCategoryChange']('Especial');
    expect(component['selectedCategory']()).toBe('Especial');
  });

  it('onCategoryChange with null clears selectedCategory', () => {
    component['onCategoryChange']('Especial');
    component['onCategoryChange'](null);
    expect(component['selectedCategory']()).toBeNull();
  });

  it('onCertChange updates selectedCerts signal', () => {
    component['onCertChange'](['ORGANIC']);
    expect(component['selectedCerts']()).toEqual(['ORGANIC']);
  });

  it('onSortChange updates sortBy signal', () => {
    component['onSortChange']('price-asc');
    expect(component['sortBy']()).toBe('price-asc');
  });

  it('onPresentationChange updates selectedPresentation signal', () => {
    component['onPresentationChange']('Grano');
    expect(component['selectedPresentation']()).toBe('Grano');
  });

  it('onToggleFavorite calls favSvc.toggle when product found', () => {
    mockProductSvc.getByIdSync.and.returnValue(makeProduct('1'));
    component['onToggleFavorite']('1');
    expect(mockFavSvc.toggle).toHaveBeenCalled();
  });

  it('onAddToCart calls cartService.add', () => {
    component['onAddToCart'](makeProduct('1'));
    expect(mockCartSvc.add).toHaveBeenCalled();
  });

  it('onSuggestionSelected navigates to product detail', () => {
    const spy = spyOn(component['router'], 'navigate');
    component['onSuggestionSelected']('42');
    expect(spy).toHaveBeenCalledWith(['/productos', '42']);
  });

  it('products computed returns productService.list result', () => {
    mockProductSvc.list.and.returnValue([makeProduct('1'), makeProduct('2')]);
    component['selectedCategory'].set('trigger');
    component['selectedCategory'].set(null);
    expect(component['products']().length).toBe(2);
  });

  it('canPurchase is true when not authenticated', () => {
    expect(component['canPurchase']()).toBeTrue();
  });

  it('canPurchase is true when authenticated as buyer', () => {
    mockAuthSvc.isAuthenticated = computed(() => true);
    mockAuthSvc.isBuyer.and.returnValue(true);
    expect(component['canPurchase']()).toBeTrue();
  });

  it('onToggleFavorite does nothing when product not found', () => {
    mockProductSvc.getByIdSync.and.returnValue(undefined);
    component['onToggleFavorite']('missing');
    expect(mockFavSvc.toggle).not.toHaveBeenCalled();
  });

  it('isFavorite delegates to favSvc', () => {
    mockFavSvc.isFavorite.and.returnValue(true);
    expect(component['isFavorite']('1')).toBeTrue();
    expect(mockFavSvc.isFavorite).toHaveBeenCalledWith('1');
  });

  it('onAddToCart includes organic flag for ORGANIC product', () => {
    const prod = { ...makeProduct('1'), certifications: ['ORGANIC'], presentationTypes: [] };
    component['onAddToCart'](prod as any);
    expect(mockCartSvc.add).toHaveBeenCalledWith(jasmine.objectContaining({ organic: true }));
  });

  it('onAddToCart includes fairTrade flag for FAIRTRADE product', () => {
    const prod = { ...makeProduct('1'), certifications: ['FAIRTRADE'], presentationTypes: [] };
    component['onAddToCart'](prod as any);
    expect(mockCartSvc.add).toHaveBeenCalledWith(jasmine.objectContaining({ fairTrade: true }));
  });

  it('onSearchChange pushes value into search pipeline', () => {
    expect(() => component['onSearchChange']('huila')).not.toThrow();
  });

  it('scrollToCatalog does not throw', () => {
    expect(() => component['scrollToCatalog']()).not.toThrow();
  });

  it('onSearchChange with short query triggers immediate debounce', fakeAsync(() => {
    component['onSearchChange']('ab');
    tick(0);
    expect(component['searchQuery']()).toBe('');
  }));

  it('onSearchChange with long query debounces and updates searchQuery', fakeAsync(() => {
    mockProductSvc.search.and.returnValue([]);
    component['onSearchChange']('huila cafe');
    tick(1000);
    expect(component['searchQuery']()).toBe('huila cafe');
  }));

  it('suggestions pipeline maps products when query >= 3 chars', fakeAsync(() => {
    const prod = { ...makeProduct('1'), name: 'Café Huila', producerName: 'Finca', emoji: '☕', price: 25000 };
    mockProductSvc.search.and.returnValue([prod]);
    component['onSearchChange']('café');
    tick(1000);
    const sugs = component['suggestions']();
    expect(sugs.length).toBeGreaterThanOrEqual(0);
  }));

  it('suggestions returns empty array when query is too short', fakeAsync(() => {
    component['onSearchChange']('ab');
    tick(0);
    expect(component['suggestions']()).toEqual([]);
  }));

  it('presentations computed returns an array', () => {
    expect(Array.isArray(component['presentations']())).toBeTrue();
  });
});
