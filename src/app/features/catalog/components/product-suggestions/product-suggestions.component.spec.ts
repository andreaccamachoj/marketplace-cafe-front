import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductSuggestionsComponent } from './product-suggestions.component';
import { IProduct } from '../../models/product.model';

const makeProduct = (id: string): IProduct => ({
  id, name: `Café ${id}`, producerName: 'Finca Test',
  category: 'Especial', description: 'Bueno', price: 25000,
  unit: '250g', rating: 4.5, reviewCount: 5, stock: 50, soldCount: 10,
  images: [], certifications: [], region: 'Huila', emoji: '☕',
  presentationTypes: [],
} as any);

describe('ProductSuggestionsComponent', () => {
  let fixture: ComponentFixture<ProductSuggestionsComponent>;
  let component: ProductSuggestionsComponent;
  let el: HTMLElement;

  function create(products: IProduct[] = []) {
    fixture   = TestBed.createComponent(ProductSuggestionsComponent);
    component = fixture.componentInstance;
    component.products = products;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSuggestionsComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('renders nothing when products is empty', () => {
    create([]);
    expect(el.querySelector('.suggestions-section')).toBeNull();
  });

  it('renders section when products are provided', () => {
    create([makeProduct('1'), makeProduct('2')]);
    expect(el.querySelector('.suggestions-section')).toBeTruthy();
  });

  it('renders correct number of suggestion cards', () => {
    create([makeProduct('1'), makeProduct('2'), makeProduct('3')]);
    expect(el.querySelectorAll('.sug-card').length).toBe(3);
  });

  it('renders product name', () => {
    create([makeProduct('A')]);
    expect(el.textContent).toContain('Café A');
  });

  it('renders producer name', () => {
    create([makeProduct('1')]);
    expect(el.textContent).toContain('Finca Test');
  });

  it('renders section title', () => {
    create([makeProduct('1')]);
    expect(el.textContent).toContain('Más cafés especiales');
  });

  it('shows emoji when no images', () => {
    create([makeProduct('1')]);
    expect(el.querySelector('.sug-emoji')).toBeTruthy();
  });

  it('shows img when images are present', () => {
    const prod = { ...makeProduct('1'), images: ['img.jpg'] };
    create([prod]);
    expect(el.querySelector('.sug-img-photo')).toBeTruthy();
  });

  it('emits productSelected when + button clicked', () => {
    create([makeProduct('42')]);
    const spy = jasmine.createSpy('productSelected');
    component.productSelected.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.btn-sug-add')!.click();
    expect(spy).toHaveBeenCalledWith('42');
  });

  it('renders price', () => {
    create([makeProduct('1')]);
    expect(el.querySelector('.sug-price')).toBeTruthy();
  });
});
