import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductOptionsComponent } from './product-options.component';

const roastLevels = [
  { id: 'light', name: 'Claro', icon: '☀️', sub: 'Suave y ácido' },
  { id: 'medium', name: 'Medio', icon: '🌤️', sub: 'Equilibrado' },
];

describe('ProductOptionsComponent', () => {
  let fixture: ComponentFixture<ProductOptionsComponent>;
  let component: ProductOptionsComponent;
  let el: HTMLElement;

  function create(overrides: Partial<ProductOptionsComponent> = {}) {
    fixture   = TestBed.createComponent(ProductOptionsComponent);
    component = fixture.componentInstance;
    component.presentationTypes = ['Grano', 'Molido'];
    component.roastLevels       = roastLevels;
    Object.assign(component, overrides);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductOptionsComponent] }).compileComponents();
  });

  it('renders presentation chips', () => {
    create();
    expect(el.textContent).toContain('Grano');
    expect(el.textContent).toContain('Molido');
  });

  it('renders roast level cards', () => {
    create();
    expect(el.textContent).toContain('Claro');
    expect(el.textContent).toContain('Medio');
  });

  it('auto-selects first presentation on init', () => {
    create();
    expect(component['selectedPresentation']()).toBe('Grano');
  });

  it('auto-selects first roast on init', () => {
    create();
    expect(component['selectedRoast']()).toBe('light');
  });

  it('clicking presentation chip updates selection', () => {
    create();
    const chips = el.querySelectorAll<HTMLButtonElement>('.chip');
    chips[1].click();
    fixture.detectChanges();
    expect(component['selectedPresentation']()).toBe('Molido');
  });

  it('clicking roast card updates selection', () => {
    create();
    const cards = el.querySelectorAll<HTMLButtonElement>('.roast-card');
    cards[1].click();
    fixture.detectChanges();
    expect(component['selectedRoast']()).toBe('medium');
  });

  it('emits presentationChange when chip clicked', () => {
    create();
    const spy = jasmine.createSpy('presentationChange');
    component.presentationChange.subscribe(spy);
    el.querySelectorAll<HTMLButtonElement>('.chip')[1].click();
    expect(spy).toHaveBeenCalledWith('Molido');
  });

  it('emits roastChange when roast card clicked', () => {
    create();
    const spy = jasmine.createSpy('roastChange');
    component.roastChange.subscribe(spy);
    el.querySelectorAll<HTMLButtonElement>('.roast-card')[1].click();
    expect(spy).toHaveBeenCalledWith('medium');
  });

  it('active chip has active class', () => {
    create();
    const firstChip = el.querySelectorAll<HTMLButtonElement>('.chip')[0]!;
    expect(firstChip.classList).toContain('chip--active');
  });

  it('does not render presentations section when empty', () => {
    create({ presentationTypes: [] });
    expect(el.querySelectorAll('.chip').length).toBe(0);
  });

  it('does not render roast section when empty', () => {
    create({ roastLevels: [] });
    expect(el.querySelectorAll('.roast-card').length).toBe(0);
  });
});
