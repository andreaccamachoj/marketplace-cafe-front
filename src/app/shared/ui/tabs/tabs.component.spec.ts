import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent, ITab } from './tabs.component';

const TABS: ITab[] = [
  { id: 'a', label: 'Tab A' },
  { id: 'b', label: 'Tab B' },
  { id: 'c', label: 'Tab C', disabled: true },
];

describe('TabsComponent', () => {
  let fixture: ComponentFixture<TabsComponent>;
  let component: TabsComponent;
  let el: HTMLElement;

  function create(inputs: Partial<TabsComponent> = {}) {
    fixture   = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function tabButtons() {
    return el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TabsComponent] }).compileComponents();
  });

  it('renders one tab button per tab', () => {
    create({ tabs: TABS });
    expect(tabButtons().length).toBe(3);
  });

  it('renders tab labels', () => {
    create({ tabs: TABS });
    const labels = Array.from(tabButtons()).map(b => b.textContent?.trim());
    expect(labels).toContain('Tab A');
    expect(labels).toContain('Tab B');
  });

  it('initially no tab is active', () => {
    create({ tabs: TABS });
    const active = Array.from(tabButtons()).filter(b => b.classList.contains('tab--active'));
    expect(active.length).toBe(0);
  });

  it('activeTab input sets the active tab', () => {
    create({ tabs: TABS, activeTab: 'b' });
    expect(tabButtons()[1].classList).toContain('tab--active');
  });

  it('clicking a tab marks it as active', () => {
    create({ tabs: TABS });
    tabButtons()[0].click();
    fixture.detectChanges();
    expect(component['activeId']()).toBe('a');
    expect(tabButtons()[0].classList).toContain('tab--active');
  });

  it('clicking a tab emits tabChange', () => {
    create({ tabs: TABS });
    const spy = jasmine.createSpy('tabChange');
    component.tabChange.subscribe(spy);
    tabButtons()[1].click();
    expect(spy).toHaveBeenCalledWith('b');
  });

  it('disabled tab has disabled attribute', () => {
    create({ tabs: TABS });
    expect(tabButtons()[2].disabled).toBeTrue();
  });

  it('applies variant class to nav', () => {
    create({ tabs: TABS, variant: 'pills' });
    expect(el.querySelector('nav')!.classList).toContain('tabs--pills');
  });

  it('shows icon when provided', () => {
    const tabsWithIcon: ITab[] = [{ id: 'y', label: 'Y', icon: '🏠' }];
    create({ tabs: tabsWithIcon });
    expect(el.querySelector('.tab__icon')!.textContent?.trim()).toBe('🏠');
  });

  it('no icon span when icon is not provided', () => {
    create({ tabs: TABS });
    expect(el.querySelector('.tab__icon')).toBeNull();
  });

  it('arrowRight key advances to next non-disabled tab', () => {
    create({ tabs: TABS, activeTab: 'a' });
    const spy = jasmine.createSpy('tabChange');
    component.tabChange.subscribe(spy);
    tabButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('b');
  });

  it('arrowLeft key moves to previous non-disabled tab', () => {
    create({ tabs: TABS, activeTab: 'b' });
    const spy = jasmine.createSpy('tabChange');
    component.tabChange.subscribe(spy);
    tabButtons()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('aria-label is set on nav', () => {
    create({ tabs: TABS, ariaLabel: 'Mi navegación' });
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Mi navegación');
  });
});
