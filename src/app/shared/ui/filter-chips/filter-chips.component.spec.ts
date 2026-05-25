import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterChipsComponent, IFilterChip } from './filter-chips.component';

const CHIPS: IFilterChip[] = [
  { id: 'cafe', label: 'Café' },
  { id: 'cacao', label: 'Cacao' },
  { id: 'panela', label: 'Panela' },
];

describe('FilterChipsComponent', () => {
  let fixture: ComponentFixture<FilterChipsComponent>;
  let component: FilterChipsComponent;
  let el: HTMLElement;

  function create(inputs: Partial<FilterChipsComponent> = {}) {
    fixture   = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function chips() {
    return el.querySelectorAll<HTMLButtonElement>('button.chip:not(.chip--clear)');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FilterChipsComponent] }).compileComponents();
  });

  it('renders one chip per item', () => {
    create({ chips: CHIPS });
    expect(chips().length).toBe(3);
  });

  it('renders chip labels', () => {
    create({ chips: CHIPS });
    const labels = Array.from(chips()).map(c => c.textContent?.trim());
    expect(labels).toContain('Café');
  });

  it('no chips are active initially', () => {
    create({ chips: CHIPS });
    expect(el.querySelectorAll('.chip--active').length).toBe(0);
  });

  it('clicking a chip activates it', () => {
    create({ chips: CHIPS });
    chips()[0].click();
    fixture.detectChanges();
    expect(component['isSelected']('cafe')).toBeTrue();
    expect(chips()[0].classList).toContain('chip--active');
  });

  it('clicking active chip deactivates it', () => {
    create({ chips: CHIPS, selected: ['cafe'] });
    chips()[0].click();
    fixture.detectChanges();
    expect(component['isSelected']('cafe')).toBeFalse();
  });

  it('clicking a chip emits selectionChange', () => {
    create({ chips: CHIPS });
    const spy = jasmine.createSpy('selectionChange');
    component.selectionChange.subscribe(spy);
    chips()[0].click();
    expect(spy).toHaveBeenCalledWith(['cafe']);
  });

  it('selected input pre-selects chips', () => {
    create({ chips: CHIPS, selected: ['cacao'] });
    expect(component['isSelected']('cacao')).toBeTrue();
  });

  it('multi=false deselects previous when new chip clicked', () => {
    create({ chips: CHIPS, multi: false, selected: ['cafe'] });
    chips()[1].click();
    fixture.detectChanges();
    expect(component['isSelected']('cafe')).toBeFalse();
    expect(component['isSelected']('cacao')).toBeTrue();
  });

  it('clear button appears when a chip is selected', () => {
    create({ chips: CHIPS, selected: ['cafe'] });
    expect(el.querySelector('.chip--clear')).toBeTruthy();
  });

  it('clear button not visible when nothing selected', () => {
    create({ chips: CHIPS });
    expect(el.querySelector('.chip--clear')).toBeNull();
  });

  it('clear button click deselects all and emits empty array', () => {
    create({ chips: CHIPS, selected: ['cafe', 'cacao'] });
    const spy = jasmine.createSpy('selectionChange');
    component.selectionChange.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.chip--clear')!.click();
    fixture.detectChanges();
    expect(component['_selected']().size).toBe(0);
    expect(spy).toHaveBeenCalledWith([]);
  });

  it('removable=true shows remove icon on active chip', () => {
    create({ chips: CHIPS, selected: ['cafe'], removable: true });
    expect(el.querySelector('.chip__remove')).toBeTruthy();
  });
});
