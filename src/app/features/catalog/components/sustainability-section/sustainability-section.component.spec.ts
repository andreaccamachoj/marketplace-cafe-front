import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SustainabilitySectionComponent } from './sustainability-section.component';

describe('SustainabilitySectionComponent', () => {
  let fixture: ComponentFixture<SustainabilitySectionComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SustainabilitySectionComponent] }).compileComponents();
    fixture = TestBed.createComponent(SustainabilitySectionComponent);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the sustainability section', () => {
    expect(el.firstElementChild).toBeTruthy();
  });

  it('contains organic content', () => {
    expect(el.textContent).toMatch(/orgánico|sostenib/i);
  });

  it('contains fair trade content', () => {
    expect(el.textContent).toMatch(/comercio justo|fairtrade/i);
  });

  it('contains traceability content', () => {
    expect(el.textContent).toMatch(/trazabilidad|transparencia/i);
  });
});
