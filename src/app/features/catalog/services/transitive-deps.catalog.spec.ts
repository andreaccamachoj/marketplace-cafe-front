/**
 * Catalog integration spec: exercises transitive service dependencies
 * (FavoritesService, CartService) that are loaded when running catalog tests
 * but not directly instantiated via mocks.
 */
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FavoritesService } from '@features/buyer/services/favorites.service';
import { CartService } from '@features/buyer/services/cart.service';
import { ProductService } from './product.service';
import { AuthService } from '@core/auth/services/auth.service';

const mockProduct: any = {
  id: 'p1', name: 'Café Test', producerName: 'Finca', region: 'Huila',
  price: 25000, images: ['img.jpg'], rating: 4.5, category: 'Especial',
  certifications: [], unit: '250g', description: 'Bueno',
  presentationTypes: [], stock: 50, soldCount: 10, reviewCount: 5, emoji: '☕',
};

describe('FavoritesService (catalog integration)', () => {
  let service: FavoritesService;
  let http: HttpTestingController;
  let mockProductSvc: any;

  beforeEach(() => {
    mockProductSvc = {
      list: jasmine.createSpy('list').and.returnValue([]),
      getByIdSync: jasmine.createSpy('getByIdSync').and.returnValue(undefined),
      count: signal(0),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID,  useValue: 'browser' },
        { provide: ProductService, useValue: mockProductSvc },
        FavoritesService,
      ],
    });
    service = TestBed.inject(FavoritesService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('initializes and makes load HTTP call', () => {
    const req = http.expectOne('/favorites');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    expect(service.count()).toBe(0);
  });

  it('isFavorite returns false when favorites is empty', () => {
    http.expectOne('/favorites').flush([]);
    expect(service.isFavorite('p1')).toBeFalse();
  });

  it('add() sends POST to /favorites/:id', () => {
    http.expectOne('/favorites').flush([]);
    service.add(mockProduct);
    const req = http.expectOne('/favorites/p1');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'fav1', productId: 'p1', addedAt: new Date().toISOString() });
    expect(service.count()).toBe(1);
  });

  it('add() does not add duplicate favorites', () => {
    http.expectOne('/favorites').flush([
      { id: 'fav1', productId: 'p1', addedAt: new Date().toISOString() }
    ]);
    expect(service.isFavorite('p1')).toBeTrue();
    service.add(mockProduct);
    http.expectNone('/favorites/p1');
  });

  it('remove() sends DELETE to /favorites/:productId', () => {
    http.expectOne('/favorites').flush([
      { id: 'fav1', productId: 'p1', addedAt: new Date().toISOString() }
    ]);
    service.remove('p1');
    const req = http.expectOne('/favorites/p1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(service.isFavorite('p1')).toBeFalse();
  });

  it('toggle() adds when not favorite', () => {
    http.expectOne('/favorites').flush([]);
    service.toggle(mockProduct);
    const req = http.expectOne('/favorites/p1');
    req.flush({ id: 'fav1', productId: 'p1', addedAt: new Date().toISOString() });
    expect(service.count()).toBe(1);
  });

  it('toggle() removes when already favorite', () => {
    http.expectOne('/favorites').flush([
      { id: 'fav1', productId: 'p1', addedAt: new Date().toISOString() }
    ]);
    service.toggle(mockProduct);
    const req = http.expectOne('/favorites/p1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('load() on server platform is a no-op', () => {
    http.expectOne('/favorites').flush([]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ProductService, useValue: mockProductSvc },
        FavoritesService,
      ],
    });
    const serverSvc = TestBed.inject(FavoritesService);
    const serverHttp = TestBed.inject(HttpTestingController);
    serverHttp.expectNone('/favorites');
    serverSvc.load();
    serverHttp.expectNone('/favorites');
    serverHttp.verify();
  });

  it('enrich() uses product data when found', () => {
    mockProductSvc.getByIdSync.and.returnValue(mockProduct);
    http.expectOne('/favorites').flush([
      { id: 'fav1', productId: 'p1', addedAt: '2025-01-01T00:00:00Z' }
    ]);
    expect(service.all()[0].productName).toBe('Café Test');
  });

  it('fromProduct() is used when POST response has no id', () => {
    http.expectOne('/favorites').flush([]);
    service.add(mockProduct);
    const req = http.expectOne('/favorites/p1');
    req.flush(null);
    expect(service.count()).toBe(1);
    expect(service.all()[0].productName).toBe('Café Test');
  });
});

describe('CartService (catalog integration)', () => {
  let service: CartService;
  let http: HttpTestingController;
  let mockAuthSvc: any;

  beforeEach(() => {
    mockAuthSvc = {
      isAuthenticated: signal(false),
      isBuyer: signal(false),
      currentUser: signal(null),
      currentRole: signal(null),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: mockAuthSvc },
        CartService,
      ],
    });
    service = TestBed.inject(CartService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const backendCart = (items: any[] = []) => ({
    id: 'cart1', items, couponCode: null, shippingOptionId: null,
  });

  const cartItem = (id: string) => ({
    id, productId: 'p1', productName: 'Café', producerName: 'Finca',
    price: 25000, quantity: 1, emoji: '☕', maxStock: 99,
  });

  it('initializes with cart load HTTP call', () => {
    const req = http.expectOne('/cart');
    expect(req.request.method).toBe('GET');
    req.flush(backendCart());
    expect(service.count()).toBe(0);
  });

  it('add() sends POST to /cart/items', () => {
    http.expectOne('/cart').flush(backendCart());
    service.add({ id: 'p1', productId: 'p1', name: 'Café', producer: 'Finca', price: 25000, emoji: '☕', organic: false, fairTrade: false, maxStock: 99 });
    const req = http.expectOne('/cart/items');
    expect(req.request.method).toBe('POST');
    req.flush(backendCart([cartItem('i1')]));
    expect(service.count()).toBe(1);
  });

  it('add() does nothing when authenticated as non-buyer', () => {
    http.expectOne('/cart').flush(backendCart());
    mockAuthSvc.isAuthenticated = () => true;
    mockAuthSvc.isBuyer = () => false;
    service.add({ id: 'p1', productId: 'p1', name: 'Café', producer: 'Finca', price: 25000, emoji: '☕', organic: false, fairTrade: false, maxStock: 99 });
    http.expectNone('/cart/items');
  });

  it('remove() sends DELETE to /cart/items/:id', () => {
    http.expectOne('/cart').flush(backendCart([cartItem('i1')]));
    service.remove('i1');
    const req = http.expectOne('/cart/items/i1');
    expect(req.request.method).toBe('DELETE');
    req.flush(backendCart());
  });

  it('updateQty() sends PATCH to /cart/items/:id', () => {
    http.expectOne('/cart').flush(backendCart([cartItem('i1')]));
    service.updateQty('i1', 3);
    const req = http.expectOne('/cart/items/i1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity: 3 });
    req.flush(backendCart());
  });

  it('selectShipping() updates shippingOptionId', () => {
    http.expectOne('/cart').flush(backendCart());
    service.selectShipping('express');
    const req = http.expectOne('/cart/shipping');
    req.flush(backendCart());
    expect(service.shippingOptionId()).toBe('express');
  });

  it('applyCoupon() sends POST to /cart/coupon', () => {
    http.expectOne('/cart').flush(backendCart());
    service.applyCoupon('PROMO10');
    const req = http.expectOne('/cart/coupon');
    expect(req.request.method).toBe('POST');
    req.flush(backendCart());
  });

  it('removeCoupon() sends DELETE to /cart/coupon', () => {
    http.expectOne('/cart').flush(backendCart());
    service.removeCoupon();
    const req = http.expectOne('/cart/coupon');
    expect(req.request.method).toBe('DELETE');
    req.flush(backendCart());
  });

  it('clear() sends DELETE to /cart', () => {
    http.expectOne('/cart').flush(backendCart([cartItem('i1')]));
    service.clear();
    const req = http.expectOne('/cart');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(service.count()).toBe(0);
  });

  it('subtotal computed sums price × qty', () => {
    http.expectOne('/cart').flush(backendCart([
      { ...cartItem('i1'), price: 25000, quantity: 2 },
    ]));
    expect(service.subtotal()).toBe(50000);
  });
});
