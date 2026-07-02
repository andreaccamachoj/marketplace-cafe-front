import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ReviewService } from './review.service';
import { IOrder } from '../models/order.model';

const mockBackendReview = {
  id: 'r1', productId: 'p1', buyerId: 'b1', orderId: 'o1',
  rating: 5, title: 'Excelente', body: 'Muy buen café',
  status: 'published', isVerifiedPurchase: true, helpfulCount: 3,
  createdAt: '2024-01-01T00:00:00Z',
};

const mockOrder: IOrder = {
  id: 'o1', number: 'ORD-001', date: '01 ene 2024', status: 'completed',
  subtotal: 10000, shippingAmount: 0, discountAmount: 0, total: 10000,
  address: 'Calle 1', shippingOptionId: null, buyerId: 'b1',
  items: [{ productId: 'p1', name: 'Café', productName: 'Café', qty: 1, unitPrice: 10000, subtotal: 10000, emoji: '☕' }],
  steps: [],
};

describe('ReviewService', () => {
  let service: ReviewService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ReviewService);
    http.expectOne('/reviews').flush([mockBackendReview]);
  });

  afterEach(() => http.verify());

  it('loads reviews on init', () => {
    expect(service.all().length).toBe(1);
    expect(service.count()).toBe(1);
  });

  it('byBuyer() filters by buyerId', () => {
    expect(service.byBuyer('b1').length).toBe(1);
    expect(service.byBuyer('other').length).toBe(0);
  });

  it('canReview() returns true when purchased and not yet reviewed', () => {
    const otherReview = { ...service.all()[0], productId: 'p99' };
    service['_reviews'].set([otherReview]);
    expect(service.canReview('b1', 'p1', [mockOrder])).toBeTrue();
  });

  it('canReview() returns false if already reviewed', () => {
    expect(service.canReview('b1', 'p1', [mockOrder])).toBeFalse();
  });

  it('canReview() returns false if order not delivered/completed', () => {
    const pendingOrder: IOrder = { ...mockOrder, status: 'confirmed' };
    service['_reviews'].set([]);
    expect(service.canReview('b1', 'p1', [pendingOrder])).toBeFalse();
  });

  it('add() posts review and appends to list', () => {
    service['_reviews'].set([]);
    const payload = { productId: 'p2', orderId: 'o1', rating: 4, title: 'Bueno', body: 'Recomendado' };
    let result: unknown;
    service.add(payload, { id: 'b1', name: 'Juan', initials: 'J' }, 'Café', 'img.jpg').subscribe(r => result = r);
    const req = http.expectOne('/reviews');
    expect(req.request.method).toBe('POST');
    req.flush({ ...mockBackendReview, id: 'r2', productId: 'p2' });
    expect(service.count()).toBe(1);
  });

  it('update() modifies existing review', () => {
    service.update('r1', { rating: 3, title: 'Ok', body: 'Regular' });
    expect(service.all()[0].rating).toBe(3);
    expect(service.all()[0].title).toBe('Ok');
  });

  it('remove() removes review by id and buyerId', () => {
    service.remove('r1', 'b1');
    expect(service.count()).toBe(0);
  });

  it('remove() does not remove if buyerId mismatch', () => {
    service.remove('r1', 'other');
    expect(service.count()).toBe(1);
  });

  it('getByProductId() filters by productId', () => {
    expect(service.getByProductId('p1').length).toBe(1);
    expect(service.getByProductId('p99').length).toBe(0);
  });
});
