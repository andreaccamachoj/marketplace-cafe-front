import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableRowComponent } from './product-table-row.component';
import { IManagedProduct } from '../../models/managed-product.model';

const MOCK_PRODUCT: IManagedProduct = {
  id: 'p-1', emoji: '☕', name: 'Café Sierra', category: 'Arábica',
  categoryId: 'cat-1', unit: '500g', status: 'active', price: 45000, stock: 100,
  certifications: ['organico'], rating: 4, reviewCount: 10, salesCount: 50,
};

describe('ProductTableRowComponent', () => {
  let fixture: ComponentFixture<ProductTableRowComponent>;
  let component: ProductTableRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableRowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductTableRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('statusLabel returns Activo for active product', () => {
    expect(component['statusLabel']()).toBe('Activo');
  });

  it('statusLabel returns Inactivo for inactive product', () => {
    fixture.componentRef.setInput('product', { ...MOCK_PRODUCT, status: 'inactive' });
    fixture.detectChanges();
    expect(component['statusLabel']()).toBe('Inactivo');
  });

  it('statusLabel returns Borrador for draft product', () => {
    fixture.componentRef.setInput('product', { ...MOCK_PRODUCT, status: 'draft' });
    fixture.detectChanges();
    expect(component['statusLabel']()).toBe('Borrador');
  });

  it('stockUnit returns Agotado when stock is 0', () => {
    fixture.componentRef.setInput('product', { ...MOCK_PRODUCT, stock: 0 });
    fixture.detectChanges();
    expect(component['stockUnit']()).toBe('Agotado');
  });

  it('stockUnit returns Stock crítico when stock < 10', () => {
    fixture.componentRef.setInput('product', { ...MOCK_PRODUCT, stock: 5 });
    fixture.detectChanges();
    expect(component['stockUnit']()).toBe('Stock crítico');
  });

  it('stockUnit returns unit when stock >= 10', () => {
    expect(component['stockUnit']()).toBe('500g');
  });

  it('starsHtml contains full and empty stars', () => {
    const html = component['starsHtml']();
    expect(html).toContain('★');
    expect(html).toContain('☆');
  });

  it('starsHtml returns empty string when rating is 0', () => {
    fixture.componentRef.setInput('product', { ...MOCK_PRODUCT, rating: 0 });
    fixture.detectChanges();
    expect(component['starsHtml']()).toBe('');
  });

  it('hasOrganico returns true when organico certification present', () => {
    expect(component['hasOrganico']()).toBe(true);
  });

  it('hasFairtrade returns false when fairtrade not present', () => {
    expect(component['hasFairtrade']()).toBe(false);
  });

  it('toggleStatus emits product id', () => {
    let emitted = '';
    component.toggleStatus.subscribe(id => (emitted = id));
    component['onToggle']();
    expect(emitted).toBe('p-1');
  });

  it('edit emits product id', () => {
    let emitted = '';
    component.edit.subscribe(id => (emitted = id));
    component['onEdit']();
    expect(emitted).toBe('p-1');
  });

  it('view emits product id', () => {
    let emitted = '';
    component.view.subscribe(id => (emitted = id));
    component['onView']();
    expect(emitted).toBe('p-1');
  });

  it('remove emits product id', () => {
    let emitted = '';
    component.remove.subscribe(id => (emitted = id));
    component['onRemove']();
    expect(emitted).toBe('p-1');
  });
});
