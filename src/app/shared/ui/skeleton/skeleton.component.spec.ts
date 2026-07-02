import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;
  let component: SkeletonComponent;
  let el: HTMLElement;

  function create(inputs: Partial<SkeletonComponent> = {}) {
    fixture   = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonComponent] }).compileComponents();
  });

  it('renders text variant by default', () => {
    create();
    expect(el.querySelector('.skeleton--text')).toBeTruthy();
  });

  it('renders rect variant', () => {
    create({ variant: 'rect' });
    expect(el.querySelector('.skeleton--rect')).toBeTruthy();
  });

  it('renders card variant with img and body', () => {
    create({ variant: 'card' });
    expect(el.querySelector('.skeleton--card')).toBeTruthy();
    expect(el.querySelector('.skeleton__img')).toBeTruthy();
    expect(el.querySelector('.skeleton__body')).toBeTruthy();
  });

  it('renders circle variant with custom size', () => {
    create({ variant: 'circle', size: '64px' });
    const div = el.querySelector('.skeleton--circle') as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.style.width).toBe('64px');
    expect(div.style.height).toBe('64px');
  });

  it('applies custom width and height for text variant', () => {
    create({ variant: 'text', width: '50%', height: '2em' });
    const div = el.querySelector('.skeleton--text') as HTMLElement;
    expect(div.style.width).toBe('50%');
    expect(div.style.height).toBe('2em');
  });

  it('all skeleton variants have aria-hidden', () => {
    create({ variant: 'card' });
    expect(el.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
