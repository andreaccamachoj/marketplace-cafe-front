import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CertificationFormModalComponent } from './certification-form-modal.component';
import { ICertification } from '../../models/certification.model';

describe('CertificationFormModalComponent', () => {
  let fixture: ComponentFixture<CertificationFormModalComponent>;
  let component: CertificationFormModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationFormModalComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();
    fixture = TestBed.createComponent(CertificationFormModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form starts with type=organic', () => {
    expect(component.form.value.type).toBe('organic');
  });

  it('certTypeEntries contains organic entry', () => {
    const found = component.certTypeEntries.find(([code]) => code === 'organic');
    expect(found).toBeTruthy();
  });

  it('onSubmit marks all touched when form is invalid', () => {
    component.onSubmit();
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('onSubmit emits saved with cert data when form is valid', () => {
    let payload: Omit<ICertification, 'id'> | undefined;
    component.saved.subscribe(p => (payload = p));
    component.form.patchValue({
      type: 'organic', name: 'Café Orgánico', issuer: 'BCS Öko',
      issueDate: '2024-01-01', expiryDate: '2027-01-01', notes: '',
    });
    component.onSubmit();
    expect(payload).toBeTruthy();
    expect(payload!.name).toBe('Café Orgánico');
    expect(payload!.issuer).toBe('BCS Öko');
  });

  it('hasDateRangeError is true when expiry is before issue date', () => {
    component.form.patchValue({ issueDate: '2025-06-01', expiryDate: '2025-01-01' });
    component.form.controls.issueDate.markAsTouched();
    component.form.controls.expiryDate.markAsTouched();
    expect(component.hasDateRangeError).toBe(true);
  });

  it('issueDateNotFutureValidator rejects future dates', () => {
    component.form.controls.issueDate.setValue('2099-01-01');
    component.form.controls.issueDate.markAsTouched();
    expect(component.form.controls.issueDate.errors?.['futureDate']).toBeTruthy();
  });

  it('name minLength validation requires at least 3 chars', () => {
    component.form.controls.name.setValue('AB');
    component.form.controls.name.markAsTouched();
    expect(component.hasError(component.form.controls.name)).toBe(true);
  });

  it('onClose emits closed and resets form', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    component.onClose();
    expect(count).toBe(1);
    expect(component.form.value.type).toBe('organic');
    expect(component.form.value.name).toBe('');
  });

  it('removeFile sets selectedFile to null', () => {
    component['selectedFile'].set(new File([''], 'test.pdf'));
    component.removeFile();
    expect(component['selectedFile']()).toBeNull();
  });
});
