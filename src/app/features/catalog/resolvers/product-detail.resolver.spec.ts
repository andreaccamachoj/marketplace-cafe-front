import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { productDetailResolver } from './product-detail.resolver';
import { ProductService } from '../services/product.service';

const mockProduct = { id: '42', name: 'Café Huila', price: 25000 } as any;

function makeRoute(id: string | null): ActivatedRouteSnapshot {
  return { paramMap: convertToParamMap(id ? { id } : {}) } as any;
}

describe('productDetailResolver', () => {
  let productService: jasmine.SpyObj<Pick<ProductService, 'getById'>>;
  let router: jasmine.SpyObj<Pick<Router, 'navigate'>>;

  function run(route: ActivatedRouteSnapshot) {
    return TestBed.runInInjectionContext(() =>
      productDetailResolver(route, {} as any)
    );
  }

  beforeEach(() => {
    productService = { getById: jasmine.createSpy('getById') };
    router         = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: Router,         useValue: router         },
      ],
    });
  });

  it('returns product when id is valid and product is found', (done) => {
    productService.getById.and.returnValue(of(mockProduct));
    const result = run(makeRoute('42')) as any;
    result.subscribe((p: any) => {
      expect(p).toEqual(mockProduct);
      done();
    });
  });

  it('navigates to / and returns null when product is not found', (done) => {
    productService.getById.and.returnValue(of(undefined));
    const result = run(makeRoute('99')) as any;
    result.subscribe((p: any) => {
      expect(p).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('navigates to / and returns null when id is missing', () => {
    const result = run(makeRoute(null));
    expect(result).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('navigates to / and returns null on HTTP error', (done) => {
    productService.getById.and.returnValue(throwError(() => new Error('Network error')));
    const result = run(makeRoute('42')) as any;
    result.subscribe((p: any) => {
      expect(p).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('calls productService.getById with the route id', (done) => {
    productService.getById.and.returnValue(of(mockProduct));
    const result = run(makeRoute('42')) as any;
    result.subscribe(() => {
      expect(productService.getById).toHaveBeenCalledWith('42');
      done();
    });
  });
});
