import { Injectable, signal } from '@angular/core';

export interface IPersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
}

@Injectable()
export class RegisterFlowState {
  readonly step = signal<1 | 2>(1);
  readonly selectedRole = signal<'buyer' | 'producer'>('buyer');
  readonly personalData = signal<Partial<IPersonalData>>({});

  next(): void { this.step.set(2); }
  prev(): void { this.step.set(1); }
  selectRole(role: 'buyer' | 'producer'): void { this.selectedRole.set(role); }
  savePersonalData(data: IPersonalData): void { this.personalData.set(data); }
  reset(): void {
    this.step.set(1);
    this.selectedRole.set('buyer');
    this.personalData.set({});
  }
}
