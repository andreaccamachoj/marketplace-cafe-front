import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ProducerTableRowComponent } from './producer-table-row.component';
import { IProducerApproval } from '../../models/producer-approval.model';

const MOCK_PRODUCER: IProducerApproval = {
  id: 'apr-1', producerName: 'Carlos Ramírez', farmName: 'El Edén',
  region: 'Eje Cafetero', department: 'Quindío', submittedAt: '2025-01-10T10:00:00Z',
  status: 'pending', documents: [], hectares: 5, mainVariety: 'Caturra',
  email: 'carlos@wcm.co', phone: '3109876543',
};

describe('ProducerTableRowComponent', () => {
  let fixture: ComponentFixture<ProducerTableRowComponent>;
  let component: ProducerTableRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerTableRowComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProducerTableRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('producer', MOCK_PRODUCER);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initials extracts first letters of first two words', () => {
    expect(component.initials('Carlos Ramírez')).toBe('CR');
  });

  it('initials handles single-word name', () => {
    expect(component.initials('Carlos')).toBe('C');
  });

  it('statusLabel maps pending to Pendiente', () => {
    expect(component.statusLabel('pending')).toBe('Pendiente');
  });

  it('statusLabel maps approved to Aprobado', () => {
    expect(component.statusLabel('approved')).toBe('Aprobado');
  });

  it('statusLabel maps rejected to Rechazado', () => {
    expect(component.statusLabel('rejected')).toBe('Rechazado');
  });

  it('formatDate returns date string for valid ISO (browser platform)', () => {
    const result = component.formatDate('2025-01-10T10:00:00Z');
    expect(result).toContain('2025');
  });

  it('viewDetails emits producer object', () => {
    let emitted: IProducerApproval | undefined;
    component.viewDetails.subscribe(p => (emitted = p));
    component.viewDetails.emit(MOCK_PRODUCER);
    expect(emitted).toEqual(MOCK_PRODUCER);
  });

  it('approve emits producer id', () => {
    let emitted = '';
    component.approve.subscribe(id => (emitted = id));
    component.approve.emit('apr-1');
    expect(emitted).toBe('apr-1');
  });

  it('reject emits producer id', () => {
    let emitted = '';
    component.reject.subscribe(id => (emitted = id));
    component.reject.emit('apr-1');
    expect(emitted).toBe('apr-1');
  });
});
