import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IActivityItem } from '../../models/activity.model';

@Component({
  selector: 'app-activity-feed-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="feed-item">
      <div class="feed-left">
        <div class="feed-icon" [class]="'feed-icon--' + item().severity">
          {{ item().iconEmoji }}
        </div>
        <div class="feed-connector"></div>
      </div>
      <div class="feed-body">
        <p class="feed-title">{{ item().title }}</p>
        <p class="feed-desc">{{ item().description }}</p>
        <p class="feed-time">{{ relativeTime(item().timestamp) }}</p>
      </div>
    </div>
  `,
  styleUrl: './activity-feed-item.component.scss',
})
export class ActivityFeedItemComponent {
  readonly item = input.required<IActivityItem>();

  private readonly platformId = inject(PLATFORM_ID);

  relativeTime(iso: string): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 30) return `Hace ${diffD} día${diffD > 1 ? 's' : ''}`;
    const diffM = Math.floor(diffD / 30);
    return `Hace ${diffM} mes${diffM > 1 ? 'es' : ''}`;
  }
}
