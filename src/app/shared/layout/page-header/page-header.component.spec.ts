import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent, IBreadcrumb } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;
  let el: HTMLElement;

  function create(inputs: Partial<PageHeaderComponent> = {}) {
    fixture = TestBed.createComponent(PageHeaderComponent);
    Object.assign(fixture.componentInstance, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PageHeaderComponent] }).compileComponents();
  });

  it('renders page header', () => {
    create({ title: 'Dashboard' });
    expect(el.querySelector('.page-header')).toBeTruthy();
  });

  it('renders title', () => {
    create({ title: 'Mis Pedidos' });
    expect(el.querySelector('.page-header__title')!.textContent?.trim()).toBe('Mis Pedidos');
  });

  it('shows subtitle when provided', () => {
    create({ title: 'T', subtitle: 'Subtítulo aquí' });
    expect(el.querySelector('.page-header__subtitle')!.textContent?.trim()).toBe('Subtítulo aquí');
  });

  it('hides subtitle when empty', () => {
    create({ title: 'T' });
    expect(el.querySelector('.page-header__subtitle')).toBeNull();
  });

  it('renders breadcrumb nav when breadcrumbs provided', () => {
    const breadcrumbs: IBreadcrumb[] = [
      { label: 'Inicio', route: '/' },
      { label: 'Pedidos' },
    ];
    create({ title: 'T', breadcrumbs });
    expect(el.querySelector('.page-header__breadcrumbs')).toBeTruthy();
  });

  it('hides breadcrumb nav when empty', () => {
    create({ title: 'T', breadcrumbs: [] });
    expect(el.querySelector('.page-header__breadcrumbs')).toBeNull();
  });

  it('last breadcrumb has aria-current="page"', () => {
    const breadcrumbs: IBreadcrumb[] = [
      { label: 'Inicio', route: '/' },
      { label: 'Pedidos' },
    ];
    create({ title: 'T', breadcrumbs });
    const crumbs = el.querySelectorAll('.page-header__crumb');
    const last = crumbs[crumbs.length - 1];
    expect(last.getAttribute('aria-current')).toBe('page');
  });

  it('non-last breadcrumbs render as anchor links', () => {
    const breadcrumbs: IBreadcrumb[] = [
      { label: 'Inicio', route: '/' },
      { label: 'Pedidos' },
    ];
    create({ title: 'T', breadcrumbs });
    expect(el.querySelector('.page-header__breadcrumbs a')).toBeTruthy();
  });

  it('header has id="main-content" for skip-link', () => {
    create({ title: 'T' });
    expect(el.querySelector('header')!.id).toBe('main-content');
  });
});
