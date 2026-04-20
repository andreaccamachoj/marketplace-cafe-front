import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { ProductPayload, ProductStatus, ProductUnit, Certification } from '../../models/product.model';
import { PRODUCT_COPY } from '../../constants/product.constants';
import { arrayMinLengthValidator } from '../../../../shared/utils/validators/array-min-length.validator';
import { DragDropDirective } from '../../../../shared/utils/directives/drag-drop.directive';

interface ProductFormType {
  name: FormControl<string>;
  category: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
  unit: FormControl<ProductUnit | null>;
  stock: FormControl<number>;
  images: FormControl<File[]>;
  certifications: FormControl<Certification[]>;
  status: FormControl<ProductStatus>;
}

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, DragDropDirective],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

  @Output() save = new EventEmitter<ProductPayload>();
  @Output() cancel = new EventEmitter<void>();

  readonly COPY = PRODUCT_COPY;

  // Inyección del NonNullableFormBuilder para garantizar que reset() no asigne nulos a campos que no lo admiten
  productForm: FormGroup<ProductFormType>;

  constructor(private fb: NonNullableFormBuilder) {
    this.productForm = this.fb.group<ProductFormType>({
      name: this.fb.control('', [Validators.required]),
      category: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required, Validators.maxLength(300)]),
      price: this.fb.control(0, [Validators.required, Validators.min(0)]),
      unit: this.fb.control<ProductUnit | null>(null),
      stock: this.fb.control(0, [Validators.required, Validators.min(0)]),
      images: this.fb.control<File[]>([], [arrayMinLengthValidator(3)]),
      certifications: this.fb.control<Certification[]>([]),
      status: this.fb.control(ProductStatus.DRAFT, [Validators.required])
    });
  }

  // Getter tipado para accesibilidad en el template
  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    // getRawValue() retorna el tipo exacto sin propiedades opcionales indeseadas
    const payload: ProductPayload = this.productForm.getRawValue();
    this.save.emit(payload);
  }

  onCancel(): void {
    this.productForm.reset();
    this.cancel.emit();
  }

  // En tu product-form.component.ts

  onFilesDropped(files: FileList): void {
    this.processFiles(Array.from(files));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
    }
  }

  private processFiles(newFiles: File[]): void {
    // Obtenemos los archivos actuales en el FormControl
    const currentFiles = this.f.images.value || [];
    // Actualizamos el FormControl (aquí se disparará el validador síncrono 'arrayMinLengthValidator')
    this.productForm.patchValue({
      images: [...currentFiles, ...newFiles]
    });
    this.f.images.markAsTouched();
  }

  // Helpers para la UI de Certificaciones (Fila 5)
  hasCertification(cert: Certification): boolean {
    return this.f.certifications.value.includes(cert);
  }

  toggleCertification(cert: Certification): void {
    const current = this.f.certifications.value;
    const updated = current.includes(cert)
      ? current.filter(c => c !== cert)
      : [...current, cert];
    this.productForm.patchValue({ certifications: updated });
  }

}
