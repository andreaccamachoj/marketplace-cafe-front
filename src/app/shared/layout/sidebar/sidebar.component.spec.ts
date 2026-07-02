import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent, ISidebarItem } from './sidebar.component';

const ITEMS: ISidebarItem[] = [
  { label: 'Inicio',   icon: '🏠', route: '/panel/comprador' },
  { label: 'Pedidos',  icon: '📦', route: '/panel/comprador/pedidos' },
  { label: 'Favoritos', icon: '❤️', route: '/panel/comprador/favoritos', badge: 3 },
];

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let el: HTMLElement;

  function create(items: ISidebarItem[] = ITEMS) {
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentInstance.items = items;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('renders the sidebar', () => {
    create();
    expect(el.querySelector('.sidebar')).toBeTruthy();
  });

  it('renders one link per item', () => {
    create();
    expect(el.querySelectorAll('.sidebar__link').length).toBe(3);
  });

  it('renders item labels', () => {
    create();
    const labels = Array.from(el.querySelectorAll('.sidebar__label')).map(s => s.textContent?.trim());
    expect(labels).toContain('Inicio');
    expect(labels).toContain('Pedidos');
  });

  it('renders item icons', () => {
    create();
    const icons = Array.from(el.querySelectorAll('.sidebar__icon')).map(s => s.textContent?.trim());
    expect(icons).toContain('🏠');
  });

  it('renders badge when item has badge', () => {
    create();
    expect(el.querySelector('.sidebar__badge')!.textContent?.trim()).toBe('3');
  });

  it('no badge when item has no badge', () => {
    create([{ label: 'Inicio', icon: '🏠', route: '/panel' }]);
    expect(el.querySelector('.sidebar__badge')).toBeNull();
  });

  it('sidebar has role="navigation"', () => {
    create();
    expect(el.querySelector('aside')!.getAttribute('role')).toBe('navigation');
  });

  it('renders empty state when items is empty', () => {
    create([]);
    expect(el.querySelectorAll('.sidebar__link').length).toBe(0);
  });
});
