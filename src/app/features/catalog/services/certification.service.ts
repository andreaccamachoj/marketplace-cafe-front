import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface ICertification {
  id: number;
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CertificationService {
  private readonly http       = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _certifications = signal<ICertification[]>([]);

  readonly certifications = this._certifications.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<ICertification[]>('/catalog/certifications').subscribe({
      next: list => this._certifications.set(list),
    });
  }
}
