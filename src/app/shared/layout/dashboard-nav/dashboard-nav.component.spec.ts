import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal, computed } from '@angular/core';
import { DashboardNavComponent } from './dashboard-nav.component';
import { AuthService } from '@core/auth/services/auth.service';
import { Role } from '@core/auth/models/role.enum';

function makeAuthService(fullName: string | null, role: Role | null) {
  const currentUser = signal(fullName ? { fullName, roles: role ? [role] : [] } as any : null);
  return {
    currentUser,
    isAuthenticated: computed(() => currentUser() !== null),
    currentRole:     computed(() => role),
    logout:          jasmine.createSpy('logout'),
  };
}

describe('DashboardNavComponent', () => {
  let fixture: ComponentFixture<DashboardNavComponent>;
  let component: DashboardNavComponent;
  let el: HTMLElement;
  let authSvc: ReturnType<typeof makeAuthService>;

  function build(fullName: string | null = 'Ana García', role: Role | null = Role.BUYER) {
    authSvc = makeAuthService(fullName, role);
    TestBed.overrideProvider(AuthService, { useValue: authSvc });
    fixture   = TestBed.createComponent(DashboardNavComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    return authSvc;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNavComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: makeAuthService('Test', Role.BUYER) }],
    }).compileComponents();
  });

  it('renders the dashboard nav', () => {
    build();
    expect(el.querySelector('.dn-nav')).toBeTruthy();
  });

  it('renders logo', () => {
    build();
    expect(el.querySelector('.dn-logo')).toBeTruthy();
  });

  it('renders catalog link', () => {
    build();
    expect(el.querySelector('.dn-cat-btn')).toBeTruthy();
  });

  it('renders logout button', () => {
    build();
    expect(el.querySelector('.dn-logout')).toBeTruthy();
  });

  it('shows user full name', () => {
    build('Ana García', Role.BUYER);
    expect(el.querySelector('.dn-user-name')!.textContent?.trim()).toBe('Ana García');
  });

  it('shows user initials for single-word name', () => {
    build('Ana', Role.BUYER);
    expect(component['userInitials']()).toBe('A');
  });

  it('shows user initials for two-word name', () => {
    build('Ana García', Role.BUYER);
    expect(component['userInitials']()).toBe('AG');
  });

  it('shows role label "Comprador" for BUYER', () => {
    build('Ana García', Role.BUYER);
    expect(el.querySelector('.dn-user-role')!.textContent?.trim()).toBe('Comprador');
  });

  it('shows role label "Productor" for PRODUCER', () => {
    build('Carlos Ruiz', Role.PRODUCER);
    expect(el.querySelector('.dn-user-role')!.textContent?.trim()).toBe('Productor');
  });

  it('shows role label "Administrador" for ADMIN', () => {
    build('Admin User', Role.ADMIN);
    expect(el.querySelector('.dn-user-role')!.textContent?.trim()).toBe('Administrador');
  });

  it('empty roleLabel when no role', () => {
    build(null, null);
    expect(component['roleLabel']()).toBe('');
  });

  it('avatarColor for BUYER', () => {
    build('Ana', Role.BUYER);
    expect(component['avatarColor']()).toContain('cafe-medio');
  });

  it('avatarColor for PRODUCER', () => {
    build('Carlos', Role.PRODUCER);
    expect(component['avatarColor']()).toContain('verde-fresco');
  });

  it('avatarColor for ADMIN', () => {
    build('Admin', Role.ADMIN);
    expect(component['avatarColor']()).toBe('#5B3E8F');
  });

  it('avatarColor defaults when no role', () => {
    build(null, null);
    expect(component['avatarColor']()).toContain('cafe-medio');
  });

  it('shows page title when pageTitle input provided', () => {
    build();
    fixture.componentRef.setInput('pageTitle', 'Mis Pedidos');
    fixture.detectChanges();
    expect(el.querySelector('.dn-page-title')!.textContent?.trim()).toBe('Mis Pedidos');
  });

  it('hides page title when pageTitle is empty', () => {
    build();
    expect(el.querySelector('.dn-page-title')).toBeNull();
  });

  it('logout button calls auth.logout', () => {
    build();
    el.querySelector<HTMLButtonElement>('.dn-logout')!.click();
    expect(authSvc.logout).toHaveBeenCalled();
  });

  it('hamburger click emits menuToggle', () => {
    build();
    const spy = jasmine.createSpy('menuToggle');
    component.menuToggle.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.dn-menu-btn')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('nav has role="navigation"', () => {
    build();
    expect(el.querySelector('nav')!.getAttribute('role')).toBe('navigation');
  });
});
