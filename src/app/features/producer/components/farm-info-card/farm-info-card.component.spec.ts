import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmInfoCardComponent } from './farm-info-card.component';
import { IFarm } from '../../models/farm.model';

const MOCK_FARM: IFarm = {
  id: 'farm-1', name: 'Finca El Edén', municipality: 'Salento',
  department: 'Quindío', altitude: '1800 msnm', area: '5 hectáreas',
  mainVariety: 'Caturra', process: 'Lavado', description: 'Finca ecológica',
  certifications: [],
  metrics: {
    annualProduction: '100 sacos', yieldPerHa: '20', process: 'Lavado',
    harvestSeason: 'Oct-Dic', treeCount: '5000', cuppingScore: '85',
  },
  profileStatus: { status: 'approved', approvedBy: 'admin', approvalDate: '2025-01-01', verifiedDocs: 3 },
};

describe('FarmInfoCardComponent', () => {
  let fixture: ComponentFixture<FarmInfoCardComponent>;
  let component: FarmInfoCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmInfoCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FarmInfoCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('farm', MOCK_FARM);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives farm input', () => {
    expect(component.farm().name).toBe('Finca El Edén');
    expect(component.farm().municipality).toBe('Salento');
  });
});
