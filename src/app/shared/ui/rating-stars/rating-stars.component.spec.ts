import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingStarsComponent } from './rating-stars.component';

describe('RatingStarsComponent', () => {
  let fixture: ComponentFixture<RatingStarsComponent>;
  let component: RatingStarsComponent;
  let el: HTMLElement;

  function create(inputs: Partial<RatingStarsComponent> = {}) {
    fixture   = TestBed.createComponent(RatingStarsComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function stars() {
    return el.querySelectorAll<HTMLButtonElement>('.stars__star');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RatingStarsComponent] }).compileComponents();
  });

  it('renders 5 stars by default', () => {
    create();
    expect(stars().length).toBe(5);
  });

  it('renders N stars when max=3', () => {
    create({ max: 3 });
    expect(stars().length).toBe(3);
  });

  it('no stars are filled initially', () => {
    create();
    expect(el.querySelectorAll('.stars__star--filled').length).toBe(0);
  });

  it('writeValue fills the corresponding number of stars', () => {
    create();
    component.writeValue(3);
    fixture.detectChanges();
    expect(el.querySelectorAll('.stars__star--filled').length).toBe(3);
  });

  it('clicking a star sets rating and emits ratingChange', () => {
    create();
    const spy = jasmine.createSpy('ratingChange');
    component.ratingChange.subscribe(spy);
    stars()[2].click();
    expect(component['rating']()).toBe(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('clicking the same star twice resets rating to 0', () => {
    create();
    component.writeValue(3);
    fixture.detectChanges();
    stars()[2].click();
    expect(component['rating']()).toBe(0);
  });

  it('calls onChange on click', () => {
    create();
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    stars()[1].click();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('readonly mode — buttons are disabled', () => {
    create({ readonly: true });
    const allDisabled = Array.from(stars()).every(s => s.disabled);
    expect(allDisabled).toBeTrue();
  });

  it('readonly mode — clicking does not change rating', () => {
    create({ readonly: true });
    stars()[0].click();
    expect(component['rating']()).toBe(0);
  });

  it('hover sets displayRating', () => {
    create();
    stars()[3].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(component['hovered']()).toBe(4);
    expect(component['displayRating']()).toBe(4);
  });

  it('mouseleave resets hovered to 0', () => {
    create();
    stars()[3].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    stars()[3].dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(component['hovered']()).toBe(0);
  });

  it('setDisabledState prevents rating change', () => {
    create();
    component.setDisabledState(true);
    fixture.detectChanges();
    stars()[2].click();
    expect(component['rating']()).toBe(0);
  });
});
