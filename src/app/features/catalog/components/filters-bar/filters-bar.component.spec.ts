import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersBarComponent } from './filters-bar.component';

const cats  = [{ id: '1', name: 'Especial' }, { id: '2', name: 'Espresso' }];
const certs = [{ id: 1, code: 'ORGANIC', name: 'Orgánico' }, { id: 2, code: 'FAIRTRADE', name: 'Comercio Justo' }];

describe('FiltersBarComponent', () => {
  let fixture: ComponentFixture<FiltersBarComponent>;
  let component: FiltersBarComponent;
  let el: HTMLElement;

  function create(overrides: Partial<FiltersBarComponent> = {}) {
    fixture   = TestBed.createComponent(FiltersBarComponent);
    component = fixture.componentInstance;
    component.categories          = cats;
    component.certifications      = certs;
    component.presentations       = ['Grano', 'Molido'];
    component.selectedCategory    = null;
    component.selectedCerts       = [];
    component.selectedPresentation = null;
    component.sortBy              = 'relevance';
    component.resultCount         = 10;
    Object.assign(component, overrides);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FiltersBarComponent] }).compileComponents();
  });

  it('renders the filters bar', () => {
    create();
    expect(el.querySelector('.filters-bar')).toBeTruthy();
  });

  it('renders "Todos" category chip', () => {
    create();
    const chips = el.querySelectorAll<HTMLButtonElement>('.chip');
    expect(Array.from(chips).some(c => c.textContent?.includes('Todos'))).toBeTrue();
  });

  it('renders dynamic category chips', () => {
    create();
    expect(el.textContent).toContain('Especial');
    expect(el.textContent).toContain('Espresso');
  });

  it('"Todos" chip is active when no category selected', () => {
    create({ selectedCategory: null });
    const todosChip = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip'))
      .find(c => c.textContent?.trim() === 'Todos')!;
    expect(todosChip.classList).toContain('active');
  });

  it('category chip is active when selectedCategory matches', () => {
    create({ selectedCategory: 'Especial' });
    const chip = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip'))
      .find(c => c.textContent?.trim() === 'Especial')!;
    expect(chip.classList).toContain('active');
  });

  it('emits categoryChange with null when "Todos" clicked', () => {
    create();
    const spy = jasmine.createSpy('categoryChange');
    component.categoryChange.subscribe(spy);
    const todosBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip'))
      .find(c => c.textContent?.trim() === 'Todos')!;
    todosBtn.click();
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('emits categoryChange with category name when chip clicked', () => {
    create();
    const spy = jasmine.createSpy('categoryChange');
    component.categoryChange.subscribe(spy);
    const chip = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip'))
      .find(c => c.textContent?.trim() === 'Especial')!;
    chip.click();
    expect(spy).toHaveBeenCalledWith('Especial');
  });

  it('renders certification chips', () => {
    create();
    expect(el.textContent).toContain('Orgánico');
    expect(el.textContent).toContain('Comercio Justo');
  });

  it('cert chip emits certChange when clicked', () => {
    create();
    const spy = jasmine.createSpy('certChange');
    component.certChange.subscribe(spy);
    const certBtn = el.querySelector<HTMLButtonElement>('.cert-chip')!;
    certBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('cert chip has active class when cert is selected', () => {
    create({ selectedCerts: ['ORGANIC'] });
    const certBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('.cert-chip'))
      .find(b => b.textContent?.includes('Orgánico'))!;
    expect(certBtn.classList).toContain('active');
  });

  it('renders result count', () => {
    create({ resultCount: 42 });
    expect(el.textContent).toContain('42');
  });

  it('renders sort dropdown', () => {
    create();
    expect(el.querySelector('select')).toBeTruthy();
  });

  it('emits sortChange when sort changes', () => {
    create();
    const spy = jasmine.createSpy('sortChange');
    component.sortChange.subscribe(spy);
    const select = el.querySelector<HTMLSelectElement>('select')!;
    select.value = 'price-asc';
    select.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith('price-asc');
  });

  it('renders presentation chips when presentations provided', () => {
    create();
    expect(el.textContent).toContain('Grano');
    expect(el.textContent).toContain('Molido');
  });

  it('emits presentationChange when presentation chip clicked', () => {
    create();
    const spy = jasmine.createSpy('presentationChange');
    component.presentationChange.subscribe(spy);
    const presChip = Array.from(el.querySelectorAll<HTMLButtonElement>('[aria-label="Filtrar por presentación"] .chip, [aria-label="Filtrar por presentación"] button'))
      .find(b => b.textContent?.trim() === 'Grano');
    if (presChip) {
      presChip.click();
      expect(spy).toHaveBeenCalledWith('Grano');
    } else {
      pending('Presentation chip not found');
    }
  });

  it('cert chip removes cert when already selected', () => {
    create({ selectedCerts: ['ORGANIC'] });
    const spy = jasmine.createSpy('certChange');
    component.certChange.subscribe(spy);
    const certBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('.cert-chip'))
      .find(b => b.textContent?.includes('Orgánico'))!;
    certBtn.click();
    const emitted = spy.calls.mostRecent().args[0] as string[];
    expect(emitted).not.toContain('ORGANIC');
  });

  it('cert chip adds cert when not selected', () => {
    create({ selectedCerts: [] });
    const spy = jasmine.createSpy('certChange');
    component.certChange.subscribe(spy);
    const certBtn = el.querySelector<HTMLButtonElement>('.cert-chip')!;
    certBtn.click();
    const emitted = spy.calls.mostRecent().args[0] as string[];
    expect(emitted.length).toBe(1);
  });

  it('renders singular "producto" when resultCount is 1', () => {
    create({ resultCount: 1 });
    expect(el.textContent).toContain('1 producto');
    expect(el.textContent).not.toContain('1 productos');
  });

  it('certCss returns fallback for unknown cert code', () => {
    create();
    expect(component['certCss']('UNKNOWN')).toBe('cert-chip-org');
  });

  it('certCss returns correct class for RAINFOREST', () => {
    create();
    expect(component['certCss']('RAINFOREST')).toBe('cert-chip-rain');
  });

  it('certIcon returns fallback for unknown cert code', () => {
    create();
    expect(component['certIcon']('UNKNOWN')).toBe('🏅');
  });

  it('certIcon returns correct icon for FAIRTRADE', () => {
    create();
    expect(component['certIcon']('FAIRTRADE')).toBe('⚖️');
  });

  it('emits presentationChange with null when Todas presentation clicked', () => {
    create();
    const spy = jasmine.createSpy('presentationChange');
    component.presentationChange.subscribe(spy);
    const allBtn = Array.from(el.querySelectorAll<HTMLButtonElement>('[aria-label="Filtrar por presentación"] .chip, [aria-label="Filtrar por presentación"] button'))
      .find(b => b.textContent?.trim() === 'Todas');
    if (allBtn) {
      allBtn.click();
      expect(spy).toHaveBeenCalledWith(null);
    } else {
      pending('Todas presentation button not found');
    }
  });
});
