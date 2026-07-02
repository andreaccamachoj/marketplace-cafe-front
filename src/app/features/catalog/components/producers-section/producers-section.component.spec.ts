import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducersSectionComponent } from './producers-section.component';
import { ProductService } from '../../services/product.service';

const makeProduct = (id: string, producerName: string, region: string) => ({
  id, name: `Café ${id}`, producerName, region,
  category: 'Especial', description: '', price: 25000,
  unit: '250g', rating: 4.5, reviewCount: 5, stock: 50, soldCount: 10,
  images: [], certifications: [], emoji: '☕', presentationTypes: [],
} as any);

describe('ProducersSectionComponent', () => {
  let fixture: ComponentFixture<ProducersSectionComponent>;
  let el: HTMLElement;
  let mockProductService: { list: jasmine.Spy };

  function create(products: any[] = []) {
    mockProductService.list.and.returnValue(products);
    fixture = TestBed.createComponent(ProducersSectionComponent);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockProductService = { list: jasmine.createSpy('list').and.returnValue([]) };

    await TestBed.configureTestingModule({
      imports: [ProducersSectionComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();
  });

  it('renders the producers section', () => {
    create();
    expect(el.querySelector('.section-prod')).toBeTruthy();
  });

  it('renders section title', () => {
    create();
    expect(el.textContent).toContain('Productores verificados');
  });

  it('renders producer cards from product list', () => {
    create([
      makeProduct('1', 'Finca El Paraíso', 'Huila'),
      makeProduct('2', 'Finca La Palma', 'Nariño'),
    ]);
    expect(el.querySelectorAll('.producer-card').length).toBe(2);
  });

  it('deduplicates producers with same name', () => {
    create([
      makeProduct('1', 'Finca El Paraíso', 'Huila'),
      makeProduct('2', 'Finca El Paraíso', 'Huila'),
    ]);
    expect(el.querySelectorAll('.producer-card').length).toBe(1);
  });

  it('renders producer name', () => {
    create([makeProduct('1', 'Finca Test', 'Huila')]);
    expect(el.textContent).toContain('Finca Test');
  });

  it('renders producer region', () => {
    create([makeProduct('1', 'Finca Test', 'Huila')]);
    expect(el.textContent).toContain('Huila');
  });

  it('renders empty producers grid when no products', () => {
    create([]);
    expect(el.querySelectorAll('.producer-card').length).toBe(0);
  });

  it('skips products with empty producerName', () => {
    create([
      { ...makeProduct('1', '', 'Huila') },
      makeProduct('2', 'Finca Test', 'Nariño'),
    ]);
    expect(el.querySelectorAll('.producer-card').length).toBe(1);
  });

  it('falls back to "Colombia" when region is empty', () => {
    create([makeProduct('1', 'Finca Test', '')]);
    expect(el.textContent).toContain('Colombia');
  });

  it('renders certification badges when product has certs', () => {
    const prod = { ...makeProduct('1', 'Finca Test', 'Huila'), certifications: ['ORGANIC', 'FAIRTRADE'] };
    create([prod]);
    expect(el.querySelectorAll('.badge').length).toBeGreaterThan(0);
  });

  it('caps at 8 producers when more than 8 unique producers', () => {
    const many = Array.from({ length: 10 }, (_, i) => makeProduct(`${i}`, `Finca ${i}`, 'Huila'));
    create(many);
    expect(el.querySelectorAll('.producer-card').length).toBe(8);
  });
});
