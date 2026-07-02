import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductGalleryComponent } from './product-gallery.component';

describe('ProductGalleryComponent', () => {
  let fixture: ComponentFixture<ProductGalleryComponent>;
  let component: ProductGalleryComponent;
  let el: HTMLElement;

  function create(overrides: Partial<ProductGalleryComponent> = {}) {
    fixture   = TestBed.createComponent(ProductGalleryComponent);
    component = fixture.componentInstance;
    component.images        = [];
    component.productName   = 'Café Huila';
    component.emoji         = '☕';
    component.certifications = [];
    Object.assign(component, overrides);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductGalleryComponent] }).compileComponents();
  });

  it('renders the gallery', () => {
    create();
    expect(el.querySelector('.gallery')).toBeTruthy();
  });

  it('renders emoji when no images', () => {
    create({ images: [], emoji: '☕' });
    expect(el.textContent).toContain('☕');
  });

  it('renders image when images are provided', () => {
    create({ images: ['img1.jpg', 'img2.jpg'] });
    expect(el.querySelector<HTMLImageElement>('.gallery__img')).toBeTruthy();
  });

  it('shows first image initially', () => {
    create({ images: ['img1.jpg', 'img2.jpg'] });
    expect(el.querySelector<HTMLImageElement>('.gallery__img')?.src).toContain('img1.jpg');
  });

  it('renders thumbnails when multiple images', () => {
    create({ images: ['a.jpg', 'b.jpg', 'c.jpg'] });
    expect(el.querySelectorAll('.gallery__thumb').length).toBe(3);
  });

  it('does not render thumbnails for single image', () => {
    create({ images: ['a.jpg'] });
    expect(el.querySelectorAll('.gallery__thumb').length).toBe(0);
  });

  it('renders certification badges when certifications provided', () => {
    create({ certifications: ['ORGANIC'] as any });
    expect(el.querySelector('.gallery__badges')).toBeTruthy();
  });

  it('does not render badges when no certifications', () => {
    create({ certifications: [] as any });
    expect(el.querySelector('.gallery__badges')).toBeNull();
  });

  it('renders wishlist button', () => {
    create();
    expect(el.querySelector('.gallery__wishlist')).toBeTruthy();
  });

  it('toggling wishlist button changes state', () => {
    create();
    const btn = el.querySelector<HTMLButtonElement>('.gallery__wishlist')!;
    expect(component['wishlisted']()).toBeFalse();
    btn.click();
    fixture.detectChanges();
    expect(component['wishlisted']()).toBeTrue();
  });

  it('clicking thumbnail changes active image', () => {
    create({ images: ['a.jpg', 'b.jpg'] });
    const thumbs = el.querySelectorAll<HTMLButtonElement>('.gallery__thumb');
    thumbs[1].click();
    fixture.detectChanges();
    expect(component['activeIndex']()).toBe(1);
  });
});
