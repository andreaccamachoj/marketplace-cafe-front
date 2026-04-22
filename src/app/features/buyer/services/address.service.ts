import { Injectable, computed, signal } from '@angular/core';
import { IAddress } from '../models/checkout.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly _addresses = signal<IAddress[]>([
    {
      id: 'a1',
      label: 'Casa',
      line1: 'Cra. 15 #93-75, Apt 502',
      city: 'Bogotá D.C., Colombia',
      isDefault: true,
    },
    {
      id: 'a2',
      label: 'Oficina',
      line1: 'Calle 72 #10-45, Piso 3',
      city: 'Bogotá D.C., Colombia',
      isDefault: false,
    },
  ]);

  readonly addresses = this._addresses.asReadonly();
  readonly defaultAddress = computed(() => this._addresses().find(a => a.isDefault) ?? null);

  setDefault(id: string): void {
    this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id })));
  }
}
