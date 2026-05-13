import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface IPaymentMethodLine { label: string; value: string; }

export interface IPaymentMethod {
  id:          string;
  code:        string;
  name:        string;
  emoji:       string;
  accentColor: string;
  lines:       IPaymentMethodLine[];
}

interface BackendPaymentMethod {
  id:            string;
  code:          string;
  name:          string;
  type:          string;
  accountNumber: string | null;
  accountHolder: string | null;
  bank:          string | null;
  alias:         string | null;
  nit:           string | null;
  emoji:         string | null;
  accentColor:   string | null;
  isActive:      boolean;
  displayOrder:  number;
}

function buildLines(b: BackendPaymentMethod): IPaymentMethodLine[] {
  const lines: IPaymentMethodLine[] = [];
  switch (b.type) {
    case 'digital_wallet':
      if (b.accountNumber) lines.push({ label: 'Número',   value: b.accountNumber });
      if (b.accountHolder) lines.push({ label: 'Titular',  value: b.accountHolder });
      break;
    case 'bank_transfer':
      if (b.accountNumber) lines.push({ label: 'Cuenta de ahorros', value: b.accountNumber });
      if (b.nit)           lines.push({ label: 'NIT',                value: b.nit });
      if (b.accountHolder) lines.push({ label: 'Titular',            value: b.accountHolder });
      break;
    case 'bre_b':
      if (b.alias) lines.push({ label: 'Alias',   value: b.alias });
      lines.push({ label: 'Banco',   value: b.bank ? `${b.bank} · BRE-B` : 'BRE-B' });
      if (b.accountHolder) lines.push({ label: 'Titular', value: b.accountHolder });
      break;
    default:
      if (b.accountNumber) lines.push({ label: 'Número',  value: b.accountNumber });
      if (b.accountHolder) lines.push({ label: 'Titular', value: b.accountHolder });
  }
  return lines;
}

function mapMethod(b: BackendPaymentMethod): IPaymentMethod {
  return {
    id:          b.id,
    code:        b.code,
    name:        b.name,
    emoji:       b.emoji       ?? '💳',
    accentColor: b.accentColor ?? '#555',
    lines:       buildLines(b),
  };
}

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private readonly http       = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _methods   = signal<IPaymentMethod[]>([]);

  readonly paymentMethods = this._methods.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<BackendPaymentMethod[]>('/payment-methods').subscribe({
      next: list => this._methods.set(list.map(mapMethod)),
    });
  }
}
