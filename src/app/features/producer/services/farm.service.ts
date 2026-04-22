import { Injectable, signal } from '@angular/core';
import { IFarm } from '../models/farm.model';

const SEED_FARM: IFarm = {
  id: 'f1',
  name: 'Finca La Esperanza',
  municipality: 'Pitalito',
  department: 'Huila',
  altitude: '1.820 m.s.n.m.',
  area: '12 hectáreas',
  process: 'Lavado, Honey, Natural',
  description: 'Finca familiar de 3era generación con tradición cafetera de más de 80 años.',
  certifications: [
    {
      id: 'c1',
      icon: '🌿',
      name: 'Orgánico USDA',
      body: 'CCOF Certification Services',
      validUntil: 'Dic 2025',
      status: 'valid',
    },
    {
      id: 'c2',
      icon: '⚖️',
      name: 'Fair Trade',
      body: 'Fair Trade USA',
      validUntil: 'Mar 2026',
      status: 'valid',
    },
    {
      id: 'c3',
      icon: '🌧',
      name: 'Rainforest Alliance',
      body: 'Rainforest Alliance',
      validUntil: 'Jun 2025',
      status: 'expiring',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class FarmService {
  private readonly _farm = signal<IFarm>(SEED_FARM);

  readonly farm = this._farm.asReadonly();
}
