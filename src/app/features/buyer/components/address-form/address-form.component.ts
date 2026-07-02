import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IAddress, IAddressPayload } from '../../models/checkout.model';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent {
  /** Null = modo creación; IAddress = modo edición (pre-rellena el form). */
  readonly address = input<IAddress | null>(null);
  readonly saving  = input<boolean>(false);

  readonly saved     = output<IAddressPayload>();
  readonly cancelled = output<void>();

  protected readonly form = new FormGroup({
    label: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
    }),
    line1: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(120)],
    }),
    line2: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(80)],
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    department: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    zipCode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.pattern(/^\d{0,6}$/)],
    }),
  });

  constructor() {
    // Hidratar el formulario al recibir una dirección para editar.
    effect(() => {
      const addr = this.address();
      if (addr) {
        this.form.patchValue({
          label:      addr.label,
          line1:      addr.line1,
          line2:      addr.line2 ?? '',
          city:       addr.city,
          department: addr.department,
          zipCode:    addr.zipCode ?? '',
        });
      } else {
        this.form.reset();
      }
      this.form.markAsPristine();
    });
  }

  /* ── Getters para acceso de errores en template ── */
  protected get label()      { return this.form.controls['label'];      }
  protected get line1()      { return this.form.controls['line1'];      }
  protected get line2()      { return this.form.controls['line2'];      }
  protected get city()       { return this.form.controls['city'];       }
  protected get department() { return this.form.controls['department']; }
  protected get zipCode()    { return this.form.controls['zipCode'];    }

  protected get isEditMode(): boolean { return this.address() !== null; }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const payload: IAddressPayload = {
      label:      raw.label,
      line1:      raw.line1,
      city:       raw.city,
      department: raw.department,
    };
    if (raw.line2)   payload.line2   = raw.line2;
    if (raw.zipCode) payload.zipCode = raw.zipCode;
    this.saved.emit(payload);
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }
}
