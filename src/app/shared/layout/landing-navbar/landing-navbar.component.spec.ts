import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal, computed } from '@angular/core';
import { LandingNavbarComponent, INavSearchSuggestion } from './landing-navbar.component';
import { AuthService } from '@core/auth/services/auth.service';
import { CartService } from '@features/buyer/services/cart.service';
import { Role } from '@core/auth/models/role.enum';

function makeAuthService(user: { fullName: string; roles: Role[] } | null) {
  const currentUser = signal(user as any);
  return {
    currentUser,
    isAuthenticated: computed(() => currentUser() !== null),
    currentRole:     computed(() => currentUser()?.roles[0] ?? null),
    isBuyer:         computed(() => currentUser()?.roles[0] === Role.BUYER),
    logout:          jasmine.createSpy('logout'),
  };
}

describe('LandingNavbarComponent', () => {
  let fixture: ComponentFixture<LandingNavbarComponent>;
  let component: LandingNavbarComponent;
  let el: HTMLElement;

  function build(
    user: { fullName: string; roles: Role[] } | null = null,
    cartCount = 0,
  ) {
    const authSvc = makeAuthService(user);
    const cartSvc = { count: computed(() => cartCount) };
    TestBed.overrideProvider(AuthService, { useValue: authSvc });
    TestBed.overrideProvider(CartService, { useValue: cartSvc });
    fixture   = TestBed.createComponent(LandingNavbarComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    return authSvc;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingNavbarComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: makeAuthService(null) },
        { provide: CartService, useValue: { count: computed(() => 0) } },
      ],
    }).compileComponents();
  });

  // ── Render ────────────────────────────────────────────────────────────────

  it('renders the nav element', () => {
    build();
    expect(el.querySelector('nav')).toBeTruthy();
  });

  it('renders logo', () => {
    build();
    expect(el.querySelector('.nav-logo')).toBeTruthy();
  });

  it('renders search input when showSearch=true (default)', () => {
    build();
    fixture.componentRef.setInput('showSearch', true);
    fixture.detectChanges();
    expect(el.querySelector('.nav-search-input')).toBeTruthy();
  });

  it('hides search when showSearch=false', () => {
    build();
    fixture.componentRef.setInput('showSearch', false);
    fixture.detectChanges();
    expect(el.querySelector('.nav-search-input')).toBeNull();
  });

  it('shows nav links when showLinks=true (default)', () => {
    build();
    fixture.componentRef.setInput('showLinks', true);
    fixture.detectChanges();
    expect(el.querySelector('.nav-links')).toBeTruthy();
  });

  it('hides nav links when showLinks=false', () => {
    build();
    fixture.componentRef.setInput('showLinks', false);
    fixture.detectChanges();
    expect(el.querySelector('.nav-links')).toBeNull();
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('shows login link when not authenticated', () => {
    build(null);
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.some(a => a.textContent?.includes('Iniciar sesión'))).toBeTrue();
  });

  it('shows register link when not authenticated', () => {
    build(null);
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.some(a => a.textContent?.includes('Registrarse'))).toBeTrue();
  });

  // ── Authenticated ─────────────────────────────────────────────────────────

  it('hides login link when authenticated', () => {
    build({ fullName: 'Ana García', roles: [Role.BUYER] });
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.some(a => a.getAttribute('routerLink') === '/auth/login')).toBeFalse();
  });

  it('shows user initial in avatar', () => {
    build({ fullName: 'Ana García', roles: [Role.BUYER] });
    expect(el.querySelector('.nav-avatar')!.textContent?.trim()).toBe('A');
  });

  it('shows firstName in username button', () => {
    build({ fullName: 'Carlos Ruiz', roles: [Role.BUYER] });
    expect(el.querySelector('.nav-username')!.textContent?.trim()).toBe('Carlos');
  });

  // ── Cart badge ────────────────────────────────────────────────────────────

  it('shows cart badge when buyer and cartCount > 0', () => {
    build({ fullName: 'Ana', roles: [Role.BUYER] }, 5);
    expect(el.querySelector('.cart-badge')!.textContent?.trim()).toBe('5');
  });

  it('hides cart badge when cartCount is 0', () => {
    build({ fullName: 'Ana', roles: [Role.BUYER] }, 0);
    expect(el.querySelector('.cart-badge')).toBeNull();
  });

  // ── Search ────────────────────────────────────────────────────────────────

  it('onSearch emits searchChange', () => {
    build();
    const spy = jasmine.createSpy('searchChange');
    component.searchChange.subscribe(spy);
    const input = el.querySelector<HTMLInputElement>('.nav-search-input')!;
    input.value = 'café';
    input.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith('café');
    expect(component['searchValue']()).toBe('café');
  });

  it('shows clear button when searchValue is non-empty', () => {
    build();
    component['searchValue'].set('algo');
    fixture.detectChanges();
    expect(el.querySelector('.nav-search-clear')).toBeTruthy();
  });

  it('clear button calls clearSearch', () => {
    build();
    component['searchValue'].set('algo');
    fixture.detectChanges();
    const spy = jasmine.createSpy('searchChange');
    component.searchChange.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.nav-search-clear')!.click();
    expect(component['searchValue']()).toBe('');
    expect(spy).toHaveBeenCalledWith('');
  });

  it('dropdownVisible is true when focused, ≥3 chars and suggestions present', () => {
    build();
    fixture.componentRef.setInput('searchSuggestions', [
      { id: 's1', name: 'Café Huila', producer: 'Finca', emoji: '☕', price: 50000 },
    ]);
    component['searchValue'].set('café');
    component['searchFocused'].set(true);
    fixture.detectChanges();
    expect(component['dropdownVisible']()).toBeTrue();
    expect(el.querySelector('.nav-search-dropdown')).toBeTruthy();
  });

  it('dropdownVisible is false when searchValue < 3 chars', () => {
    build();
    fixture.componentRef.setInput('searchSuggestions', [
      { id: 's1', name: 'Café', producer: 'F', emoji: '☕', price: 10000 },
    ]);
    component['searchValue'].set('ca');
    component['searchFocused'].set(true);
    fixture.detectChanges();
    expect(component['dropdownVisible']()).toBeFalse();
  });

  it('suggestion click calls onSelectSuggestion and emits suggestionSelected', () => {
    build();
    const suggestion: INavSearchSuggestion = { id: 'p1', name: 'Café Huila', producer: 'F', emoji: '☕', price: 50000 };
    fixture.componentRef.setInput('searchSuggestions', [suggestion]);
    component['searchValue'].set('café');
    component['searchFocused'].set(true);
    fixture.detectChanges();
    const spy = jasmine.createSpy('suggestionSelected');
    component.suggestionSelected.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.nav-search-suggestion')!.click();
    expect(spy).toHaveBeenCalledWith('p1');
    expect(component['searchValue']()).toBe('');
  });

  it('onDropdownMousedown prevents default', () => {
    build();
    const event = new MouseEvent('mousedown');
    spyOn(event, 'preventDefault');
    component['onDropdownMousedown'](event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('onSearchEnter navigates to / with query param', () => {
    build();
    component['searchValue'].set('café especial');
    const spy = spyOn(component['router'], 'navigate');
    component['onSearchEnter']();
    expect(spy).toHaveBeenCalledWith(['/'], { queryParams: { q: 'café especial' } });
  });

  it('onSearchEnter does nothing when searchValue is empty', () => {
    build();
    component['searchValue'].set('');
    const spy = spyOn(component['router'], 'navigate');
    component['onSearchEnter']();
    expect(spy).not.toHaveBeenCalled();
  });

  // ── Mobile menu ───────────────────────────────────────────────────────────

  it('hamburger click opens mobile menu', () => {
    build();
    el.querySelector<HTMLButtonElement>('.nav-hamburger')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.mobile-menu')).toBeTruthy();
  });

  it('mobile menu shows login/register when unauthenticated', () => {
    build(null);
    component['mobileMenuOpen'].set(true);
    fixture.detectChanges();
    const links = Array.from(el.querySelectorAll('.mobile-menu a'));
    expect(links.some(a => a.textContent?.includes('Iniciar sesión'))).toBeTrue();
  });

  it('mobile menu shows dashboard button when authenticated', () => {
    build({ fullName: 'Ana García', roles: [Role.BUYER] });
    component['mobileMenuOpen'].set(true);
    fixture.detectChanges();
    const btns = Array.from(el.querySelectorAll('.mobile-menu button'));
    expect(btns.some(b => b.textContent?.includes('Mi panel'))).toBeTrue();
  });

  it('closeMobileMenu sets mobileMenuOpen to false', () => {
    build();
    component['mobileMenuOpen'].set(true);
    component['closeMobileMenu']();
    expect(component['mobileMenuOpen']()).toBeFalse();
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  it('goToCart navigates to /panel/comprador', () => {
    build({ fullName: 'Ana', roles: [Role.BUYER] });
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    component['goToCart']();
    expect(spy).toHaveBeenCalledWith(['/panel/comprador']);
  });

  it('goToDashboard navigates BUYER to /panel/comprador', () => {
    build({ fullName: 'Ana', roles: [Role.BUYER] });
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    component['goToDashboard']();
    expect(spy).toHaveBeenCalledWith(['/panel/comprador']);
  });

  it('goToDashboard navigates PRODUCER to /panel/productor', () => {
    build({ fullName: 'Carlos', roles: [Role.PRODUCER] });
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    component['goToDashboard']();
    expect(spy).toHaveBeenCalledWith(['/panel/productor']);
  });

  it('goToDashboard navigates ADMIN to /panel/admin', () => {
    build({ fullName: 'Admin', roles: [Role.ADMIN] });
    const spy = spyOn(component['router'], 'navigate').and.returnValue(Promise.resolve(true));
    component['goToDashboard']();
    expect(spy).toHaveBeenCalledWith(['/panel/admin']);
  });

  it('logout calls auth.logout', () => {
    const authSvc = build({ fullName: 'Ana', roles: [Role.BUYER] });
    component['logout']();
    expect(authSvc.logout).toHaveBeenCalled();
  });
});
