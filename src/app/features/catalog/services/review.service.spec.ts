import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ReviewService } from './review.service';

const mockBackendReview = (overrides = {}) => ({
  id: 'r1', productId: 'p1', buyerId: 'b1',
  buyerName: 'Ana García', buyerInitials: 'AG',
  rating: 5, title: 'Excelente', body: 'Muy buen café',
  isVerifiedPurchase: true, helpfulCount: 3,
  createdAt: '2025-01-15T10:00:00Z',
  ...overrides,
});

describe('ReviewService', () => {
  let service: ReviewService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ReviewService],
    });
    service = TestBed.inject(ReviewService);
    http    = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listByProductId() fetches reviews for a product', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews.length).toBe(2);
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([
      mockBackendReview({ id: 'r1' }),
      mockBackendReview({ id: 'r2' }),
    ]);
  });

  it('listByProductId() maps buyerName and initials', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].userName).toBe('Ana García');
      expect(reviews[0].userInitials).toBe('AG');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([mockBackendReview()]);
  });

  it('listByProductId() falls back to computed initials when buyerInitials missing', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].userInitials).toBe('JD');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([
      mockBackendReview({ buyerName: 'Juan Doe', buyerInitials: undefined }),
    ]);
  });

  it('listByProductId() maps date from createdAt', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].date).toBe('2025-01-15');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([mockBackendReview()]);
  });

  it('listByProductId() falls back to title when body is null', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].comment).toBe('Buen café');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([
      mockBackendReview({ body: null, title: 'Buen café' }),
    ]);
  });

  it('listByProductId() maps producerReply when present', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].producerReply).toBe('Gracias!');
      expect(reviews[0].producerReplyDate).toBe('2025-02-01');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([
      mockBackendReview({ producerReply: 'Gracias!', producerReplyDate: '2025-02-01T00:00:00Z' }),
    ]);
  });

  it('create() posts to /reviews and maps response', (done) => {
    const newReview = {
      productId: 'p1', buyerId: 'b1', userName: 'Ana', userInitials: 'A',
      rating: 4, comment: 'Muy bueno', isVerifiedPurchase: false,
    };
    service.create(newReview).subscribe(r => {
      expect(r.rating).toBe(4);
      expect(r.comment).toBe('Muy bueno');
      done();
    });
    http.expectOne('/reviews').flush(mockBackendReview({ rating: 4, body: 'Muy bueno' }));
  });

  it('create() sends correct request body', () => {
    const newReview = {
      productId: 'p1', buyerId: 'b1', userName: 'Ana', userInitials: 'A',
      rating: 3, comment: 'Regular', isVerifiedPurchase: false,
    };
    service.create(newReview).subscribe();
    const req = http.expectOne('/reviews');
    expect(req.request.body).toEqual({ productId: 'p1', rating: 3, body: 'Regular' });
    req.flush(mockBackendReview({ rating: 3, body: 'Regular' }));
  });

  it('markHelpful() is a no-op (no HTTP call)', () => {
    service.markHelpful('r1');
    http.expectNone('/reviews/r1/helpful');
  });

  it('listByProductId() maps isVerifiedPurchase', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].isVerifiedPurchase).toBeTrue();
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([mockBackendReview({ isVerifiedPurchase: true })]);
  });

  it('listByProductId() falls back to "Comprador" when buyerName is null', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].userName).toBe('Comprador');
      expect(reviews[0].userInitials).toBe('C');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([
      mockBackendReview({ buyerName: undefined, buyerInitials: undefined }),
    ]);
  });

  it('listByProductId() falls back to empty string when body and title are null', (done) => {
    service.listByProductId('p1').subscribe(reviews => {
      expect(reviews[0].comment).toBe('');
      done();
    });
    http.expectOne('/catalog/products/p1/reviews').flush([
      mockBackendReview({ body: null, title: null }),
    ]);
  });
});
