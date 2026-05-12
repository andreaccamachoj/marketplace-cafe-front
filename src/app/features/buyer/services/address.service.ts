import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IAddress, IAddressPayload } from '../models/checkout.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _addresses = signal<IAddress[]>([]);

  readonly addresses      = this._addresses.asReadonly();
  readonly defaultAddress = computed(() => this._addresses().find(a => a.isDefault) ?? null);
  readonly count          = computed(() => this._addresses().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.load();
  }

  load(): void {
    this.http.get<IAddress[]>('/addresses').subscribe(list => this._addresses.set(list));
  }

  setDefault(id: string): void {
    this.http.patch(`/addresses/${id}/default`, {}).subscribe({
      next: () => this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id }))),
    });
  }

  add(payload: IAddressPayload): void {
    this.http.post<IAddress>('/addresses', payload).subscribe({
      next: addr => this._addresses.update(list => [...list, addr]),
    });
  }

  update(id: string, payload: IAddressPayload): void {
    this.http.put<IAddress>(`/addresses/${id}`, payload).subscribe({
      next: addr => this._addresses.update(list => list.map(a => a.id === id ? addr : a)),
    });
  }

  remove(id: string): void {
    this.http.delete(`/addresses/${id}`).subscribe({
      next: () => this._addresses.update(list => {
        const filtered = list.filter(a => a.id !== id);
        const hasDefault = filtered.some(a => a.isDefault);
        if (!hasDefault && filtered.length > 0) filtered[0] = { ...filtered[0], isDefault: true };
        return filtered;
      }),
    });
  }
}
