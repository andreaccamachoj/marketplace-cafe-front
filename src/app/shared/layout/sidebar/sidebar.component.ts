import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface ISidebarItem {
  label: string;
  icon: string;
  route: string;
  badge?: number | string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar" role="navigation" aria-label="Navegación lateral">
      <nav class="sidebar__nav">
        @for (item of items; track item.route) {
          <a
            class="sidebar__link"
            routerLink="{{ item.route }}"
            routerLinkActive="sidebar__link--active"
            [routerLinkActiveOptions]="{ exact: false }"
            [attr.aria-label]="item.label"
          >
            <span class="sidebar__icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="sidebar__label">{{ item.label }}</span>
            @if (item.badge) {
              <span class="sidebar__badge" [attr.aria-label]="'(' + item.badge + ')'">
                {{ item.badge }}
              </span>
            }
          </a>
        }
      </nav>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() items: ISidebarItem[] = [];
}
