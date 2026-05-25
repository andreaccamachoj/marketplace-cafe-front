import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockIndicatorComponent } from './stock-indicator.component';

describe('StockIndicatorComponent', () => {
  let fixture: ComponentFixture<StockIndicatorComponent>;
  let el: HTMLElement;

  function create(stock: number, maxStock = 100) {
    fixture = TestBed.createComponent(StockIndicatorComponent);
    fixture.componentInstance.stock    = stock;
    fixture.componentInstance.maxStock = maxStock;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StockIndicatorComponent] }).compileComponents();
  });

  it('renders the stock container', () => {
    create(50);
    expect(el.querySelector('.stock')).toBeTruthy();
  });

  it('stock=0 → level "out" and label "Agotado"', () => {
    create(0);
    expect(el.querySelector('.stock')!.className).toContain('stock--out');
    expect(el.querySelector('.stock__label')!.textContent?.trim()).toBe('Agotado');
  });

  it('stock=10 out of 100 → level "low" and label "Últimas unidades"', () => {
    create(10, 100);
    expect(el.querySelector('.stock')!.className).toContain('stock--low');
    expect(el.querySelector('.stock__label')!.textContent?.trim()).toBe('Últimas unidades');
  });

  it('stock=30 out of 100 → level "medium" and label "Pocas unidades"', () => {
    create(30, 100);
    expect(el.querySelector('.stock')!.className).toContain('stock--medium');
    expect(el.querySelector('.stock__label')!.textContent?.trim()).toBe('Pocas unidades');
  });

  it('stock=80 out of 100 → level "high" and label "Disponible"', () => {
    create(80, 100);
    expect(el.querySelector('.stock')!.className).toContain('stock--high');
    expect(el.querySelector('.stock__label')!.textContent?.trim()).toBe('Disponible');
  });

  it('pct is capped at 100 even if stock > maxStock', () => {
    create(200, 100);
    const fill = el.querySelector<HTMLElement>('.stock__fill')!;
    expect(fill.style.width).toBe('100%');
  });

  it('pct=0 means fill width is 0%', () => {
    create(0);
    const fill = el.querySelector<HTMLElement>('.stock__fill')!;
    expect(fill.style.width).toBe('0%');
  });

  it('renders a progressbar with aria attributes', () => {
    create(50);
    const bar = el.querySelector('[role="progressbar"]')!;
    expect(bar).toBeTruthy();
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('boundary: exactly 20% → level "low"', () => {
    create(20, 100);
    expect(el.querySelector('.stock')!.className).toContain('stock--low');
  });

  it('boundary: exactly 50% → level "medium"', () => {
    create(50, 100);
    expect(el.querySelector('.stock')!.className).toContain('stock--medium');
  });

  it('maxStock=0 is handled without division by zero (pct=100)', () => {
    create(5, 0);
    expect(el.querySelector('.stock')).toBeTruthy();
  });
});
