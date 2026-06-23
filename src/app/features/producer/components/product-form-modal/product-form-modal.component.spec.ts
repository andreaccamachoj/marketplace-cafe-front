import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductFormModalComponent } from './product-form-modal.component';
import { CategoryService } from '@features/catalog/services/category.service';
import { CertificationService } from '@features/catalog/services/certification.service';
import { IManagedProduct } from '../../models/managed-product.model';

const MOCK_PRODUCT: IManagedProduct = {
  id: 'p-1', emoji: '☕', name: 'Café Sierra', category: 'Arábica',
  categoryId: 'cat-1', description: 'Excelente', region: 'Sierra Nevada',
  unit: '500g', status: 'active', price: 45000, stock: 100,
  certifications: ['organic'], rating: 4.5, reviewCount: 12, salesCount: 50,
};

describe('ProductFormModalComponent', () => {
  let fixture: ComponentFixture<ProductFormModalComponent>;
  let component: ProductFormModalComponent;
  let categorySvc: jasmine.SpyObj<CategoryService>;
  let certSvc: jasmine.SpyObj<CertificationService>;

  beforeEach(async () => {
    const cats = signal<any[]>([]);
    const certs = signal<any[]>([]);
    categorySvc = jasmine.createSpyObj('CategoryService', [], { categories: cats.asReadonly() });
    certSvc = jasmine.createSpyObj('CertificationService', [], { certifications: certs.asReadonly() });

    await TestBed.configureTestingModule({
      imports: [ProductFormModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: CategoryService, useValue: categorySvc },
        { provide: CertificationService, useValue: certSvc },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductFormModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'create');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('modalTitle returns Nuevo Producto in create mode', () => {
    expect(component.modalTitle()).toBe('Nuevo Producto');
  });

  it('modalTitle returns Editar Producto in edit mode', () => {
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
    expect(component.modalTitle()).toBe('Editar Producto');
  });

  it('modalTitle returns Detalle del Producto in view mode', () => {
    fixture.componentRef.setInput('mode', 'view');
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
    expect(component.modalTitle()).toBe('Detalle del Producto');
  });

  it('isViewMode is false in create mode', () => {
    expect(component.isViewMode()).toBe(false);
  });

  it('isViewMode is true in view mode', () => {
    fixture.componentRef.setInput('mode', 'view');
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
    expect(component.isViewMode()).toBe(true);
  });

  it('form is patched when product input is set in edit mode', () => {
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
    expect(component.form.value.name).toBe('Café Sierra');
    expect(component.form.value.price).toBe(45000);
  });

  it('selectedCertCodes reflects product certifications', () => {
    fixture.componentRef.setInput('mode', 'edit');
    fixture.componentRef.setInput('product', MOCK_PRODUCT);
    fixture.detectChanges();
    expect(component.selectedCertCodes()).toContain('organic');
  });

  it('toggleCert adds a code when not present', () => {
    component.toggleCert('fair-trade');
    expect(component.selectedCertCodes()).toContain('fair-trade');
  });

  it('toggleCert removes a code when already present', () => {
    component.selectedCertCodes.set(['organic']);
    component.toggleCert('organic');
    expect(component.selectedCertCodes()).not.toContain('organic');
  });

  it('isCertSelected returns true for selected cert', () => {
    component.selectedCertCodes.set(['organic']);
    expect(component.isCertSelected('organic')).toBe(true);
  });

  it('onSubmit marks all touched when form is invalid', () => {
    component.onSubmit();
    expect(component.form.controls.name.touched).toBe(true);
  });

  it('onSubmit emits saved payload when form is valid', () => {
    let payload: Partial<IManagedProduct> | undefined;
    component.saved.subscribe(p => (payload = p));
    component.form.patchValue({
      name: 'Café Test', origin: 'Huila', category: 'cat-1',
      price: 30000, unit: '500g', stock: 50, status: 'active', description: '',
    });
    component.onSubmit();
    expect(payload).toBeTruthy();
    expect(payload!.name).toBe('Café Test');
    expect(payload!.price).toBe(30000);
  });

  it('onClose emits closed and resets form', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    component.onClose();
    expect(count).toBe(1);
  });

  it('hasError returns false for pristine untouched control', () => {
    expect(component.hasError(component.form.controls.name)).toBe(false);
  });

  it('submitLabel is Actualizar Producto in edit mode', () => {
    fixture.componentRef.setInput('mode', 'edit');
    fixture.detectChanges();
    expect(component.submitLabel()).toBe('Actualizar Producto');
  });

  it('submitLabel is Guardar Producto in create mode', () => {
    expect(component.submitLabel()).toBe('Guardar Producto');
  });

  function fileChangeEvent(file: File | null): Event {
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: file ? [file] : [], configurable: true });
    return { target: input } as unknown as Event;
  }

  it('onCoverSelected accepts a valid png and stores the file', () => {
    const file = new File([new Uint8Array(10)], 'cover.png', { type: 'image/png' });
    component.onCoverSelected(fileChangeEvent(file));
    expect(component.coverFile()).toBe(file);
    expect(component.coverError()).toBeNull();
  });

  it('onCoverSelected rejects an invalid format', () => {
    const file = new File([new Uint8Array(10)], 'doc.pdf', { type: 'application/pdf' });
    component.onCoverSelected(fileChangeEvent(file));
    expect(component.coverFile()).toBeNull();
    expect(component.coverError()).toContain('Formato no permitido');
  });

  it('onCoverSelected rejects a file larger than 2 MB', () => {
    const big = new File([new ArrayBuffer(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' });
    component.onCoverSelected(fileChangeEvent(big));
    expect(component.coverFile()).toBeNull();
    expect(component.coverError()).toContain('2 MB');
  });

  it('removeCover clears the selected file and error', () => {
    const file = new File([new Uint8Array(10)], 'cover.jpg', { type: 'image/jpeg' });
    component.onCoverSelected(fileChangeEvent(file));
    component.removeCover();
    expect(component.coverFile()).toBeNull();
    expect(component.coverError()).toBeNull();
  });

  it('onSubmit emits coverSelected with the chosen file', () => {
    let emitted: File | null | undefined;
    component.coverSelected.subscribe(f => (emitted = f));
    const file = new File([new Uint8Array(10)], 'cover.png', { type: 'image/png' });
    component.onCoverSelected(fileChangeEvent(file));
    component.form.patchValue({
      name: 'Café Test', origin: 'Huila', category: 'cat-1',
      price: 30000, unit: '500g', stock: 50, status: 'active', description: '',
    });
    component.onSubmit();
    expect(emitted).toBe(file);
  });
});
