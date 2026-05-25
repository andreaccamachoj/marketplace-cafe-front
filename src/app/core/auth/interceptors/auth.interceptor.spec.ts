import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenStorageService } from '../services/token-storage.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpCtrl: HttpTestingController;
  let storageSpy: jasmine.SpyObj<TokenStorageService>;

  function setup(token: string | null) {
    storageSpy = jasmine.createSpyObj('TokenStorageService', ['getToken']);
    storageSpy.getToken.and.returnValue(token);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStorageService, useValue: storageSpy },
      ],
    });
    http     = TestBed.inject(HttpClient);
    httpCtrl = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpCtrl.verify());

  it('adds Authorization header when token exists', () => {
    setup('my-token');
    http.get('/api/test').subscribe();
    const req = httpCtrl.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush({});
  });

  it('does NOT add Authorization header when no token', () => {
    setup(null);
    http.get('/api/test').subscribe();
    const req = httpCtrl.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('passes through the request unchanged when no token', () => {
    setup(null);
    http.get('/api/test', { params: { q: '1' } }).subscribe();
    const req = httpCtrl.expectOne(r => r.url === '/api/test');
    expect(req.request.params.get('q')).toBe('1');
    req.flush({});
  });

  it('does not modify the original request url', () => {
    setup('tok');
    http.get('/api/resource').subscribe();
    const req = httpCtrl.expectOne('/api/resource');
    expect(req.request.url).toBe('/api/resource');
    req.flush({});
  });
});
