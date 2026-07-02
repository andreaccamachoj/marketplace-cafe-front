import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface IBreadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header" id="main-content">
      <div class="page-header__content">
        <div>
          <h1 class="page-header__title">{{ title }}</h1>
          @if (subtitle) {
            <p class="page-header__subtitle">{{ subtitle }}</p>
          }
        </div>
        @if (breadcrumbs && breadcrumbs.length > 0) {
          <nav class="page-header__breadcrumbs" aria-label="Migas de pan">
            @for (crumb of breadcrumbs; track crumb.label; let last = $last) {
              @if (!last) {
                <a [href]="crumb.route" class="page-header__crumb">{{ crumb.label }}</a>
                <span class="page-header__crumb-sep" aria-hidden="true">/</span>
              } @else {
                <span class="page-header__crumb page-header__crumb--active" aria-current="page">
                  {{ crumb.label }}
                </span>
              }
            }
          </nav>
        }
      </div>

      <ng-content />
    </header>
  `,
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() breadcrumbs: IBreadcrumb[] = [];
}
