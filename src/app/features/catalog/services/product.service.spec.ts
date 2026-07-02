import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { ProductService } from './product.service';

const mockBackend = (overrides = {}) => ({
  id: '1', name: 'Café Huila', producerName: 'Finca El Paraíso',
  categoryName: 'Café especial', description: 'Excelente', price: 25000,
  originalPrice: 30000, discountPercent: 17, unit: '250g', region: 'Huila',
  emoji: '☕', soldCount: 50, rating: 4.5, reviewCount: 10, stock: 100,
  images: [{ imageUrl: 'img1.jpg', displayOrder: 0 }],
  presentations: [{ presentation: 'Grano' }],
  flavorNotes: [{ name: 'Chocolate', icon: '🍫', intensity: 80 }],
  cupping: { score: 88, aroma: 8.5, flavor: 8.8, body: 8.0, finish: 8.3 },
  certificationCodes: ['ORGANIC'],
  ...overrides,
});

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  function setup(platformId = 'browser') {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platformId },
        ProductService,
      ],
    });
    service = TestBed.inject(ProductService);
    http    = TestBed.inject(HttpTestingController);
  }

  afterEach(() => http.verify());

  describe('browser platform', () => {
    beforeEach(() => setup('browser'));

    it('loads products on construction', () => {
      const req = http.expectOne(r => r.url.includes('/catalog/products'));
      req.flush([mockBackend()]);
      expect(service.count()).toBe(1);
    });

    it('list() returns all products after load', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([mockBackend()]);
      expect(service.list().length).toBe(1);
    });

    it('list() filters by category', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', categoryName: 'Café especial' }),
        mockBackend({ id: '2', categoryName: 'Espresso' }),
      ]);
      const result = service.list({ category: 'café especial' });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('list() filters by query (name)', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', name: 'Café Huila' }),
        mockBackend({ id: '2', name: 'Espresso Nariño' }),
      ]);
      const result = service.list({ query: 'huila' });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('list() filters by query (producer)', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', producerName: 'Finca El Paraíso' }),
        mockBackend({ id: '2', producerName: 'Otro productor' }),
      ]);
      const result = service.list({ query: 'paraíso' });
      expect(result.length).toBe(1);
    });

    it('list() filters by certification', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', certificationCodes: ['ORGANIC'] }),
        mockBackend({ id: '2', certificationCodes: ['FAIRTRADE'] }),
      ]);
      const result = service.list({ certs: ['ORGANIC'] as any });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('list() filters by presentation', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', presentations: [{ presentation: 'Grano' }] }),
        mockBackend({ id: '2', presentations: [{ presentation: 'Molido' }] }),
      ]);
      const result = service.list({ presentation: 'grano' });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('list() sorts by price-asc', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', price: 30000 }),
        mockBackend({ id: '2', price: 20000 }),
      ]);
      const result = service.list({ sort: 'price-asc' });
      expect(result[0].price).toBe(20000);
    });

    it('list() sorts by price-desc', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', price: 20000 }),
        mockBackend({ id: '2', price: 30000 }),
      ]);
      const result = service.list({ sort: 'price-desc' });
      expect(result[0].price).toBe(30000);
    });

    it('list() sorts by rating', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', rating: 3.0 }),
        mockBackend({ id: '2', rating: 4.8 }),
      ]);
      const result = service.list({ sort: 'rating' });
      expect(result[0].rating).toBe(4.8);
    });

    it('getById() returns cached product via of()', (done) => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([mockBackend({ id: '42' })]);
      service.getById('42').subscribe(p => {
        expect(p?.id).toBe('42');
        done();
      });
      http.expectNone(r => r.url.includes('/catalog/products/42'));
    });

    it('getById() fetches from HTTP when not cached', (done) => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([]);
      service.getById('99').subscribe(p => {
        expect(p?.id).toBe('99');
        done();
      });
      http.expectOne('/catalog/products/99').flush(mockBackend({ id: '99' }));
    });

    it('getByIdSync() returns cached product', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([mockBackend({ id: '5' })]);
      expect(service.getByIdSync('5')?.id).toBe('5');
    });

    it('getByIdSync() returns undefined for missing id', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([]);
      expect(service.getByIdSync('missing')).toBeUndefined();
    });

    it('search() delegates to list() with query', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', name: 'Café especial' }),
        mockBackend({ id: '2', name: 'Espresso fuerte' }),
      ]);
      const result = service.search('especial');
      expect(result.length).toBe(1);
    });

    it('mapBackendProduct preserves cupping attributes', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([mockBackend()]);
      const p = service.list()[0];
      expect(p.cuppingAttributes?.length).toBe(4);
      expect(p.cuppingScore).toBe(88);
    });

    it('mapBackendProduct handles null cupping', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([mockBackend({ cupping: null })]);
      const p = service.list()[0];
      expect(p.cuppingAttributes).toBeUndefined();
    });

    it('mapBackendProduct sorts images by displayOrder', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ images: [{ imageUrl: 'b.jpg', displayOrder: 1 }, { imageUrl: 'a.jpg', displayOrder: 0 }] }),
      ]);
      expect(service.list()[0].images[0]).toBe('a.jpg');
    });

    it('list() sorts by newest (reverses array)', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1' }),
        mockBackend({ id: '2' }),
      ]);
      const result = service.list({ sort: 'newest' });
      expect(result[0].id).toBe('2');
    });

    it('list() returns original order for relevance sort', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', name: 'A' }),
        mockBackend({ id: '2', name: 'B' }),
      ]);
      const result = service.list({ sort: 'relevance' });
      expect(result[0].id).toBe('1');
    });

    it('list() with no filter returns all products', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1' }),
        mockBackend({ id: '2' }),
      ]);
      expect(service.list({}).length).toBe(2);
    });

    it('mapBackendProduct handles null producerName and categoryName', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ producerName: null, categoryName: null }),
      ]);
      const p = service.list()[0];
      expect(p.producerName).toBe('');
      expect(p.category).toBe('');
    });

    it('list() filters by query (description)', () => {
      http.expectOne(r => r.url.includes('/catalog/products')).flush([
        mockBackend({ id: '1', description: 'Tostado especial' }),
        mockBackend({ id: '2', description: 'Normal' }),
      ]);
      const result = service.list({ query: 'tostado' });
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

  });

  describe('server platform', () => {
    beforeEach(() => setup('server'));

    it('does not make HTTP call on server', () => {
      http.expectNone(r => r.url.includes('/catalog/products'));
      expect(service.count()).toBe(0);
    });

    it('list() returns empty on server', () => {
      expect(service.list().length).toBe(0);
    });
  });
});
