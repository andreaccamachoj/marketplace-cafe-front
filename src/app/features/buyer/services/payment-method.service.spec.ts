import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { PaymentMethodService } from './payment-method.service';

const mockDigitalWallet = {
  id: 'm1', code: 'nequi', name: 'Nequi', type: 'digital_wallet',
  accountNumber: '3001234567', accountHolder: 'World Coffee',
  bank: null, alias: null, nit: null, emoji: '📱', accentColor: '#FF0066',
  isActive: true, displayOrder: 1,
};

const mockBankTransfer = {
  id: 'm2', code: 'bancolombia', name: 'Bancolombia', type: 'bank_transfer',
  accountNumber: '123456789', accountHolder: 'World Coffee', bank: null,
  alias: null, nit: '900123456-1', emoji: '🏦', accentColor: '#FED500',
  isActive: true, displayOrder: 2,
};

const mockBreB = {
  id: 'm3', code: 'breb', name: 'BRE-B', type: 'bre_b',
  accountNumber: null, accountHolder: 'World Coffee', bank: 'Bancolombia',
  alias: 'wcoffee', nit: null, emoji: '💳', accentColor: '#004990',
  isActive: true, displayOrder: 3,
};

describe('PaymentMethodService', () => {
  let service: PaymentMethodService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PaymentMethodService);
  });

  afterEach(() => http.verify());

  it('loads payment methods on init', () => {
    http.expectOne('/payment-methods').flush([mockDigitalWallet, mockBankTransfer]);
    expect(service.paymentMethods().length).toBe(2);
  });

  it('maps digital_wallet lines correctly', () => {
    http.expectOne('/payment-methods').flush([mockDigitalWallet]);
    const method = service.paymentMethods()[0];
    expect(method.lines.some(l => l.label === 'Número')).toBeTrue();
    expect(method.lines.some(l => l.label === 'Titular')).toBeTrue();
  });

  it('maps bank_transfer lines correctly', () => {
    http.expectOne('/payment-methods').flush([mockBankTransfer]);
    const method = service.paymentMethods()[0];
    expect(method.lines.some(l => l.label === 'Cuenta de ahorros')).toBeTrue();
    expect(method.lines.some(l => l.label === 'NIT')).toBeTrue();
  });

  it('maps bre_b lines correctly', () => {
    http.expectOne('/payment-methods').flush([mockBreB]);
    const method = service.paymentMethods()[0];
    expect(method.lines.some(l => l.label === 'Alias')).toBeTrue();
    expect(method.lines.some(l => l.label === 'Banco')).toBeTrue();
  });

  it('uses default emoji and color when not provided', () => {
    const noEmoji = { ...mockDigitalWallet, emoji: null, accentColor: null };
    http.expectOne('/payment-methods').flush([noEmoji]);
    const method = service.paymentMethods()[0];
    expect(method.emoji).toBe('💳');
    expect(method.accentColor).toBe('#555');
  });

  it('starts with empty methods before HTTP responds', () => {
    expect(service.paymentMethods().length).toBe(0);
    http.expectOne('/payment-methods').flush([]);
  });
});
