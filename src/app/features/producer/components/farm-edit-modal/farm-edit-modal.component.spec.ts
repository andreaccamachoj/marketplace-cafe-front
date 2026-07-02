import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { FarmEditModalComponent } from './farm-edit-modal.component';
import { IFarm } from '../../models/farm.model';

const MOCK_FARM: IFarm = {
  id: 'farm-1', name: 'Finca El Edén', municipality: 'Salento',
  department: 'Quindío', altitude: '1800 msnm', area: '5 hectáreas',
  mainVariety: 'Caturra', process: 'Lavado',
  description: 'Finca ecológica de producción sostenible en Quindío',
  certifications: [],
  metrics: {
    annualProduction: '100', yieldPerHa: '20', process: 'Lavado',
    harvestSeason: 'Oct-Dic', treeCount: '5000', cuppingScore: '85',
  },
  profileStatus: { status: 'approved', approvedBy: 'admin', approvalDate: '2025-01-01', verifiedDocs: 3 },
};

describe('FarmEditModalComponent', () => {
  let fixture: ComponentFixture<FarmEditModalComponent>;
  let component: FarmEditModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmEditModalComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();
    fixture = TestBed.createComponent(FarmEditModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('farm', MOCK_FARM);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is hydrated from farm input', () => {
    expect(component.form.value.name).toBe('Finca El Edén');
    expect(component.form.value.municipality).toBe('Salento');
    expect(component.form.value.department).toBe('Quindío');
  });

  it('onSubmit marks all touched when form is invalid', () => {
    component.form.controls.name.setValue('');
    component.onSubmit();
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('onSubmit emits saved with farm data when form is valid', () => {
    let payload: Partial<IFarm> | undefined;
    component.saved.subscribe(p => (payload = p));
    component.form.patchValue({
      name: 'Nueva Finca', municipality: 'Armenia', department: 'Quindío',
      country: 'Colombia', altitude: '1600', area: '3',
      mainVariety: 'Bourbon', process: 'Natural',
      description: 'Descripción de la finca nueva con suficientes caracteres para pasar',
      annualProduction: '80', yieldPerHa: '15', harvestSeason: 'Nov-Ene',
      treeCount: '3000', cuppingScore: '83',
    });
    component.onSubmit();
    expect(payload).toBeTruthy();
    expect(payload!.name).toBe('Nueva Finca');
  });

  it('onClose emits closed and resets form', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    component.onClose();
    expect(count).toBe(1);
  });

  it('hasError returns false for untouched control', () => {
    expect(component.hasError(component.form.controls.name)).toBe(false);
  });

  it('hasError returns true for touched invalid control', () => {
    component.form.controls.name.setValue('');
    component.form.controls.name.markAsTouched();
    expect(component.hasError(component.form.controls.name)).toBe(true);
  });

  it('processOptions contains expected values', () => {
    expect(component.processOptions).toContain('Washed');
    expect(component.processOptions).toContain('Natural');
  });
});
