import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlavorNotesComponent } from './flavor-notes.component';

const mockFlavorNotes = [
  { icon: '🍫', name: 'Chocolate', intensity: 80 },
  { icon: '🍋', name: 'Cítrico',   intensity: 60 },
];
const mockCuppingAttrs = [
  { label: 'Aroma', value: 8.5 },
  { label: 'Sabor', value: 8.8 },
];

describe('FlavorNotesComponent', () => {
  let fixture: ComponentFixture<FlavorNotesComponent>;
  let component: FlavorNotesComponent;
  let el: HTMLElement;

  function create(
    flavorNotes = mockFlavorNotes,
    cuppingScore = 88,
    cuppingAttributes = mockCuppingAttrs,
  ) {
    fixture   = TestBed.createComponent(FlavorNotesComponent);
    component = fixture.componentInstance;
    component.flavorNotes       = flavorNotes;
    component.cuppingScore      = cuppingScore;
    component.cuppingAttributes = cuppingAttributes;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FlavorNotesComponent] }).compileComponents();
  });

  it('renders the component', () => {
    create();
    expect(el.firstElementChild).toBeTruthy();
  });

  it('renders flavor note names', () => {
    create();
    expect(el.textContent).toContain('Chocolate');
    expect(el.textContent).toContain('Cítrico');
  });

  it('renders cupping score', () => {
    create();
    expect(el.textContent).toContain('88');
  });

  it('renders cupping attribute labels', () => {
    create();
    expect(el.textContent).toContain('Aroma');
    expect(el.textContent).toContain('Sabor');
  });

  it('renders progressbars for intensities', () => {
    create();
    expect(el.querySelectorAll('[role="progressbar"]').length).toBeGreaterThan(0);
  });

  it('renders correctly with empty flavor notes', () => {
    create([], 85, mockCuppingAttrs);
    expect(el.textContent).toContain('85');
  });
});
