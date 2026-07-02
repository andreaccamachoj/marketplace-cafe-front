import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal, computed } from '@angular/core';
import { PanelLayoutComponent } from './panel-layout.component';
import { AuthService } from '@core/auth/services/auth.service';
import { CartService } from '@features/buyer/services/cart.service';
import { ISidebarItem } from '../sidebar/sidebar.component';

const mockAuthService = {
  currentUser:     signal(null),
  isAuthenticated: computed(() => false),
  currentRole:     computed(() => null),
  logout:          jasmine.createSpy('logout'),
};

const mockCartService = {
  count: computed(() => 0),
};

const ITEMS: ISidebarItem[] = [
  { label: 'Inicio',  icon: '🏠', route: '/panel' },
  { label: 'Pedidos', icon: '📦', route: '/panel/pedidos' },
];

describe('PanelLayoutComponent', () => {
  let fixture: ComponentFixture<PanelLayoutComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelLayoutComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PanelLayoutComponent);
    fixture.componentInstance.sidebarItems = ITEMS;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the panel layout container', () => {
    expect(el.querySelector('.panel-layout')).toBeTruthy();
  });

  it('renders sidebar', () => {
    expect(el.querySelector('app-sidebar')).toBeTruthy();
  });

  it('renders navbar', () => {
    expect(el.querySelector('app-navbar')).toBeTruthy();
  });

  it('renders footer', () => {
    expect(el.querySelector('app-footer')).toBeTruthy();
  });

  it('renders main content area', () => {
    expect(el.querySelector('main.panel-layout__main')).toBeTruthy();
  });

  it('passes sidebarItems to sidebar', () => {
    const links = el.querySelectorAll('.sidebar__link');
    expect(links.length).toBe(2);
  });
});
