import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectionReasonModalComponent } from './rejection-reason-modal.component';

describe('RejectionReasonModalComponent', () => {
  let fixture: ComponentFixture<RejectionReasonModalComponent>;
  let component: RejectionReasonModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionReasonModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RejectionReasonModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('producerName', 'Carlos Ramírez');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showError starts as false', () => {
    expect(component['showError']()).toBe(false);
  });

  it('reason starts as empty string', () => {
    expect(component['reason']).toBe('');
  });

  it('onConfirm sets showError to true when reason is too short', () => {
    component['reason'] = 'corto';
    component.onConfirm();
    expect(component['showError']()).toBe(true);
  });

  it('onConfirm does not emit confirmed when reason is too short', () => {
    let emitted = false;
    component.confirmed.subscribe(() => (emitted = true));
    component['reason'] = 'corto';
    component.onConfirm();
    expect(emitted).toBe(false);
  });

  it('onConfirm emits trimmed reason when valid (>= 20 chars)', () => {
    let emitted = '';
    component.confirmed.subscribe(r => (emitted = r));
    component['reason'] = '  Documentos incompletos en el expediente.  ';
    component.onConfirm();
    expect(emitted).toBe('Documentos incompletos en el expediente.');
  });

  it('onConfirm resets reason and showError after successful emit', () => {
    component['reason'] = 'Documentos incompletos en el expediente.';
    component.onConfirm();
    expect(component['reason']).toBe('');
    expect(component['showError']()).toBe(false);
  });

  it('onInput clears showError when reason reaches 20 chars', () => {
    component['showError'].set(true);
    component['reason'] = 'Documentos incompletos del productor';
    component.onInput();
    expect(component['showError']()).toBe(false);
  });

  it('onInput keeps showError true when reason is still short', () => {
    component['showError'].set(true);
    component['reason'] = 'corto';
    component.onInput();
    expect(component['showError']()).toBe(true);
  });

  it('closed output emits when triggered', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    component.closed.emit();
    expect(count).toBe(1);
  });
});
