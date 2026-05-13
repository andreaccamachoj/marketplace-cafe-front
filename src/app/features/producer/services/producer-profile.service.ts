import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProducerProfile, IProducerProfilePayload } from '../models/producer-profile.model';
import { AuthService } from '@core/auth/services/auth.service';
import { ProducerStatus } from '@core/auth/models/producer-status.enum';

const EMPTY_PROFILE: IProducerProfile = {
  id: '', fullName: '', email: '', phone: '',
  city: '', department: '', bio: '', avatarInitials: '',
};

@Injectable({ providedIn: 'root' })
export class ProducerProfileService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);
  private readonly _profile = signal<IProducerProfile>(EMPTY_PROFILE);

  readonly profile = computed(() => this._profile());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<IProducerProfile>('/profile/producer').subscribe(p => {
      this._profile.set(p);
      if (p.status) {
        this.auth.updateProfile({ producerStatus: p.status as ProducerStatus });
      }
    });
  }

  update(payload: IProducerProfilePayload): Observable<IProducerProfile> {
    const avatarInitials = payload.fullName
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return this.http.patch<IProducerProfile>('/profile/producer', { ...payload, avatarInitials }).pipe(
      map(p => {
        this._profile.set(p);
        this.auth.updateProfile({ fullName: payload.fullName, phone: payload.phone });
        return p;
      }),
    );
  }
}
