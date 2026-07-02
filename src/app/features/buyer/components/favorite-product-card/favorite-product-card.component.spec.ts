import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteProductCardComponent } from './favorite-product-card.component';
import { IFavorite } from '../../models/favorite.model';

const MOCK_FAVORITE: IFavorite = {
  id: 'fav-1',
  productId: 'prod-1',
  productName: 'Café Sierra Nevada',
  productOrigin: 'Sierra Nevada, Colombia',
  productPrice: 45000,
  productImageUrl: 'https://example.com/img.jpg',
  productRating: 4.5,
  productCategory: 'Arábica',
  addedAt: new Date().toISOString(),
};

const OLD_FAVORITE: IFavorite = {
  ...MOCK_FAVORITE,
  id: 'fav-2',
  addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

describe('FavoriteProductCardComponent', () => {
  let fixture: ComponentFixture<FavoriteProductCardComponent>;
  let component: FavoriteProductCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteProductCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FavoriteProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('favorite', MOCK_FAVORITE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits viewProduct with productId when onView is called', () => {
    const emitted: string[] = [];
    component.viewProduct.subscribe(v => emitted.push(v));
    (component as any).onView();
    expect(emitted).toEqual(['prod-1']);
  });

  it('emits addToCart with favorite when onAddToCart is called', () => {
    const emitted: IFavorite[] = [];
    component.addToCart.subscribe(v => emitted.push(v));
    (component as any).onAddToCart();
    expect(emitted).toEqual([MOCK_FAVORITE]);
  });

  it('emits remove with productId when onRemove is called', () => {
    const emitted: string[] = [];
    component.remove.subscribe(v => emitted.push(v));
    (component as any).onRemove();
    expect(emitted).toEqual(['prod-1']);
  });

  it('daysAgo returns "Hoy" for items added today', () => {
    expect((component as any).daysAgo()).toBe('Hoy');
  });

  it('daysAgo returns "Hace N días" for items added earlier', () => {
    fixture.componentRef.setInput('favorite', OLD_FAVORITE);
    fixture.detectChanges();
    expect((component as any).daysAgo()).toContain('días');
  });

  it('daysAgo returns "Hace 1 día" for items added yesterday', () => {
    const yesterday = { ...MOCK_FAVORITE, addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() };
    fixture.componentRef.setInput('favorite', yesterday);
    fixture.detectChanges();
    expect((component as any).daysAgo()).toBe('Hace 1 día');
  });
});
