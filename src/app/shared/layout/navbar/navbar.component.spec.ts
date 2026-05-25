import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal, computed } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '@core/auth/services/auth.service';

function makeAuthService(fullName: string | null) {
  const currentUser = signal(fullName ? { fullName, roles: [] } as any : null);
  return {
    currentUser,
    isAuthenticated: computed(() => currentUser() !== null),
    currentRole:     computed(() => null),
    logout:          jasmine.createSpy('logout'),
  };
}

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let el: HTMLElement;
  let authSpy: ReturnType<typeof makeAuthService>;

  beforeEach(async () => {
    authSpy = makeAuthService('Ana García');
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();
    fixture   = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the navbar', () => {
    expect(el.querySelector('nav.navbar')).toBeTruthy();
  });

  it('shows the user name', () => {
    expect(el.querySelector('.user-menu__name')!.textContent?.trim()).toBe('Ana García');
  });

  it('menu is closed initially', () => {
    expect(el.querySelector('.user-menu__dropdown')).toBeNull();
  });

  it('toggle button opens the dropdown', () => {
    el.querySelector<HTMLButtonElement>('.user-menu__toggle')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.user-menu__dropdown')).toBeTruthy();
  });

  it('toggle button again closes the dropdown', () => {
    el.querySelector<HTMLButtonElement>('.user-menu__toggle')!.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.user-menu__toggle')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.user-menu__dropdown')).toBeNull();
  });

  it('logout button calls auth.logout and emits logoutClick', () => {
    el.querySelector<HTMLButtonElement>('.user-menu__toggle')!.click();
    fixture.detectChanges();
    const spy = jasmine.createSpy('logoutClick');
    component.logoutClick.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.user-menu__item--logout')!.click();
    expect(authSpy.logout).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('profile link closes the menu', () => {
    el.querySelector<HTMLButtonElement>('.user-menu__toggle')!.click();
    fixture.detectChanges();
    const profileLink = el.querySelector<HTMLAnchorElement>('.user-menu__item:not(.user-menu__item--logout)')!;
    profileLink.click();
    fixture.detectChanges();
    expect(el.querySelector('.user-menu__dropdown')).toBeNull();
  });

  it('toggle button has aria-expanded attribute', () => {
    expect(el.querySelector('.user-menu__toggle')!.getAttribute('aria-expanded')).toBe('false');
    el.querySelector<HTMLButtonElement>('.user-menu__toggle')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.user-menu__toggle')!.getAttribute('aria-expanded')).toBe('true');
  });
});
