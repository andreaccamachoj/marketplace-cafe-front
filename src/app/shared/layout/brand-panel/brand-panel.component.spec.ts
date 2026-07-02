import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandPanelComponent, IBrandPillar } from './brand-panel.component';

describe('BrandPanelComponent', () => {
  let fixture: ComponentFixture<BrandPanelComponent>;
  let component: BrandPanelComponent;
  let el: HTMLElement;

  function create(inputs: Partial<BrandPanelComponent> = {}) {
    fixture   = TestBed.createComponent(BrandPanelComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BrandPanelComponent] }).compileComponents();
  });

  it('renders the brand panel container', () => {
    create();
    expect(el.querySelector('.panel-brand')).toBeTruthy();
  });

  it('renders brand name', () => {
    create();
    expect(el.querySelector('.brand-name')!.textContent?.trim()).toBe('World Coffee Marketplace');
  });

  it('renders tagline', () => {
    create();
    expect(el.querySelector('.brand-tagline')!.textContent?.trim()).toBe('Est. 2025 · Colombia');
  });

  it('renders logo icon', () => {
    create();
    expect(el.querySelector('.brand-logo-circle')!.textContent?.trim()).toBe('☕');
  });

  it('renders default description', () => {
    create();
    expect(el.querySelector('.brand-desc')!.textContent).toContain('productores verificados');
  });

  it('renders custom description', () => {
    create({ description: 'Descripción personalizada' });
    expect(el.querySelector('.brand-desc')!.textContent?.trim()).toBe('Descripción personalizada');
  });

  it('renders one pillar per item in pillars array', () => {
    const pillars: IBrandPillar[] = [
      { icon: '🌿', iconClass: 'green', title: 'Sostenible', sub: 'Orgánico' },
      { icon: '🔍', iconClass: 'amber', title: 'Trazabilidad', sub: 'Total' },
    ];
    create({ pillars });
    expect(el.querySelectorAll('.pillar').length).toBe(2);
  });

  it('renders pillar icon and title', () => {
    create();
    const firstPillar = el.querySelector('.pillar')!;
    expect(firstPillar.querySelector('.pillar-title')!.textContent?.trim()).toBe('100% Sostenible');
  });

  it('renders pillar sub text', () => {
    create();
    const firstPillar = el.querySelector('.pillar')!;
    expect(firstPillar.querySelector('.pillar-sub')!.textContent?.trim()).toContain('Orgánico');
  });

  it('renders brand illustration SVG', () => {
    create();
    expect(el.querySelector('.cup-illustration svg')).toBeTruthy();
  });
});
