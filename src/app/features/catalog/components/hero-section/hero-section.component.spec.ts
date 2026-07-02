import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  let fixture: ComponentFixture<HeroSectionComponent>;
  let component: HeroSectionComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeroSectionComponent] }).compileComponents();
    fixture   = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the hero section', () => {
    expect(el.querySelector('.hero') ?? el.querySelector('section') ?? el.firstElementChild).toBeTruthy();
  });

  it('emits exploreCatalog when explore link is clicked', () => {
    const spy = jasmine.createSpy('exploreCatalog');
    component.exploreCatalog.subscribe(spy);
    el.querySelector<HTMLAnchorElement>('.btn-hero-primary')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('renders hero title', () => {
    expect(el.textContent).toContain('café');
  });

  it('renders stats section', () => {
    expect(el.textContent).toMatch(/productor|región|certificad/i);
  });
});
