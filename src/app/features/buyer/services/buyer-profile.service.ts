import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IBuyerProfile, IBuyerProfilePayload } from '../models/buyer-profile.model';

const EMPTY_PROFILE: IBuyerProfile = {
  id: '', fullName: '', email: '', phone: '',
  city: '', department: '', preferredPayment: 'card',
  newsletterOptIn: false, avatarInitials: '',
};

@Injectable({ providedIn: 'root' })
export class BuyerProfileService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _profile = signal<IBuyerProfile>(EMPTY_PROFILE);

  readonly profile = computed(() => this._profile());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<IBuyerProfile>('/profile/buyer').subscribe(p => this._profile.set(p));
  }

  update(payload: IBuyerProfilePayload): Observable<IBuyerProfile> {
    const avatarInitials = payload.fullName
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return this.http.patch<IBuyerProfile>('/profile/buyer', { ...payload, avatarInitials }).pipe(
      map(p => { this._profile.set(p); return p; }),
    );
  }
}
