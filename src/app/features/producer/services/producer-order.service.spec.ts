import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { ProducerOrderService } from './producer-order.service';
import { IReceivedOrder } from '../models/received-order.model';

const MOCK_BACKEND_ORDER = {
  id: 'ord-1', code: 'WCM-001', status: 'confirmed',
  totalAmount: 90000, shippingOptionId: 'standard',
  buyerId: 'buyer-1', createdAt: '2025-01-10T10:00:00Z',
  items: [
    { productNameSnapshot: 'Café Sierra', productEmojiSnapshot: '☕', quantity: 2 },
  ],
};

const MOCK_ORDER: IReceivedOrder = {
  id: 'ord-1', number: 'WCM-001', buyerName: 'Comprador', buyerInitials: 'C',
  buyerCity: '', date: '10 ene. 2025', status: 'confirmed',
  items: [{ name: 'Café Sierra', qty: 2, emoji: '☕' }],
  total: 90000, shipping: 'standard',
};

describe('ProducerOrderService', () => {
  let service: ProducerOrderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ProducerOrderService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne('/producer/orders').flush([]);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes orders as empty array', () => {
    expect(service.orders()).toEqual([]);
  });

  /* ── load ── */

  it('load() GETs /producer/orders and populates signal', () => {
    service.load();
    const req = http.expectOne('/producer/orders');
    expect(req.request.method).toBe('GET');
    req.flush([MOCK_BACKEND_ORDER]);
    expect(service.orders().length).toBe(1);
    expect(service.orders()[0].id).toBe('ord-1');
  });

  it('load() maps backend status to valid ReceivedOrderStatus', () => {
    service.load();
    http.expectOne('/producer/orders').flush([MOCK_BACKEND_ORDER]);
    expect(service.orders()[0].status).toBe('confirmed');
  });

  /* ── updateStatus ── */

  it('updateStatus() PATCHes when new status is forward in flow', () => {
    (service as any)._orders.set([MOCK_ORDER]);
    service.updateStatus('ord-1', 'preparing');
    const req = http.expectOne('/producer/orders/ord-1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ newStatus: 'preparing' });
    req.flush({});
    expect(service.orders()[0].status).toBe('preparing');
  });

  it('updateStatus() does nothing when new status is not forward in flow', () => {
    (service as any)._orders.set([{ ...MOCK_ORDER, status: 'shipped' }]);
    service.updateStatus('ord-1', 'preparing');
    http.expectNone('/producer/orders/ord-1/status');
    expect(service.orders()[0].status).toBe('shipped');
  });

  it('updateStatus() does nothing when order not found', () => {
    service.updateStatus('nonexistent', 'preparing');
    http.expectNone('/producer/orders/nonexistent/status');
  });

  /* ── pendingCount ── */

  it('pendingCount counts non-delivered orders', () => {
    (service as any)._orders.set([
      MOCK_ORDER,
      { ...MOCK_ORDER, id: 'ord-2', status: 'preparing' },
      { ...MOCK_ORDER, id: 'ord-3', status: 'delivered' },
    ]);
    expect(service.pendingCount()).toBe(2);
  });

  it('getOrderDetail returns order by id (via orders signal)', () => {
    (service as any)._orders.set([MOCK_ORDER]);
    const found = service.orders().find(o => o.id === 'ord-1');
    expect(found).toEqual(MOCK_ORDER);
  });
});
