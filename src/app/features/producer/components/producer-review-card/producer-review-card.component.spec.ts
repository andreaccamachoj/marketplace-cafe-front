import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducerReviewCardComponent } from './producer-review-card.component';
import { IProducerReview } from '../../models/producer-review.model';

const MOCK_REVIEW: IProducerReview = {
  id: 'rev-1', productId: 'p-1', productName: 'Café Sierra', productEmoji: '☕',
  buyerName: 'Ana García', buyerInitials: 'AG',
  rating: 4, comment: 'Excelente café.', date: '2025-01-10',
  isVerifiedPurchase: true, helpfulCount: 3,
};

describe('ProducerReviewCardComponent', () => {
  let fixture: ComponentFixture<ProducerReviewCardComponent>;
  let component: ProducerReviewCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerReviewCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProducerReviewCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('review', MOCK_REVIEW);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('replyOpen starts as false', () => {
    expect(component['replyOpen']()).toBe(false);
  });

  it('openReplyForm sets replyOpen to true', () => {
    component['openReplyForm']();
    expect(component['replyOpen']()).toBe(true);
  });

  it('openReplyForm prefills replyControl with existing reply', () => {
    fixture.componentRef.setInput('review', { ...MOCK_REVIEW, producerReply: 'Gracias!' });
    fixture.detectChanges();
    component['openReplyForm']();
    expect(component['replyControl'].value).toBe('Gracias!');
  });

  it('cancelReply sets replyOpen to false and resets control', () => {
    component['openReplyForm']();
    component['replyControl'].setValue('Algo');
    component['cancelReply']();
    expect(component['replyOpen']()).toBe(false);
    expect(component['replyControl'].value).toBe('');
  });

  it('submitReply does nothing when control is invalid (too short)', () => {
    component['openReplyForm']();
    component['replyControl'].setValue('corto');
    let emitted = false;
    component.replied.subscribe(() => (emitted = true));
    component['submitReply']();
    expect(emitted).toBe(false);
    expect(component['replyOpen']()).toBe(true);
  });

  it('submitReply emits replied event and closes form when valid', () => {
    component['openReplyForm']();
    const text = 'Gracias por tu reseña, fue un placer!';
    component['replyControl'].setValue(text);
    let payload: { reviewId: string; text: string } | undefined;
    component.replied.subscribe(p => (payload = p));
    component['submitReply']();
    expect(payload).toEqual({ reviewId: 'rev-1', text });
    expect(component['replyOpen']()).toBe(false);
    expect(component['replyControl'].value).toBe('');
  });

  it('formatDate returns a localized date string', () => {
    const result = component['formatDate']('2025-01-10');
    expect(result).toContain('2025');
  });
});
