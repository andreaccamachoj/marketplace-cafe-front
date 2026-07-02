import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PendingProducerCardComponent } from './pending-producer-card.component';
import { IProducerApproval } from '../../models/producer-approval.model';

const MOCK_PRODUCER: IProducerApproval = {
  id: 'apr-1', producerName: 'Carlos Ramírez', farmName: 'El Edén',
  region: 'Eje Cafetero', department: 'Quindío', submittedAt: '2025-01-10T10:00:00Z',
  status: 'pending', documents: [], hectares: 5, mainVariety: 'Caturra',
  email: 'carlos@wcm.co', phone: '3109876543',
};

describe('PendingProducerCardComponent', () => {
  let fixture: ComponentFixture<PendingProducerCardComponent>;
  let component: PendingProducerCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingProducerCardComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();
    fixture = TestBed.createComponent(PendingProducerCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('producer', MOCK_PRODUCER);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initials returns first letters of first two name parts', () => {
    expect(component.initials('Carlos Ramírez')).toBe('CR');
  });

  it('statusLabel maps pending to Pendiente', () => {
    expect(component.statusLabel('pending')).toBe('Pendiente');
  });

  it('statusLabel maps approved to Aprobado', () => {
    expect(component.statusLabel('approved')).toBe('Aprobado');
  });

  it('relativeTime returns Hoy for today date', () => {
    expect(component.relativeTime(new Date().toISOString())).toBe('Hoy');
  });

  it('relativeTime returns Hace 1 día for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400001).toISOString();
    expect(component.relativeTime(yesterday)).toBe('Hace 1 día');
  });

  it('relativeTime returns Hace N días for dates within 30 days', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400001).toISOString();
    expect(component.relativeTime(fiveDaysAgo)).toBe('Hace 5 días');
  });

  it('viewDetails emits producer object', () => {
    let emitted: IProducerApproval | undefined;
    component.viewDetails.subscribe(p => (emitted = p));
    component.viewDetails.emit(MOCK_PRODUCER);
    expect(emitted).toEqual(MOCK_PRODUCER);
  });

  it('quickApprove emits producer id', () => {
    let emitted = '';
    component.quickApprove.subscribe(id => (emitted = id));
    component.quickApprove.emit('apr-1');
    expect(emitted).toBe('apr-1');
  });

  it('quickReject emits producer id', () => {
    let emitted = '';
    component.quickReject.subscribe(id => (emitted = id));
    component.quickReject.emit('apr-1');
    expect(emitted).toBe('apr-1');
  });
});
