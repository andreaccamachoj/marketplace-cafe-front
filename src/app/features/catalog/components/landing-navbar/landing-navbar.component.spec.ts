import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal, computed } from '@angular/core';
import { LandingNavbarComponent } from '@shared/layout/landing-navbar/landing-navbar.component';
import { AuthService } from '@core/auth/services/auth.service';
import { CartService } from '@features/buyer/services/cart.service';

function makeAuthMock() {
  const currentUser = signal<any>(null);
  return {
    currentUser,
    isAuthenticated: computed(() => currentUser() !== null),
    currentRole: computed(() => currentUser()?.roles?.[0] ?? null),
    isBuyer: () => false,
    logout: jasmine.createSpy('logout'),
  };
}

describe('LandingNavbarComponent', () => {
  let fixture: ComponentFixture<LandingNavbarComponent>;
  let component: LandingNavbarComponent;
  let el: HTMLElement;
  let mockCartSvc: any;
  let mockAuthSvc: ReturnType<typeof makeAuthMock>;

  beforeEach(async () => {
    mockAuthSvc = makeAuthMock();
    mockCartSvc = { count: signal(0), items: signal([]) };

    await TestBed.configureTestingModule({
      imports: [LandingNavbarComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthSvc },
        { provide: CartService, useValue: mockCartSvc },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LandingNavbarComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the navbar', () => {
    expect(el.querySelector('header, nav, [role="banner"]') ?? el.firstElementChild).toBeTruthy();
  });

  it('onSearch emits searchChange', () => {
    const spy = jasmine.createSpy('searchChange');
    component.searchChange.subscribe(spy);
    const fakeEvent = { target: { value: 'huila' } } as unknown as Event;
    component['onSearch'](fakeEvent);
    expect(spy).toHaveBeenCalledWith('huila');
  });

  it('clearSearch resets searchValue and emits empty string', () => {
    const spy = jasmine.createSpy('searchChange');
    component.searchChange.subscribe(spy);
    component['searchValue'].set('huila');
    component['clearSearch']();
    expect(component['searchValue']()).toBe('');
    expect(spy).toHaveBeenCalledWith('');
  });

  it('onSelectSuggestion emits suggestionSelected and clears search', () => {
    const spy = jasmine.createSpy('suggestionSelected');
    component.suggestionSelected.subscribe(spy);
    component['onSelectSuggestion']('product-42');
    expect(spy).toHaveBeenCalledWith('product-42');
    expect(component['searchValue']()).toBe('');
  });

  it('onDropdownMousedown prevents default', () => {
    const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
    component['onDropdownMousedown'](event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('toggleMobileMenu toggles state', () => {
    expect(component['mobileMenuOpen']()).toBeFalse();
    component['toggleMobileMenu']();
    expect(component['mobileMenuOpen']()).toBeTrue();
    component['toggleMobileMenu']();
    expect(component['mobileMenuOpen']()).toBeFalse();
  });

  it('closeMobileMenu sets mobileMenuOpen to false', () => {
    component['mobileMenuOpen'].set(true);
    component['closeMobileMenu']();
    expect(component['mobileMenuOpen']()).toBeFalse();
  });

  it('logout calls auth.logout', () => {
    component['logout']();
    expect(mockAuthSvc.logout).toHaveBeenCalled();
  });

  it('onSearchEnter does not navigate when searchValue is empty', () => {
    const spy = spyOn(component['router'], 'navigate');
    component['searchValue'].set('');
    component['onSearchEnter']();
    expect(spy).not.toHaveBeenCalled();
  });

  it('onSearchEnter navigates to home with q param when searchValue is non-empty', () => {
    const spy = spyOn(component['router'], 'navigate');
    component['searchValue'].set('huila');
    component['onSearchEnter']();
    expect(spy).toHaveBeenCalledWith(['/'], { queryParams: { q: 'huila' } });
  });

  it('goToCart navigates to buyer panel', () => {
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    component['goToCart']();
    expect(spy).toHaveBeenCalledWith(['/panel/comprador']);
  });

  it('dropdownVisible is false when searchFocused is false', () => {
    component['searchFocused'].set(false);
    expect(component['dropdownVisible']()).toBeFalse();
  });

  it('dropdownVisible is false when searchValue has fewer than 3 chars', () => {
    component['searchFocused'].set(true);
    component['searchValue'].set('ab');
    fixture.componentRef.setInput('searchSuggestions', [{ id: '1', name: 'X', producer: 'Y', emoji: '☕', price: 1 }]);
    expect(component['dropdownVisible']()).toBeFalse();
  });

  it('userInitial is ? when user is not logged in', () => {
    expect(component['userInitial']()).toBe('?');
  });

  it('firstName returns first word of fullName when user is logged in', () => {
    mockAuthSvc.currentUser.set({ fullName: 'Ana García', roles: ['BUYER'] });
    fixture.detectChanges();
    expect(component['firstName']()).toBe('Ana');
  });

  it('goToDashboard navigates to buyer panel when role is BUYER', () => {
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    mockAuthSvc.currentUser.set({ fullName: 'Ana', roles: ['buyer'] });
    fixture.detectChanges();
    component['goToDashboard']();
    expect(spy).toHaveBeenCalledWith(['/panel/comprador']);
  });

  it('goToDashboard navigates to producer panel when role is PRODUCER', () => {
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    mockAuthSvc.currentUser.set({ fullName: 'Carlos', roles: ['producer'] });
    fixture.detectChanges();
    component['goToDashboard']();
    expect(spy).toHaveBeenCalledWith(['/panel/productor']);
  });

  it('goToDashboard navigates to admin panel when role is ADMIN', () => {
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    mockAuthSvc.currentUser.set({ fullName: 'Admin', roles: ['admin'] });
    fixture.detectChanges();
    component['goToDashboard']();
    expect(spy).toHaveBeenCalledWith(['/panel/admin']);
  });

  it('goToDashboard does not navigate when role is null', () => {
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    component['goToDashboard']();
    expect(spy).not.toHaveBeenCalled();
  });
});
