import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordStrengthMeterComponent } from './password-strength-meter.component';

describe('PasswordStrengthMeterComponent', () => {
  let fixture: ComponentFixture<PasswordStrengthMeterComponent>;
  let component: PasswordStrengthMeterComponent;
  let el: HTMLElement;

  function create(password = '') {
    fixture   = TestBed.createComponent(PasswordStrengthMeterComponent);
    component = fixture.componentInstance;
    component.password = password;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PasswordStrengthMeterComponent] }).compileComponents();
  });

  it('renders 4 bars', () => {
    create();
    expect(el.querySelectorAll('.psm__bar').length).toBe(4);
  });

  it('renders password requirement checklist', () => {
    create();
    expect(el.querySelector('.psm__checks')).toBeTruthy();
    expect(el.querySelectorAll('.psm__checks li').length).toBe(4);
  });

  it('empty password shows "Muy débil" label', () => {
    create('');
    expect(el.querySelector('.psm__label')!.textContent?.trim()).toBe('Muy débil');
  });

  it('weak password — bars use weak class', () => {
    create('abc');
    const bars = el.querySelectorAll('.psm__bar');
    expect(bars[0].classList).toContain('psm__bar--weak');
  });

  it('strong password has score 4', () => {
    create('Secure#2025');
    expect(component['strength']().score).toBe(4);
  });

  it('strong password shows "Muy fuerte" label', () => {
    create('Secure#2025');
    expect(el.querySelector('.psm__label')!.textContent?.trim()).toBe('Muy fuerte');
  });

  it('strong password — bars use strong class', () => {
    create('Secure#2025');
    const bars = el.querySelectorAll('.psm__bar');
    expect(bars[0].classList).toContain('psm__bar--strong');
  });

  it('hasMinLength requirement ticked when password ≥ 8 chars', () => {
    create('abcdefgh');
    expect(component['strength']().hasMinLength).toBeTrue();
  });

  it('hasUpperCase requirement ticked when password has uppercase', () => {
    create('Abcdefgh');
    expect(component['strength']().hasUpperCase).toBeTrue();
  });

  it('hasNumber requirement ticked when password has digit', () => {
    create('abcdefg1');
    expect(component['strength']().hasNumber).toBeTrue();
  });

  it('hasSpecial requirement ticked when password has special char', () => {
    create('abcdef#1');
    expect(component['strength']().hasSpecial).toBeTrue();
  });

  it('active bars count matches score', () => {
    create('Secure#2025');
    const activeBars = el.querySelectorAll('.psm__bar--active');
    expect(activeBars.length).toBe(component['strength']().score);
  });

  it('score=2 (fair) — barClass returns "fair"', () => {
    // minLength + uppercase only → score 2
    create('Abcdefgh');
    expect(component['barClass']()).toBe('fair');
  });

  it('score=3 (good) — barClass returns "good"', () => {
    // minLength + uppercase + number → score 3
    create('Abcdefg1');
    expect(component['barClass']()).toBe('good');
  });

  it('score=4 (strong) — barClass returns "strong"', () => {
    create('Secure#2025');
    expect(component['barClass']()).toBe('strong');
  });
});
