import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponInputComponent } from './coupon-input.component';

describe('CouponInputComponent', () => {
  let fixture: ComponentFixture<CouponInputComponent>;
  let component: CouponInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CouponInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('appliedCoupon defaults to null', () => {
    expect(component.appliedCoupon()).toBeNull();
  });

  it('discountAmount defaults to 0', () => {
    expect(component.discountAmount()).toBe(0);
  });

  it('onInput updates couponInput signal', () => {
    const event = { target: { value: 'CAFE10' } } as unknown as Event;
    (component as any).onInput(event);
    expect((component as any).couponInput()).toBe('CAFE10');
  });

  it('emits apply with trimmed code and resets input when onApply called with non-empty code', () => {
    const emitted: string[] = [];
    component.apply.subscribe(v => emitted.push(v));
    (component as any).couponInput.set('  CAFE10  ');
    (component as any).onApply();
    expect(emitted).toEqual(['CAFE10']);
    expect((component as any).couponInput()).toBe('');
  });

  it('does not emit apply when couponInput is empty', () => {
    const emitted: string[] = [];
    component.apply.subscribe(v => emitted.push(v));
    (component as any).couponInput.set('');
    (component as any).onApply();
    expect(emitted.length).toBe(0);
  });

  it('does not emit apply when couponInput is whitespace only', () => {
    const emitted: string[] = [];
    component.apply.subscribe(v => emitted.push(v));
    (component as any).couponInput.set('   ');
    (component as any).onApply();
    expect(emitted.length).toBe(0);
  });

  it('emits remove when onRemove is called', () => {
    let count = 0;
    component.remove.subscribe(() => count++);
    (component as any).onRemove();
    expect(count).toBe(1);
  });
});
