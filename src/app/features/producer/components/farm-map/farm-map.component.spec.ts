import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmMapComponent } from './farm-map.component';

describe('FarmMapComponent', () => {
  let fixture: ComponentFixture<FarmMapComponent>;
  let component: FarmMapComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmMapComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FarmMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('farmName defaults to Finca', () => {
    expect(component.farmName()).toBe('Finca');
  });

  it('location defaults to empty string', () => {
    expect(component.location()).toBe('');
  });

  it('accepts custom farmName and location', () => {
    fixture.componentRef.setInput('farmName', 'El Edén');
    fixture.componentRef.setInput('location', 'Salento, Quindío');
    fixture.detectChanges();
    expect(component.farmName()).toBe('El Edén');
    expect(component.location()).toBe('Salento, Quindío');
  });
});
