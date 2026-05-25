import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;
  let component: StatCardComponent;
  let el: HTMLElement;

  function create(inputs: Partial<StatCardComponent> = {}) {
    fixture   = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatCardComponent] }).compileComponents();
  });

  it('renders an article with class stat-card', () => {
    create();
    expect(el.querySelector('article.stat-card')).toBeTruthy();
  });

  it('applies color class', () => {
    create({ color: 'green', label: 'Revenue', value: '100' });
    expect(el.querySelector('article')!.className).toContain('stat-card--green');
  });

  it('renders label and value', () => {
    create({ label: 'Orders', value: '42' });
    expect(el.querySelector('.stat-card__label')?.textContent?.trim()).toBe('Orders');
    expect(el.querySelector('.stat-card__value')?.textContent?.trim()).toBe('42');
  });

  it('shows icon when provided', () => {
    create({ icon: 'shopping_cart' });
    expect(el.querySelector('.stat-card__icon')).toBeTruthy();
    expect(el.querySelector('.material-icon')?.textContent?.trim()).toBe('shopping_cart');
  });

  it('hides icon when not provided', () => {
    create({ icon: '' });
    expect(el.querySelector('.stat-card__icon')).toBeNull();
  });

  it('hides change row when change is null', () => {
    create({ change: null });
    expect(el.querySelector('.stat-card__change')).toBeNull();
  });

  it('shows change row when change is provided', () => {
    create({ change: 10, changeLabel: 'vs last month' });
    expect(el.querySelector('.stat-card__change')).toBeTruthy();
  });

  it('trendResolved returns "up" for positive change', () => {
    create({ change: 5 });
    expect(component['trendResolved']()).toBe('up');
  });

  it('trendResolved returns "down" for negative change', () => {
    create({ change: -3 });
    expect(component['trendResolved']()).toBe('down');
  });

  it('trendResolved returns "neutral" for zero change', () => {
    create({ change: 0 });
    expect(component['trendResolved']()).toBe('neutral');
  });

  it('trendResolved returns "neutral" when change is null', () => {
    create({ change: null });
    expect(component['trendResolved']()).toBe('neutral');
  });

  it('trendResolved uses explicit trend input over change', () => {
    create({ change: 10, trend: 'down' });
    expect(component['trendResolved']()).toBe('down');
  });

  it('trendIcon returns ↑ for up trend', () => {
    create({ change: 5 });
    expect(component['trendIcon']()).toBe('↑');
  });

  it('trendIcon returns ↓ for down trend', () => {
    create({ change: -1 });
    expect(component['trendIcon']()).toBe('↓');
  });

  it('trendIcon returns → for neutral trend', () => {
    create({ change: 0 });
    expect(component['trendIcon']()).toBe('→');
  });

  it('sets aria-label combining label and value', () => {
    create({ label: 'Sales', value: '200' });
    expect(el.querySelector('article')!.getAttribute('aria-label')).toBe('Sales: 200');
  });
});
