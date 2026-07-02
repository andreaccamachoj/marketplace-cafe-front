import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesMiniChartComponent } from './sales-mini-chart.component';

describe('SalesMiniChartComponent', () => {
  let fixture: ComponentFixture<SalesMiniChartComponent>;
  let component: SalesMiniChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMiniChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SalesMiniChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('bars has 6 entries', () => {
    expect(component['bars'].length).toBe(6);
  });

  it('last bar has active flag', () => {
    const last = component['bars'][component['bars'].length - 1];
    expect(last.active).toBe(true);
  });

  it('bars have month labels', () => {
    const months = component['bars'].map(b => b.month);
    expect(months).toContain('Abr');
    expect(months).toContain('Nov');
  });
});
