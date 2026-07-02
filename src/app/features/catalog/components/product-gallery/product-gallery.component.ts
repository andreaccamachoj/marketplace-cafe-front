import {
  Component, Input, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { Certification } from '../../models/product.model';
import { CertificationLabelPipe } from '@shared/pipes/certification-label.pipe';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CertificationLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gallery">
      <!-- Cert badges overlay -->
      @if (certifications.length) {
        <div class="gallery__badges">
          @for (cert of certifications; track cert) {
            <span class="cert-badge cert-badge--{{ cert.toLowerCase() }}">
              {{ cert | certificationLabel }}
            </span>
          }
        </div>
      }

      <!-- Wishlist button -->
      <button
        class="gallery__wishlist"
        [class.gallery__wishlist--active]="wishlisted()"
        (click)="toggleWishlist()"
        [attr.aria-label]="wishlisted() ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        type="button"
      >
        @if (wishlisted()) {
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        } @else {
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        }
      </button>

      <!-- Main image / emoji display -->
      <div class="gallery__main">
        @if (images.length > 0) {
          <img
            class="gallery__img"
            [src]="images[activeIndex()]"
            [alt]="productName + ' - imagen ' + (activeIndex() + 1)"
            loading="eager"
          />
        } @else {
          <div class="gallery__emoji-wrap">
            <span class="gallery__emoji" aria-hidden="true">{{ emoji || '☕' }}</span>
          </div>
        }
      </div>

      <!-- Thumbnails -->
      @if (images.length > 1) {
        <div class="gallery__thumbs" role="listbox" [attr.aria-label]="'Imágenes de ' + productName">
          @for (img of images; track img; let i = $index) {
            <button
              class="gallery__thumb"
              [class.gallery__thumb--active]="i === activeIndex()"
              type="button"
              role="option"
              [attr.aria-selected]="i === activeIndex()"
              [attr.aria-label]="'Ver imagen ' + (i + 1)"
              (click)="select(i)"
            >
              <img [src]="img" [alt]="productName + ' miniatura ' + (i + 1)" />
            </button>
          }
        </div>
      } @else if (!images.length) {
        <!-- dot indicators when using emoji -->
        <div class="gallery__dots" aria-hidden="true">
          <span class="gallery__dot gallery__dot--active"></span>
          <span class="gallery__dot"></span>
          <span class="gallery__dot"></span>
        </div>
      }
    </div>
  `,
  styleUrl: './product-gallery.component.scss',
})
export class ProductGalleryComponent {
  @Input() images: string[] = [];
  @Input() productName = '';
  @Input() emoji = '';
  @Input() certifications: Certification[] = [];

  protected readonly activeIndex = signal(0);
  protected readonly wishlisted = signal(false);

  protected select(i: number): void {
    this.activeIndex.set(i);
  }

  protected toggleWishlist(): void {
    this.wishlisted.update(v => !v);
  }
}
