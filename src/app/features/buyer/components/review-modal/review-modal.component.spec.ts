import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewModalComponent } from './review-modal.component';

describe('ReviewModalComponent', () => {
  let fixture: ComponentFixture<ReviewModalComponent>;
  let component: ReviewModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits closed when onOverlayClick is called', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    (component as any).onOverlayClick(new MouseEvent('click'));
    expect(count).toBe(1);
  });

  it('does not emit submitted when rating is 0', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe(v => emitted.push(v));
    (component as any).onSubmit();
    expect(emitted.length).toBe(0);
  });

  it('emits submitted with rating and comment when rating > 0', () => {
    const emitted: { rating: number; comment: string }[] = [];
    component.submitted.subscribe(v => emitted.push(v));
    (component as any).rating.set(4);
    (component as any).comment.set('Gran café');
    (component as any).onSubmit();
    expect(emitted).toEqual([{ rating: 4, comment: 'Gran café' }]);
  });

  it('resets state after successful submit', () => {
    (component as any).rating.set(5);
    (component as any).comment.set('Excelente');
    (component as any).onSubmit();
    expect((component as any).rating()).toBe(0);
    expect((component as any).comment()).toBe('');
    expect((component as any).hoverRating()).toBe(0);
  });

  it('onInput updates comment signal', () => {
    const mockEvent = { target: { value: 'Buen sabor' } } as unknown as Event;
    (component as any).onInput(mockEvent);
    expect((component as any).comment()).toBe('Buen sabor');
  });

  it('displayRating returns hoverRating when set, else rating', () => {
    (component as any).rating.set(3);
    (component as any).hoverRating.set(5);
    expect((component as any).displayRating()).toBe(5);
    (component as any).hoverRating.set(0);
    expect((component as any).displayRating()).toBe(3);
  });

  it('productName input defaults to empty string', () => {
    expect(component.productName()).toBe('');
  });
});
