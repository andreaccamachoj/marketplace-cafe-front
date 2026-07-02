import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { FavoritesService } from './favorites.service';
import { ProductService } from '@features/catalog/services/product.service';
import { IProduct } from '@features/catalog/models/product.model';

const mockProduct: IProduct = {
  id: 'p1', name: 'Café Especial', region: 'Huila', price: 25000,
  images: ['img.jpg'], rating: 4.5, category: 'Arábica',
  description: '', certifications: [], stock: 10,
  producerName: 'Finca El Sol', reviewCount: 0,
};

describe('FavoritesService', () => {
  let service: FavoritesService;
  let http: HttpTestingController;
  let productSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    productSpy = jasmine.createSpyObj<ProductService>('ProductService', ['getByIdSync']);
    productSpy.getByIdSync.and.returnValue(mockProduct);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ProductService, useValue: productSpy },
      ],
    });

    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FavoritesService);
    http.expectOne('/favorites').flush([]);
  });

  afterEach(() => http.verify());

  it('starts with empty favorites', () => {
    expect(service.all()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('isFavorite() returns false initially', () => {
    expect(service.isFavorite('p1')).toBeFalse();
  });

  it('add() posts and adds to favorites list', () => {
    service.add(mockProduct);
    const req = http.expectOne('/favorites/p1');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'f1', productId: 'p1', addedAt: new Date().toISOString() });
    expect(service.count()).toBe(1);
    expect(service.isFavorite('p1')).toBeTrue();
  });

  it('add() is no-op if already a favorite', () => {
    service['_favorites'].set([{
      id: 'f1', productId: 'p1', productName: 'Café', productOrigin: 'Huila',
      productPrice: 25000, productImageUrl: 'img.jpg', productRating: 4.5,
      productCategory: 'Arábica', addedAt: '',
    }]);
    service.add(mockProduct);
    http.expectNone('/favorites/p1');
  });

  it('remove() deletes and removes from list', () => {
    service['_favorites'].set([{
      id: 'f1', productId: 'p1', productName: 'Café', productOrigin: 'Huila',
      productPrice: 25000, productImageUrl: 'img.jpg', productRating: 4.5,
      productCategory: 'Arábica', addedAt: '',
    }]);
    service.remove('p1');
    const req = http.expectOne('/favorites/p1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(service.count()).toBe(0);
  });

  it('toggle() adds if not favorite', () => {
    service.toggle(mockProduct);
    const req = http.expectOne('/favorites/p1');
    req.flush({ id: 'f1', productId: 'p1', addedAt: '' });
    expect(service.isFavorite('p1')).toBeTrue();
  });

  it('toggle() removes if already favorite', () => {
    service['_favorites'].set([{
      id: 'f1', productId: 'p1', productName: 'Café', productOrigin: 'Huila',
      productPrice: 25000, productImageUrl: 'img.jpg', productRating: 4.5,
      productCategory: 'Arábica', addedAt: '',
    }]);
    service.toggle(mockProduct);
    const req = http.expectOne('/favorites/p1');
    req.flush(null);
    expect(service.isFavorite('p1')).toBeFalse();
  });

  it('load() fetches /favorites', () => {
    service.load();
    const req = http.expectOne('/favorites');
    req.flush([{ id: 'f2', productId: 'p2', addedAt: '' }]);
    expect(service.count()).toBe(1);
  });
});
