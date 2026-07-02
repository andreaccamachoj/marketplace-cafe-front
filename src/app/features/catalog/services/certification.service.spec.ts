import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { CertificationService } from './certification.service';

const mockCerts = [
  { id: 1, code: 'ORGANIC',    name: 'Orgánico'   },
  { id: 2, code: 'FAIRTRADE',  name: 'Comercio Justo' },
  { id: 3, code: 'RAINFOREST', name: 'Rainforest Alliance' },
];

describe('CertificationService', () => {
  let service: CertificationService;
  let http: HttpTestingController;

  function setup(platformId = 'browser') {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platformId },
        CertificationService,
      ],
    });
    service = TestBed.inject(CertificationService);
    http    = TestBed.inject(HttpTestingController);
  }

  afterEach(() => http.verify());

  describe('browser platform', () => {
    beforeEach(() => setup('browser'));

    it('fetches certifications on construction', () => {
      http.expectOne('/catalog/certifications').flush(mockCerts);
      expect(service.certifications().length).toBe(3);
    });

    it('certifications signal reflects fetched data', () => {
      http.expectOne('/catalog/certifications').flush([mockCerts[0]]);
      expect(service.certifications()[0].code).toBe('ORGANIC');
    });

    it('certifications is readonly signal', () => {
      http.expectOne('/catalog/certifications').flush(mockCerts);
      expect(service.certifications).toBeDefined();
    });
  });

  describe('server platform', () => {
    beforeEach(() => setup('server'));

    it('does not make HTTP call on server', () => {
      http.expectNone('/catalog/certifications');
    });

    it('certifications() is empty on server', () => {
      expect(service.certifications().length).toBe(0);
    });
  });
});
