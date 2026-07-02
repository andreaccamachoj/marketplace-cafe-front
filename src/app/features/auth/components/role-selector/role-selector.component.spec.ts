import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleSelectorComponent } from './role-selector.component';

describe('RoleSelectorComponent', () => {
  let fixture: ComponentFixture<RoleSelectorComponent>;
  let component: RoleSelectorComponent;
  let el: HTMLElement;

  function create(selected: 'buyer' | 'producer' = 'buyer') {
    fixture   = TestBed.createComponent(RoleSelectorComponent);
    component = fixture.componentInstance;
    component.selected = selected;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function cards() {
    return el.querySelectorAll<HTMLButtonElement>('button.role-card:not([disabled])');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RoleSelectorComponent] }).compileComponents();
  });

  it('renders the role selector', () => {
    create();
    expect(el.querySelector('.role-selector')).toBeTruthy();
  });

  it('renders buyer and producer cards', () => {
    create();
    expect(cards().length).toBe(2);
  });

  it('renders disabled admin card', () => {
    create();
    const disabled = el.querySelector<HTMLButtonElement>('button[disabled]')!;
    expect(disabled).toBeTruthy();
    expect(disabled.textContent).toContain('Administrador');
  });

  it('buyer card has active class when selected="buyer"', () => {
    create('buyer');
    const buyerCard = Array.from(cards()).find(c => c.textContent?.includes('Comprador'))!;
    expect(buyerCard.classList.toString()).toContain('role-card--active');
  });

  it('producer card has active class when selected="producer"', () => {
    create('producer');
    const producerCard = Array.from(cards()).find(c => c.textContent?.includes('Productor'))!;
    expect(producerCard.classList.toString()).toContain('role-card--active');
  });

  it('active card shows check indicator', () => {
    create('buyer');
    const checks = el.querySelectorAll('.role-card__check');
    const activeCheck = Array.from(checks).find(c => c.textContent?.trim() === '✓');
    expect(activeCheck).toBeTruthy();
  });

  it('clicking buyer card emits roleSelected with "buyer"', () => {
    create('producer');
    const spy = jasmine.createSpy('roleSelected');
    component.roleSelected.subscribe(spy);
    const buyerCard = Array.from(cards()).find(c => c.textContent?.includes('Comprador'))!;
    buyerCard.click();
    expect(spy).toHaveBeenCalledWith('buyer');
  });

  it('clicking producer card emits roleSelected with "producer"', () => {
    create('buyer');
    const spy = jasmine.createSpy('roleSelected');
    component.roleSelected.subscribe(spy);
    const producerCard = Array.from(cards()).find(c => c.textContent?.includes('Productor'))!;
    producerCard.click();
    expect(spy).toHaveBeenCalledWith('producer');
  });

  it('buyer card has aria-pressed="true" when selected', () => {
    create('buyer');
    const buyerCard = Array.from(cards()).find(c => c.textContent?.includes('Comprador'))!;
    expect(buyerCard.getAttribute('aria-pressed')).toBe('true');
  });

  it('producer card has aria-pressed="false" when not selected', () => {
    create('buyer');
    const producerCard = Array.from(cards()).find(c => c.textContent?.includes('Productor'))!;
    expect(producerCard.getAttribute('aria-pressed')).toBe('false');
  });

  it('renders card descriptions', () => {
    create();
    const descs = Array.from(el.querySelectorAll('.role-card__desc')).map(d => d.textContent?.trim());
    expect(descs.some(d => d?.includes('catálogo'))).toBeTrue();
  });
});
