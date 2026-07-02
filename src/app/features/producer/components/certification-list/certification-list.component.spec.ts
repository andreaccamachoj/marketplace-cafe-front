import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificationListComponent } from './certification-list.component';
import { IFarmCertification } from '../../models/farm.model';

const MOCK_CERTS: IFarmCertification[] = [
  { id: 'c-1', icon: '🌿', iconBg: 'green', name: 'Orgánico', body: 'BCS', validUntil: 'jun. 2026', status: 'valid' },
  { id: 'c-2', icon: '☕', iconBg: 'amber', name: 'Fairtrade', body: 'FLO', validUntil: 'dic. 2025', status: 'expiring' },
];

describe('CertificationListComponent', () => {
  let fixture: ComponentFixture<CertificationListComponent>;
  let component: CertificationListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CertificationListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('certifications', MOCK_CERTS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives certifications input', () => {
    expect(component.certifications().length).toBe(2);
    expect(component.certifications()[0].name).toBe('Orgánico');
  });

  it('accepts empty certifications list', () => {
    fixture.componentRef.setInput('certifications', []);
    fixture.detectChanges();
    expect(component.certifications().length).toBe(0);
  });
});
