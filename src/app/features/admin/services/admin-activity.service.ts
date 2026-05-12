import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IActivityItem, ActivityType } from '../models/activity.model';

function mapActivity(b: Record<string, unknown>): IActivityItem {
  return {
    id: String(b['id']),
    type: String(b['action'] ?? b['type'] ?? 'user_registered') as ActivityType,
    title: String(b['title'] ?? b['action'] ?? ''),
    description: String(b['description'] ?? b['details'] ?? ''),
    timestamp: String(b['createdAt'] ?? b['timestamp'] ?? ''),
    actorName: String(b['actorName'] ?? ''),
    iconEmoji: '📋',
    severity: 'info',
  };
}

@Injectable({ providedIn: 'root' })
export class AdminActivityService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _items = signal<IActivityItem[]>([]);

  readonly all = computed(() => this._items());
  readonly recent = computed(() => this._items().slice(0, 5));

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/admin/activity').subscribe({
      next: list => this._items.set(list.map(mapActivity)),
    });
  }

  addItem(_item: Omit<IActivityItem, 'id'>): void {
    // Server-side only — no client-side addition needed
  }
}
