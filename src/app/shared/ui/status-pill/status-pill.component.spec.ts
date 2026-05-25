import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusPillComponent } from './status-pill.component';

describe('StatusPillComponent', () => {
  let fixture: ComponentFixture<StatusPillComponent>;
  let component: StatusPillComponent;
  let el: HTMLElement;

  function create(inputs: Partial<StatusPillComponent> = {}) {
    fixture   = TestBed.createComponent(StatusPillComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatusPillComponent] }).compileComponents();
  });

  it('renders a span with class "pill"', () => {
    create();
    expect(el.querySelector('span.pill')).toBeTruthy();
  });

  it('uses explicit variant when provided', () => {
    create({ variant: 'green' });
    expect(el.querySelector('span')!.className).toContain('pill--green');
  });

  it('resolves "confirmed" status to green', () => {
    create({ status: 'confirmed' });
    expect(el.querySelector('span')!.className).toContain('pill--green');
  });

  it('resolves "pending" status to amber', () => {
    create({ status: 'pending' });
    expect(el.querySelector('span')!.className).toContain('pill--amber');
  });

  it('resolves "shipped" status to blue', () => {
    create({ status: 'shipped' });
    expect(el.querySelector('span')!.className).toContain('pill--blue');
  });

  it('resolves "cancelled" status to red', () => {
    create({ status: 'cancelled' });
    expect(el.querySelector('span')!.className).toContain('pill--red');
  });

  it('resolves "premium" status to purple', () => {
    create({ status: 'premium' });
    expect(el.querySelector('span')!.className).toContain('pill--purple');
  });

  it('falls back to neutral for unknown status', () => {
    create({ status: 'unknown_xyz' });
    expect(el.querySelector('span')!.className).toContain('pill--neutral');
  });

  it('explicit variant takes priority over status mapping', () => {
    create({ variant: 'red', status: 'confirmed' });
    expect(component.resolvedVariant).toBe('red');
  });

  it('does not show dot by default', () => {
    create();
    expect(el.querySelector('.pill__dot')).toBeNull();
  });

  it('shows dot when showDot=true', () => {
    create({ showDot: true });
    expect(el.querySelector('.pill__dot')).toBeTruthy();
  });

  it('displays status text in the pill', () => {
    create({ status: 'active' });
    expect(el.querySelector('span')!.textContent?.trim()).toBe('active');
  });

  it('resolves status case-insensitively', () => {
    create({ status: 'ACTIVE' });
    expect(el.querySelector('span')!.className).toContain('pill--green');
  });
});
