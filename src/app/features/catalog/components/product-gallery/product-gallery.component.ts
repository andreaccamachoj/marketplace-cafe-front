import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gallery">
      @if (images && images.length > 0) {
        <div class="gallery__main">
          <img
            [src]="images[0]"
            [alt]="productName"
            loading="lazy"
            class="gallery__image"
          />
        </div>
        @if (images.length > 1) {
          <div class="gallery__thumbnails">
            @for (image of images; track image; let i = $index) {
              <button
                class="gallery__thumb"
                [class.gallery__thumb--active]="i === 0"
                (click)="onSelectImage(i)"
                [attr.aria-label]="'Ver imagen ' + (i + 1) + ' de ' + images.length"
              >
                <img [src]="image" [alt]="productName" />
              </button>
            }
          </div>
        }
      } @else {
        <div class="gallery__placeholder">
          <p>No hay imágenes disponibles</p>
        </div>
      }
    </div>
  `,
  styleUrl: './product-gallery.component.scss',
})
export class ProductGalleryComponent {
  @Input() images: string[] = [];
  @Input() productName = '';

  protected selectedImageIndex = 0;

  protected onSelectImage(index: number): void {
    this.selectedImageIndex = index;
  }
}
