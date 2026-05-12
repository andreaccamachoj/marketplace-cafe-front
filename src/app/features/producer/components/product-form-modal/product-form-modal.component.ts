import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { IManagedProduct, ManagedProductStatus } from '../../models/managed-product.model';
import { CategoryService } from '@features/catalog/services/category.service';
import { CertificationService } from '@features/catalog/services/certification.service';

type ProductUnit = '500g' | '1kg' | '5kg' | '10kg' | 'bolsa' | '250g';

interface ProductFormValue {
  name: FormControl<string>;
  origin: FormControl<string>;
  category: FormControl<string>;
  price: FormControl<number>;
  unit: FormControl<ProductUnit>;
  stock: FormControl<number>;
  status: FormControl<ManagedProductStatus>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './product-form-modal.component.html',
  styleUrl: './product-form-modal.component.scss',
})
export class ProductFormModalComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly categorySvc = inject(CategoryService);
  private readonly certificationSvc = inject(CertificationService);

  readonly categories = computed(() => this.categorySvc.categories());
  readonly availableCertifications = computed(() => this.certificationSvc.certifications());
  readonly selectedCertCodes = signal<string[]>([]);

  readonly mode    = input.required<'create' | 'edit' | 'view'>();
  readonly product = input<IManagedProduct | null>(null);
  readonly open    = input.required<boolean>();

  readonly closed = output<void>();
  readonly saved  = output<Partial<IManagedProduct>>();

  readonly form = new FormGroup<ProductFormValue>({
    name:        new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)] }),
    origin:      new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    category:    new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    price:       new FormControl<number>(0,  { nonNullable: true, validators: [Validators.required, Validators.min(1000), Validators.max(10_000_000)] }),
    unit:        new FormControl<ProductUnit>('500g', { nonNullable: true, validators: [Validators.required] }),
    stock:       new FormControl<number>(0,  { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(9999)] }),
    status:      new FormControl<ManagedProductStatus>('draft', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
  });

  readonly modalTitle = computed(() => {
    switch (this.mode()) {
      case 'create': return 'Nuevo Producto';
      case 'edit':   return 'Editar Producto';
      case 'view':   return 'Detalle del Producto';
    }
  });

  readonly submitLabel = computed(() => {
    return this.mode() === 'edit' ? 'Actualizar Producto' : 'Guardar Producto';
  });

  readonly isViewMode = computed(() => this.mode() === 'view');
  readonly isReadonly = signal(false);

  constructor() {
    effect(() => {
      const p = this.product();
      const m = this.mode();

      if (p) {
        this.form.patchValue({
          name:        p.name,
          origin:      p.region ?? '',
          category:    p.categoryId ?? '',
          price:       p.price,
          unit:        (p.unit as ProductUnit),
          stock:       p.stock,
          status:      p.status,
          description: p.description ?? '',
        });
        this.selectedCertCodes.set([...(p.certifications ?? [])]);
      } else {
        this.form.reset();
        this.selectedCertCodes.set([]);
      }

      if (m === 'view') {
        this.form.disable();
        this.isReadonly.set(true);
      } else {
        this.form.enable();
        this.isReadonly.set(false);
      }
    });
  }

  ngOnInit(): void {}

  get nameCtrl()        { return this.form.controls.name; }
  get originCtrl()      { return this.form.controls.origin; }
  get categoryCtrl()    { return this.form.controls.category; }
  get priceCtrl()       { return this.form.controls.price; }
  get unitCtrl()        { return this.form.controls.unit; }
  get stockCtrl()       { return this.form.controls.stock; }
  get statusCtrl()      { return this.form.controls.status; }
  get descriptionCtrl() { return this.form.controls.description; }

  isCertSelected(code: string): boolean {
    return this.selectedCertCodes().includes(code);
  }

  toggleCert(code: string): void {
    this.selectedCertCodes.update(codes =>
      codes.includes(code) ? codes.filter(c => c !== code) : [...codes, code]
    );
  }

  hasError(ctrl: AbstractControl | null): boolean {
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  getError(ctrl: AbstractControl | null): string {
    if (!ctrl || !ctrl.errors) return '';
    const e = ctrl.errors as ValidationErrors;
    if (e['required'])   return 'Este campo es obligatorio.';
    if (e['minlength'])  return `Mínimo ${(e['minlength'] as { requiredLength: number }).requiredLength} caracteres.`;
    if (e['maxlength'])  return `Máximo ${(e['maxlength'] as { requiredLength: number }).requiredLength} caracteres.`;
    if (e['min'])        return `El valor mínimo es ${(e['min'] as { min: number }).min}.`;
    if (e['max'])        return `El valor máximo es ${(e['max'] as { max: number }).max}.`;
    return 'Valor inválido.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const payload: Partial<IManagedProduct> = {
      name:           v.name,
      description:    v.description,
      region:         v.origin,
      categoryId:     v.category,
      price:          v.price,
      unit:           v.unit,
      stock:          v.stock,
      status:         v.status,
      certifications: this.selectedCertCodes(),
    };

    this.saved.emit(payload);
  }

  onClose(): void {
    this.form.reset();
    this.closed.emit();
  }
}
