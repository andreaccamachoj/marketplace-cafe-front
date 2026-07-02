import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { ProducerReviewService } from './producer-review.service';
import { IProducerReview } from '../models/producer-review.model';

const MOCK_BACKEND_REVIEW = {
  id: 'rev-1', productId: 'p-1', productName: 'Café Sierra', productEmoji: '☕',
  buyerName: 'Ana García', buyerInitials: 'AG',
  rating: 4, body: 'Excelente café colombiano.', comment: '',
  createdAt: '2025-01-10T10:00:00Z', isVerifiedPurchase: true, helpfulCount: 3,
  producerReply: null, producerReplyDate: null,
};

const MOCK_REVIEW: IProducerReview = {
  id: 'rev-1', productId: 'p-1', productName: 'Café Sierra', productEmoji: '☕',
  buyerName: 'Ana García', buyerInitials: 'AG',
  rating: 4, comment: 'Excelente café colombiano.', date: '2025-01-10',
  isVerifiedPurchase: true, helpfulCount: 3,
};

describe('ProducerReviewService', () => {
  let service: ProducerReviewService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    service = TestBed.inject(ProducerReviewService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('initializes reviews as empty array', () => {
    expect(service.reviews()).toEqual([]);
  });

  /* ── load ── */

  it('load() GETs /producer/reviews and populates signal', () => {
    service.load();
    const req = http.expectOne('/producer/reviews');
    expect(req.request.method).toBe('GET');
    req.flush([MOCK_BACKEND_REVIEW]);
    expect(service.reviews().length).toBe(1);
    expect(service.reviews()[0].id).toBe('rev-1');
  });

  it('load() maps buyerName to initials when buyerInitials is absent', () => {
    service.load();
    const noInitials = { ...MOCK_BACKEND_REVIEW, buyerInitials: null };
    http.expectOne('/producer/reviews').flush([noInitials]);
    expect(service.reviews()[0].buyerInitials).toBe('AG');
  });

  /* ── reply ── */

  it('reply() POSTs to /reviews/:id/reply and updates signal', () => {
    (service as any)._reviews.set([MOCK_REVIEW]);
    service.reply('rev-1', 'Gracias por tu reseña!');
    const req = http.expectOne('/reviews/rev-1/reply');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ body: 'Gracias por tu reseña!' });
    req.flush({});
    expect(service.reviews()[0].producerReply).toBe('Gracias por tu reseña!');
    expect(service.reviews()[0].producerReplyDate).toBeDefined();
  });

  it('reply() trims whitespace from text', () => {
    (service as any)._reviews.set([MOCK_REVIEW]);
    service.reply('rev-1', '  Muchas gracias  ');
    const req = http.expectOne('/reviews/rev-1/reply');
    expect(req.request.body).toEqual({ body: 'Muchas gracias' });
    req.flush({});
    expect(service.reviews()[0].producerReply).toBe('Muchas gracias');
  });

  /* ── computed ── */

  it('totalReviews reflects review count', () => {
    (service as any)._reviews.set([MOCK_REVIEW, { ...MOCK_REVIEW, id: 'rev-2' }]);
    expect(service.totalReviews()).toBe(2);
  });

  it('globalAvgRating computes average across all reviews', () => {
    (service as any)._reviews.set([
      { ...MOCK_REVIEW, rating: 4 },
      { ...MOCK_REVIEW, id: 'rev-2', rating: 2 },
    ]);
    expect(service.globalAvgRating()).toBe(3);
  });

  it('globalAvgRating returns 0 when no reviews', () => {
    expect(service.globalAvgRating()).toBe(0);
  });

  it('reviewGroups groups reviews by productId', () => {
    const review2: IProducerReview = { ...MOCK_REVIEW, id: 'rev-2', productId: 'p-2', productName: 'Café Nariño', productEmoji: '🌿' };
    (service as any)._reviews.set([MOCK_REVIEW, review2]);
    const groups = service.reviewGroups();
    expect(groups.length).toBe(2);
  });

  it('reviewGroups computes avgRating per group', () => {
    const review2: IProducerReview = { ...MOCK_REVIEW, id: 'rev-2', rating: 2 };
    (service as any)._reviews.set([MOCK_REVIEW, review2]);
    const group = service.reviewGroups()[0];
    expect(group.avgRating).toBe(3);
    expect(group.totalReviews).toBe(2);
  });
});
