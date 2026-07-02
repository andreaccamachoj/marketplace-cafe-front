import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (variant) {
      @case ('card') {
        <div class="skeleton skeleton--card" aria-hidden="true">
          <div class="skeleton__img"></div>
          <div class="skeleton__body">
            <div class="skeleton__line skeleton__line--title"></div>
            <div class="skeleton__line skeleton__line--full"></div>
            <div class="skeleton__line skeleton__line--short"></div>
          </div>
        </div>
      }
      @case ('circle') {
        <div
          class="skeleton skeleton--circle"
          [ngStyle]="{ width: size, height: size }"
          aria-hidden="true"
        ></div>
      }
      @default {
        <div
          class="skeleton"
          [ngClass]="'skeleton--' + variant"
          [ngStyle]="{ width: width, height: height }"
          aria-hidden="true"
        ></div>
      }
    }
  `,
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() width = '100%';
  @Input() height = '1em';
  /** Used for circle variant */
  @Input() size = '40px';
}
