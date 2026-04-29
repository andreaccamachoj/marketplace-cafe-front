import { Injectable, computed, inject, signal } from '@angular/core';
import { IProducerProfile, IProducerProfilePayload } from '../models/producer-profile.model';
import { AuthService } from '@core/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ProducerProfileService {
  private readonly auth = inject(AuthService);

  private readonly _profile = signal<IProducerProfile>({
    id: 'p1',
    fullName: 'Carlos Productor',
    email: 'producer@wcm.co',
    phone: '3004445566',
    city: 'Acevedo',
    department: 'Huila',
    bio: 'Productor de café de especialidad con 15 años de experiencia cultivando en las montañas del Huila a más de 1.800 msnm.',
    avatarInitials: 'CP',
  });

  readonly profile = computed(() => this._profile());

  update(payload: IProducerProfilePayload): void {
    const initials = payload.fullName
      .split(' ')
      .map(n => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);

    this._profile.update(p => ({ ...p, ...payload, avatarInitials: initials }));

    // Sync name & phone back to auth session so the navbar stays updated.
    this.auth.updateProfile({ fullName: payload.fullName, phone: payload.phone });
  }
}
