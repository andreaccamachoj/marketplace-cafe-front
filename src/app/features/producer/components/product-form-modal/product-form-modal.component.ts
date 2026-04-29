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
  certOrganico: FormControl<boolean>;
  certFairtrade: FormControl<boolean>;
  certRainforest: FormControl<boolean>;
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

  readonly mode    = input.required<'create' | 'edit' | 'view'>();
  readonly product = input<IManagedProduct | null>(null);
  readonly open    = input.required<boolean>();

  readonly closed = output<void>();
  readonly saved  = output<Partial<IManagedProduct>>();

  readonly form = new FormGroup<ProductFormValue>({
    name:         new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)] }),
    origin:       new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    category:     new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    price:        new FormControl<number>(0,  { nonNullable: true, validators: [Validators.required, Validators.min(1000), Validators.max(10_000_000)] }),
    unit:         new FormControl<ProductUnit>('500g', { nonNullable: true, validators: [Validators.required] }),
    stock:        new FormControl<number>(0,  { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(9999)] }),
    status:       new FormControl<ManagedProductStatus>('draft', { nonNullable: true, validators: [Validators.required] }),
    description:  new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    certOrganico:   new FormControl<boolean>(false, { nonNullable: true }),
    certFairtrade:  new FormControl<boolean>(false, { nonNullable: true }),
    certRainforest: new FormControl<boolean>(false, { nonNullable: true }),
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
          name:          p.name,
          origin:        '',
          category:      p.category,
          price:         p.price,
          unit:          (p.unit as ProductUnit),
          stock:         p.stock,
          status:        p.status,
          description:   '',
          certOrganico:   p.certifications.includes('organico'),
          certFairtrade:  p.certifications.includes('fairtrade'),
          certRainforest: p.certifications.includes('rainforest'),
        });
      } else {
        this.form.reset();
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

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  get nameCtrl()        { return this.form.controls.name; }
  get originCtrl()      { return this.form.controls.origin; }
  get categoryCtrl()    { return this.form.controls.category; }
  get priceCtrl()       { return this.form.controls.price; }
  get unitCtrl()        { return this.form.controls.unit; }
  get stockCtrl()       { return this.form.controls.stock; }
  get statusCtrl()      { return this.form.controls.status; }
  get descriptionCtrl() { return this.form.controls.description; }

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
    const certs: ('organico' | 'fairtrade' | 'rainforest')[] = [];
    if (v.certOrganico)   certs.push('organico');
    if (v.certFairtrade)  certs.push('fairtrade');
    if (v.certRainforest) certs.push('rainforest');

    const payload: Partial<IManagedProduct> = {
      name:           v.name,
      category:       v.category,
      price:          v.price,
      unit:           v.unit,
      stock:          v.stock,
      status:         v.status,
      certifications: certs,
    };

    this.saved.emit(payload);
  }

  onClose(): void {
    this.form.reset();
    this.closed.emit();
  }
}
