import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { OrderService } from './order.service';
import { AddressService } from './address.service';
import { IAddress } from '../models/checkout.model';

const mockBackendOrder = {
  id: 'o1', code: 'ORD-001', status: 'pending_verification',
  subtotal: 20000, shippingAmount: 5000, discountAmount: 0, totalAmount: 25000,
  shippingAddressSnapshot: 'Calle 1 #2-3', shippingOptionId: 'standard',
  buyerId: 'b1', createdAt: '2024-01-01T00:00:00Z',
  items: [{
    id: 'oi1', productId: 'p1', productNameSnapshot: 'Café',
    productEmojiSnapshot: '☕', quantity: 2, unitPriceSnapshot: 10000, subtotal: 20000,
  }],
};

describe('OrderService', () => {
  let service: OrderService;
  let http: HttpTestingController;
  let addrSpy: jasmine.SpyObj<AddressService>;

  beforeEach(() => {
    const defaultAddr: IAddress = { id: 'addr1', label: 'Casa', line1: 'Calle 1', city: 'Bogotá', department: 'Cundinamarca', isDefault: true };
    addrSpy = { defaultAddress: jasmine.createSpy().and.returnValue(defaultAddr) } as unknown as jasmine.SpyObj<AddressService>;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AddressService, useValue: addrSpy },
      ],
    });

    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OrderService);
    http.expectOne('/orders').flush([mockBackendOrder]);
  });

  afterEach(() => http.verify());

  it('loads orders on init', () => {
    expect(service.orders().length).toBe(1);
    expect(service.orders()[0].id).toBe('o1');
  });

  it('list() returns orders array', () => {
    expect(service.list().length).toBe(1);
  });

  it('getById() returns the order', () => {
    const order = service.getById('o1');
    expect(order).toBeDefined();
    expect(order?.number).toBe('ORD-001');
  });

  it('getById() returns undefined for unknown id', () => {
    expect(service.getById('unknown')).toBeUndefined();
  });

  it('markReviewSubmitted() sets reviewSubmitted flag', () => {
    service.markReviewSubmitted('o1');
    expect(service.getById('o1')?.['reviewSubmitted']).toBeTrue();
  });

  it('place() posts to /orders and adds to list', () => {
    const payload = {
      items: [{ productId: 'p1', name: 'Café', qty: 1, unitPrice: 10000, emoji: '☕' }],
      total: 10000, address: 'Calle 1', addressId: 'addr1',
    };
    let result: unknown;
    service.place(payload).subscribe(o => result = o);
    const req = http.expectOne('/orders');
    expect(req.request.method).toBe('POST');
    req.flush({ ...mockBackendOrder, id: 'o2', code: 'ORD-002' });
    expect(service.orders().length).toBe(2);
  });

  it('maps order status steps correctly', () => {
    const order = service.getById('o1');
    expect(order?.steps.length).toBeGreaterThan(0);
    expect(order?.steps[0].active).toBeTrue();
  });

  it('load() fetches /orders again', () => {
    service.load();
    const req = http.expectOne('/orders');
    req.flush([]);
    expect(service.orders().length).toBe(0);
  });
});
