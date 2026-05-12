import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ICertification {
  id: number;
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CertificationService {
  private readonly http = inject(HttpClient);
  private readonly _certifications = signal<ICertification[]>([]);

  readonly certifications = this._certifications.asReadonly();

  constructor() {
    this.http.get<ICertification[]>('/catalog/certifications').subscribe({
      next: list => this._certifications.set(list),
    });
  }
}
