import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProducerReview, IProducerReplyPayload } from '../../models/producer-review.model';

@Component({
  selector: 'app-producer-review-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="review-card" [attr.aria-label]="'Reseña de ' + review().buyerName">

      <!-- Header -->
      <div class="rc-header">
        <div class="rc-avatar" aria-hidden="true">{{ review().buyerInitials }}</div>
        <div class="rc-meta">
          <div class="rc-buyer">{{ review().buyerName }}</div>
          <div class="rc-date">{{ formatDate(review().date) }}</div>
        </div>
        <div class="rc-stars" [attr.aria-label]="review().rating + ' de 5 estrellas'" aria-hidden="true">
          @for (s of STARS; track s) {
            <span [style.color]="s <= review().rating ? 'var(--amber,#c07820)' : 'rgba(55,38,23,.15)'">★</span>
          }
        </div>
        @if (review().isVerifiedPurchase) {
          <span class="rc-verified" aria-label="Compra verificada">✓ Verificado</span>
        }
      </div>

      <!-- Comment -->
      <p class="rc-comment">{{ review().comment }}</p>

      <!-- Helpful count -->
      <div class="rc-helpful">
        <span class="rc-helpful-text">
          👍 {{ review().helpfulCount }} personas encontraron útil esta reseña
        </span>
      </div>

      <!-- Producer reply (existing) -->
      @if (review().producerReply) {
        <div class="rc-reply" role="region" aria-label="Respuesta del productor">
          <div class="rc-reply-header">
            <span class="rc-reply-label">🌿 Tu respuesta</span>
            <span class="rc-reply-date">{{ formatDate(review().producerReplyDate!) }}</span>
          </div>
          <p class="rc-reply-text">{{ review().producerReply }}</p>
          <button
            type="button"
            class="btn-reply-edit"
            (click)="openReplyForm()"
            aria-label="Editar respuesta"
          >Editar respuesta</button>
        </div>
      }

      <!-- Reply form toggle / inline form -->
      @if (!review().producerReply && !replyOpen()) {
        <button
          type="button"
          class="btn-reply"
          (click)="openReplyForm()"
          aria-label="Responder a esta reseña"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Responder
        </button>
      }

      @if (replyOpen()) {
        <div class="rc-reply-form" role="region" aria-label="Formulario de respuesta">
          <label class="rc-reply-form-label" [for]="'reply-' + review().id">
            {{ review().producerReply ? 'Editar respuesta' : 'Escribir respuesta' }}
          </label>
          <textarea
            [id]="'reply-' + review().id"
            class="rc-reply-textarea"
            [formControl]="replyControl"
            rows="3"
            placeholder="Agradece la reseña o aclara algún punto..."
            maxlength="600"
          ></textarea>
          <div class="rc-reply-actions">
            <button
              type="button"
              class="btn-reply-cancel"
              (click)="cancelReply()"
            >Cancelar</button>
            <button
              type="button"
              class="btn-reply-submit"
              [disabled]="replyControl.invalid"
              (click)="submitReply()"
            >Publicar respuesta</button>
          </div>
        </div>
      }

    </article>
  `,
  styleUrl: './producer-review-card.component.scss',
})
export class ProducerReviewCardComponent {
  readonly review  = input.required<IProducerReview>();
  readonly replied = output<IProducerReplyPayload>();

  protected readonly replyOpen    = signal(false);
  protected readonly replyControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(10), Validators.maxLength(600)],
  });

  protected readonly STARS = [1, 2, 3, 4, 5] as const;

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  protected openReplyForm(): void {
    this.replyControl.setValue(this.review().producerReply ?? '');
    this.replyOpen.set(true);
  }

  protected cancelReply(): void {
    this.replyOpen.set(false);
    this.replyControl.reset();
  }

  protected submitReply(): void {
    if (this.replyControl.invalid) return;
    this.replied.emit({ reviewId: this.review().id, text: this.replyControl.value });
    this.replyOpen.set(false);
    this.replyControl.reset();
  }
}
