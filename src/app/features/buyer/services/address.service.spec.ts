import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AddressService } from './address.service';
import { IAddress } from '../models/checkout.model';

const addr1: IAddress = { id: 'a1', label: 'Casa', line1: 'Calle 1 #2-3', city: 'Bogotá', department: 'Cundinamarca', isDefault: true };
const addr2: IAddress = { id: 'a2', label: 'Oficina', line1: 'Cra 5 #10-20', city: 'Medellín', department: 'Antioquia', isDefault: false };

describe('AddressService', () => {
  let service: AddressService;
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
    service = TestBed.inject(AddressService);
    http.expectOne('/addresses').flush([addr1, addr2]);
  });

  afterEach(() => http.verify());

  it('loads addresses on init', () => {
    expect(service.addresses().length).toBe(2);
    expect(service.count()).toBe(2);
  });

  it('defaultAddress() returns address with isDefault=true', () => {
    expect(service.defaultAddress()?.id).toBe('a1');
  });

  it('setDefault() patches and updates isDefault flags', () => {
    service.setDefault('a2');
    const req = http.expectOne('/addresses/a2/default');
    expect(req.request.method).toBe('PATCH');
    req.flush(null);
    expect(service.addresses().find(a => a.id === 'a2')?.isDefault).toBeTrue();
    expect(service.addresses().find(a => a.id === 'a1')?.isDefault).toBeFalse();
  });

  it('add() posts and appends address', () => {
    const payload = { label: 'Casa', line1: 'Nueva 1', city: 'Cali', department: 'Valle' };
    service.add(payload);
    const req = http.expectOne('/addresses');
    expect(req.request.method).toBe('POST');
    const newAddr: IAddress = { id: 'a3', ...payload, isDefault: false };
    req.flush(newAddr);
    expect(service.addresses().length).toBe(3);
    expect(service.addresses()[2].id).toBe('a3');
  });

  it('update() puts and updates address', () => {
    const payload = { label: 'Casa', line1: 'Actualizada', city: 'Bogotá', department: 'Cundinamarca' };
    service.update('a1', payload);
    const req = http.expectOne('/addresses/a1');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 'a1', ...payload, isDefault: true });
    expect(service.addresses()[0].line1).toBe('Actualizada');
  });

  it('remove() deletes and removes address from list', () => {
    service.remove('a2');
    const req = http.expectOne('/addresses/a2');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(service.addresses().length).toBe(1);
    expect(service.addresses().find(a => a.id === 'a2')).toBeUndefined();
  });

  it('remove() sets first remaining address as default when default is removed', () => {
    service.remove('a1');
    const req = http.expectOne('/addresses/a1');
    req.flush(null);
    expect(service.addresses()[0].isDefault).toBeTrue();
  });
});
