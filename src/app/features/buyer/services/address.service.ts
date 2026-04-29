import { Injectable, computed, signal } from '@angular/core';
import { IAddress, IAddressPayload } from '../models/checkout.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly _addresses = signal<IAddress[]>([
    {
      id: 'a1',
      label: 'Casa',
      line1: 'Cra. 15 #93-75, Apt 502',
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      zipCode: '110221',
      isDefault: true,
    },
    {
      id: 'a2',
      label: 'Oficina',
      line1: 'Calle 72 #10-45, Piso 3',
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      isDefault: false,
    },
  ]);

  readonly addresses      = this._addresses.asReadonly();
  readonly defaultAddress = computed(() => this._addresses().find(a => a.isDefault) ?? null);
  readonly count          = computed(() => this._addresses().length);

  /** Marcar una dirección como predeterminada (solo una a la vez). */
  setDefault(id: string): void {
    this._addresses.update(list => list.map(a => ({ ...a, isDefault: a.id === id })));
  }

  /** Agregar una nueva dirección. Si es la primera, se marca como default. */
  add(payload: IAddressPayload): void {
    const id = `a-${Date.now()}`;
    this._addresses.update(list => {
      const makeDefault = list.length === 0;
      return [...list, { ...payload, id, isDefault: makeDefault }];
    });
  }

  /** Actualizar una dirección existente por id. */
  update(id: string, payload: IAddressPayload): void {
    this._addresses.update(list =>
      list.map(a => (a.id === id ? { ...a, ...payload } : a)),
    );
  }

  /** Eliminar una dirección. Si era la default, promueve la siguiente. */
  remove(id: string): void {
    this._addresses.update(list => {
      const filtered = list.filter(a => a.id !== id);
      const hasDefault = filtered.some(a => a.isDefault);
      if (!hasDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  }
}
