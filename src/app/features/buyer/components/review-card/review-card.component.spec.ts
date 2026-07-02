import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewCardComponent } from './review-card.component';
import { IReview } from '../../models/review.model';

const MOCK_REVIEW: IReview = {
  id: 'rev-1',
  productId: 'prod-1',
  productName: 'Café Sierra Nevada',
  productImageUrl: 'https://example.com/img.jpg',
  orderId: 'ord-1',
  buyerId: 'buyer-1',
  buyerName: 'Ana García',
  buyerInitials: 'AG',
  rating: 4,
  title: 'Excelente café',
  body: 'Muy buen sabor y aroma, lo recomiendo ampliamente.',
  status: 'published',
  isVerifiedPurchase: true,
  helpfulCount: 3,
  createdAt: '2025-01-10T10:00:00Z',
};

describe('ReviewCardComponent', () => {
  let fixture: ComponentFixture<ReviewCardComponent>;
  let component: ReviewCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ReviewCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('review', MOCK_REVIEW);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits edit with review when onEdit is called', () => {
    const emitted: IReview[] = [];
    component.edit.subscribe(v => emitted.push(v));
    (component as any).onEdit();
    expect(emitted).toEqual([MOCK_REVIEW]);
  });

  it('sets confirmingDelete to true when onDeleteRequest is called', () => {
    (component as any).onDeleteRequest();
    expect((component as any).confirmingDelete()).toBeTrue();
  });

  it('emits delete and resets confirmingDelete when onDeleteConfirm is called', () => {
    const emitted: string[] = [];
    component.delete.subscribe(v => emitted.push(v));
    (component as any).onDeleteRequest();
    (component as any).onDeleteConfirm();
    expect(emitted).toEqual(['rev-1']);
    expect((component as any).confirmingDelete()).toBeFalse();
  });

  it('resets confirmingDelete when onDeleteCancel is called', () => {
    (component as any).onDeleteRequest();
    (component as any).onDeleteCancel();
    expect((component as any).confirmingDelete()).toBeFalse();
  });

  it('formatDate returns a localized date string', () => {
    const result = (component as any).formatDate('2025-01-10T10:00:00Z');
    expect(result).toContain('2025');
  });

  it('isOwner defaults to false', () => {
    expect(component.isOwner()).toBeFalse();
  });
});
