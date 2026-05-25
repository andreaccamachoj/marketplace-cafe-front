import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailTabsComponent } from './product-detail-tabs.component';

const mockFarmInfo = {
  name: 'Finca El Paraíso', municipality: 'Pitalito', department: 'Huila',
  altitude: 1800, area: 12, process: 'Lavado',
};
const mockFlavorNotes = [{ icon: '🍫', name: 'Chocolate', intensity: 80 }];
const mockCuppingAttrs = [{ label: 'Aroma', value: 8.5 }];

describe('ProductDetailTabsComponent', () => {
  let fixture: ComponentFixture<ProductDetailTabsComponent>;
  let component: ProductDetailTabsComponent;
  let el: HTMLElement;

  function create(overrides: Partial<ProductDetailTabsComponent> = {}) {
    fixture   = TestBed.createComponent(ProductDetailTabsComponent);
    component = fixture.componentInstance;
    component.description      = 'Café de alta montaña';
    component.flavorNotes      = mockFlavorNotes;
    component.cuppingScore     = 88;
    component.cuppingAttributes = mockCuppingAttrs;
    component.farmInfo         = mockFarmInfo as any;
    Object.assign(component, overrides);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductDetailTabsComponent] }).compileComponents();
  });

  it('renders tab list', () => {
    create();
    expect(el.querySelector('[role="tablist"]')).toBeTruthy();
  });

  it('renders description tab by default', () => {
    create();
    expect(el.textContent).toContain('Café de alta montaña');
  });

  it('renders 4 tabs', () => {
    create();
    expect(el.querySelectorAll('[role="tab"]').length).toBe(4);
  });

  it('description tab is active by default', () => {
    create();
    const activeTab = el.querySelector<HTMLButtonElement>('.d-tab.active')!;
    expect(activeTab.textContent).toContain('Descripción');
  });

  it('clicking notas tab shows flavor notes panel', () => {
    create();
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[1].click();
    fixture.detectChanges();
    expect(component['activeTab']()).toBe('notes');
  });

  it('clicking finca tab shows farm info', () => {
    create();
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[2].click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Finca El Paraíso');
  });

  it('clicking preparación tab changes active tab', () => {
    create();
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[3].click();
    fixture.detectChanges();
    expect(component['activeTab']()).toBe('prep');
  });

  it('renders farm altitude info in farm tab', () => {
    create();
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[2].click();
    fixture.detectChanges();
    expect(el.textContent).toContain('1800');
  });

  it('renders process chip in description tab when farmInfo has process', () => {
    create();
    expect(el.textContent).toContain('Lavado');
  });

  it('renders altitude chip in description tab when farmInfo has altitude', () => {
    create();
    expect(el.textContent).toContain('1800 msnm');
  });

  it('does not render desc-chips when no farmInfo', () => {
    create({ farmInfo: undefined });
    expect(el.querySelector('.desc-chips')).toBeNull();
  });

  it('clicking preparación tab shows brew methods', () => {
    create();
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[3].click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Espresso');
    expect(el.textContent).toContain('Chemex');
  });

  it('clicking notas tab shows flavor notes component', () => {
    create();
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[1].click();
    fixture.detectChanges();
    expect(el.querySelector('app-flavor-notes')).toBeTruthy();
  });

  it('farm tab does not render when farmInfo is undefined', () => {
    create({ farmInfo: undefined });
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[2].click();
    fixture.detectChanges();
    expect(el.querySelector('.farm-detail-grid')).toBeNull();
  });
});
