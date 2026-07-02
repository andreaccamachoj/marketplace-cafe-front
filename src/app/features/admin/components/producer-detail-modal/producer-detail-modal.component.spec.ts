import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducerDetailModalComponent } from './producer-detail-modal.component';
import { IProducerApproval } from '../../models/producer-approval.model';

const MOCK_PRODUCER: IProducerApproval = {
  id: 'apr-1', producerName: 'Carlos Ramírez', farmName: 'El Edén',
  region: 'Eje Cafetero', department: 'Quindío', submittedAt: '2025-01-10T10:00:00Z',
  status: 'pending', documents: [], hectares: 5, mainVariety: 'Caturra',
  email: 'carlos@wcm.co', phone: '3109876543',
};

describe('ProducerDetailModalComponent', () => {
  let fixture: ComponentFixture<ProducerDetailModalComponent>;
  let component: ProducerDetailModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerDetailModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProducerDetailModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('producer', MOCK_PRODUCER);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showRejectForm starts as false', () => {
    expect(component['showRejectForm']()).toBe(false);
  });

  it('statusLabel maps pending to Pendiente', () => {
    expect(component.statusLabel('pending')).toBe('Pendiente');
  });

  it('statusLabel maps approved to Aprobado', () => {
    expect(component.statusLabel('approved')).toBe('Aprobado');
  });

  it('docTypeLabel maps rut to RUT', () => {
    expect(component.docTypeLabel('rut')).toBe('RUT');
  });

  it('docTypeLabel maps predial to Certificado Predial', () => {
    expect(component.docTypeLabel('predial')).toBe('Certificado Predial');
  });

  it('formatDate returns a localized date string', () => {
    const result = component.formatDate('2025-01-10T10:00:00Z');
    expect(result).toContain('2025');
  });

  it('onApprove emits approved event with producer id', () => {
    let emitted = '';
    component.approved.subscribe(id => (emitted = id));
    component.onApprove();
    expect(emitted).toBe('apr-1');
  });

  it('onApprove does nothing when producer is null', () => {
    fixture.componentRef.setInput('producer', null);
    fixture.detectChanges();
    let emitted = false;
    component.approved.subscribe(() => (emitted = true));
    component.onApprove();
    expect(emitted).toBe(false);
  });

  it('cancelReject resets showRejectForm and reason', () => {
    component['showRejectForm'].set(true);
    component['rejectReason'] = 'Some reason';
    component.cancelReject();
    expect(component['showRejectForm']()).toBe(false);
    expect(component['rejectReason']).toBe('');
  });

  it('onConfirmReject does nothing when reason is too short', () => {
    component['rejectReason'] = 'corto';
    let emitted = false;
    component.rejected.subscribe(() => (emitted = true));
    component.onConfirmReject();
    expect(emitted).toBe(false);
  });

  it('onConfirmReject emits rejected event when reason is valid', () => {
    component['rejectReason'] = 'Documentos incompletos o ilegibles en el expediente.';
    let payload: { id: string; reason: string } | undefined;
    component.rejected.subscribe(p => (payload = p));
    component.onConfirmReject();
    expect(payload).toEqual({ id: 'apr-1', reason: 'Documentos incompletos o ilegibles en el expediente.' });
    expect(component['showRejectForm']()).toBe(false);
  });

  it('ngOnChanges resets form state on producer change', () => {
    component['showRejectForm'].set(true);
    component['rejectReason'] = 'Test';
    component.ngOnChanges({ producer: {} as any });
    expect(component['showRejectForm']()).toBe(false);
    expect(component['rejectReason']).toBe('');
  });
});
