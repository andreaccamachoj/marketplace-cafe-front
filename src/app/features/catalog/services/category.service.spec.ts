import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { CategoryService } from './category.service';

const cat = (id: string, name: string) => ({ id, name, description: 'desc', icon: '☕' });

describe('CategoryService', () => {
  let service: CategoryService;
  let http: HttpTestingController;

  function setup(platformId = 'browser') {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platformId },
        CategoryService,
      ],
    });
    service = TestBed.inject(CategoryService);
    http    = TestBed.inject(HttpTestingController);
  }

  afterEach(() => http.verify());

  describe('browser platform', () => {
    beforeEach(() => setup('browser'));

    it('loads categories on construction', () => {
      http.expectOne('/catalog/categories').flush([cat('1', 'Especial'), cat('2', 'Espresso')]);
      expect(service.count()).toBe(2);
    });

    it('list() returns all categories as observable', (done) => {
      http.expectOne('/catalog/categories').flush([cat('1', 'Especial')]);
      service.list().subscribe(list => {
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Especial');
        done();
      });
    });

    it('getById() returns matching category', (done) => {
      http.expectOne('/catalog/categories').flush([cat('abc', 'Especial')]);
      service.getById('abc').subscribe(c => {
        expect(c?.id).toBe('abc');
        done();
      });
    });

    it('getById() returns undefined for missing id', (done) => {
      http.expectOne('/catalog/categories').flush([cat('1', 'Especial')]);
      service.getById('missing').subscribe(c => {
        expect(c).toBeUndefined();
        done();
      });
    });

    it('categories signal is readable', () => {
      http.expectOne('/catalog/categories').flush([cat('1', 'X')]);
      expect(service.categories().length).toBe(1);
    });
  });

  describe('server platform', () => {
    beforeEach(() => setup('server'));

    it('does not make HTTP call on server', () => {
      http.expectNone('/catalog/categories');
    });

    it('list() returns empty array on server', (done) => {
      service.list().subscribe(list => {
        expect(list.length).toBe(0);
        done();
      });
    });
  });
});
