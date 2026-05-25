import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from '@core/auth/services/auth.service';

function makeAuthSpy(authenticated = true, isBuyer = true) {
  return jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'isBuyer'], {});
}

describe('CartService', () => {
  let service: CartService;
  let http: HttpTestingController;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'isBuyer']);
    authSpy.isAuthenticated.and.returnValue(true);
    authSpy.isBuyer.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: authSpy },
      ],
    });

    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CartService);
    http.expectOne('/cart').flush({ id: 'c1', items: [], couponCode: null, shippingOptionId: null });
  });

  afterEach(() => http.verify());

  it('starts with empty items', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('add() posts to /cart/items and updates items', () => {
    const item = { id: 'i1', productId: 'p1', name: 'Café', producer: 'Prod', price: 10000, emoji: '☕', organic: false, fairTrade: false, maxStock: 10 };
    service.add(item, 2);
    const req = http.expectOne('/cart/items');
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 'c1',
      items: [{ id: 'i1', productId: 'p1', productName: 'Café', producerName: 'Prod', price: 10000, quantity: 2, emoji: '☕', maxStock: 10 }],
      couponCode: null, shippingOptionId: null,
    });
    expect(service.items().length).toBe(1);
    expect(service.count()).toBe(2);
  });

  it('add() does nothing if authenticated non-buyer', () => {
    authSpy.isAuthenticated.and.returnValue(true);
    authSpy.isBuyer.and.returnValue(false);
    const item = { id: 'i1', productId: 'p1', name: 'Café', producer: 'Prod', price: 10000, emoji: '☕', organic: false, fairTrade: false, maxStock: 10 };
    service.add(item);
    http.expectNone('/cart/items');
  });

  it('remove() deletes item via HTTP', () => {
    service.remove('i1');
    const req = http.expectOne('/cart/items/i1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: 'c1', items: [], couponCode: null, shippingOptionId: null });
    expect(service.items()).toEqual([]);
  });

  it('updateQty() patches item', () => {
    service.updateQty('i1', 3);
    const req = http.expectOne('/cart/items/i1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity: 3 });
    req.flush({ id: 'c1', items: [], couponCode: null, shippingOptionId: null });
  });

  it('selectShipping() updates shippingOptionId locally and patches', () => {
    service.selectShipping('express');
    expect(service.shippingOptionId()).toBe('express');
    const req = http.expectOne('/cart/shipping');
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 'c1', items: [], couponCode: null, shippingOptionId: 'express' });
  });

  it('applyCoupon() posts coupon and sets discount', () => {
    service.applyCoupon('CAFE10');
    const req = http.expectOne('/cart/coupon');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'c1', items: [], couponCode: 'CAFE10', shippingOptionId: null });
    expect(service.couponDiscount()).toBe(0.1);
  });

  it('removeCoupon() deletes coupon and resets discount', () => {
    service.removeCoupon();
    const req = http.expectOne('/cart/coupon');
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: 'c1', items: [], couponCode: null, shippingOptionId: null });
    expect(service.couponDiscount()).toBe(0);
  });

  it('clear() deletes cart and empties items', () => {
    service.clear();
    const req = http.expectOne('/cart');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(service.items()).toEqual([]);
    expect(service.couponCode()).toBeNull();
  });

  it('subtotal computed from items price × qty', () => {
    service['_items'].set([
      { id: 'i1', productId: 'p1', name: 'A', producer: '', price: 5000, qty: 2, emoji: '☕', organic: false, fairTrade: false, maxStock: 10 },
    ]);
    expect(service.subtotal()).toBe(10000);
  });

  it('total = subtotal + shipping - discount', () => {
    service['_items'].set([
      { id: 'i1', productId: 'p1', name: 'A', producer: '', price: 10000, qty: 1, emoji: '☕', organic: false, fairTrade: false, maxStock: 10 },
    ]);
    service['_couponDiscount'].set(0.1);
    service['_shippingOptionId'].set('standard');
    const expectedDiscount = Math.round(10000 * 0.1);
    expect(service.discount()).toBe(expectedDiscount);
    expect(service.total()).toBe(10000 + service.shipping() - expectedDiscount);
  });
});
