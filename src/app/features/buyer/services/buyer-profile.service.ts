import { Injectable, computed, signal } from '@angular/core';
import { IBuyerProfile, IBuyerProfilePayload } from '../models/buyer-profile.model';

@Injectable({ providedIn: 'root' })
export class BuyerProfileService {
  private readonly _profile = signal<IBuyerProfile>({
    id: 'u-buyer-1',
    fullName: 'Comprador Demo',
    email: 'buyer@wcm.co',
    phone: '310-555-0100',
    city: 'Bogotá',
    department: 'Cundinamarca',
    preferredPayment: 'card',
    newsletterOptIn: true,
    avatarInitials: 'CD',
  });

  readonly profile = computed(() => this._profile());

  update(payload: IBuyerProfilePayload): void {
    this._profile.update(p => ({
      ...p,
      ...payload,
      avatarInitials: payload.fullName
        .split(' ')
        .map(n => n[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, 2),
    }));
  }
}
