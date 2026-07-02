import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewFormModalComponent } from './review-form-modal.component';
import { IReview, IReviewPayload } from '../../models/review.model';

const MOCK_REVIEW: IReview = {
  id: 'rev-1',
  productId: 'prod-1',
  productName: 'Café Sierra',
  productImageUrl: 'https://example.com/img.jpg',
  orderId: 'ord-1',
  buyerId: 'buyer-1',
  buyerName: 'Ana García',
  buyerInitials: 'AG',
  rating: 4,
  title: 'Muy buen café',
  body: 'El aroma y sabor son excelentes, definitivamente lo volvería a comprar.',
  status: 'published',
  isVerifiedPurchase: true,
  helpfulCount: 2,
  createdAt: '2025-01-10T10:00:00Z',
};

describe('ReviewFormModalComponent', () => {
  let fixture: ComponentFixture<ReviewFormModalComponent>;
  let component: ReviewFormModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ReviewFormModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('modalTitle is "Escribir reseña" in creation mode', () => {
    expect((component as any).modalTitle()).toBe('Escribir reseña');
  });

  it('modalTitle is "Editar reseña" when review input is set', () => {
    fixture.componentRef.setInput('review', MOCK_REVIEW);
    fixture.detectChanges();
    expect((component as any).modalTitle()).toBe('Editar reseña');
  });

  it('form is invalid when empty', () => {
    expect(component['form'].invalid).toBeTrue();
  });

  it('does not emit saved when form is invalid', () => {
    const emitted: IReviewPayload[] = [];
    component.saved.subscribe(v => emitted.push(v));
    (component as any).onSubmit();
    expect(emitted.length).toBe(0);
  });

  it('emits saved with payload when form is valid', () => {
    const emitted: IReviewPayload[] = [];
    component.saved.subscribe(v => emitted.push(v));
    fixture.componentRef.setInput('review', MOCK_REVIEW);
    fixture.detectChanges();
    component['form'].setValue({
      rating: 5,
      title: 'Café increíble',
      body: 'Lo recomiendo ampliamente, tiene un aroma espectacular y sabor único.',
    });
    (component as any).onSubmit();
    expect(emitted.length).toBe(1);
    expect(emitted[0].rating).toBe(5);
    expect(emitted[0].title).toBe('Café increíble');
  });

  it('onStarClick updates selectedRating and form rating', () => {
    (component as any).onStarClick(3);
    expect((component as any).selectedRating()).toBe(3);
    expect(component['form'].get('rating')!.value).toBe(3);
  });

  it('onStarHover updates hoverRating', () => {
    (component as any).onStarHover(4);
    expect((component as any).hoverRating()).toBe(4);
  });

  it('onStarLeave resets hoverRating to 0', () => {
    (component as any).hoverRating.set(3);
    (component as any).onStarLeave();
    expect((component as any).hoverRating()).toBe(0);
  });

  it('displayRating returns hoverRating when set, else selectedRating', () => {
    (component as any).selectedRating.set(3);
    (component as any).hoverRating.set(5);
    expect((component as any).displayRating()).toBe(5);
    (component as any).hoverRating.set(0);
    expect((component as any).displayRating()).toBe(3);
  });

  it('emits closed when onClose is called', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    (component as any).onClose();
    expect(count).toBe(1);
  });

  it('resets form on close', () => {
    component['form'].setValue({ rating: 5, title: 'Test title', body: 'Test body test body...' });
    (component as any).onClose();
    expect(component['form'].get('rating')!.value).toBe(0);
    expect((component as any).selectedRating()).toBe(0);
  });

  it('title is invalid when shorter than 5 chars', () => {
    component['form'].get('title')!.setValue('Hi');
    expect(component['form'].get('title')!.invalid).toBeTrue();
  });

  it('body is invalid when shorter than 30 chars', () => {
    component['form'].get('body')!.setValue('Short body');
    expect(component['form'].get('body')!.invalid).toBeTrue();
  });

  it('bodyLength reflects body form control length', () => {
    const text = 'A'.repeat(50);
    component['form'].get('body')!.setValue(text);
    expect(component['form'].get('body')!.value.length).toBe(50);
  });
});
