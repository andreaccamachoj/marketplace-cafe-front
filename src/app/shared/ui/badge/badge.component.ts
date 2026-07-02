import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeColor = 'primary' | 'green' | 'amber' | 'blue' | 'purple' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge--' + color"><ng-content /></span>`,
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input() color: BadgeColor = 'primary';
}
