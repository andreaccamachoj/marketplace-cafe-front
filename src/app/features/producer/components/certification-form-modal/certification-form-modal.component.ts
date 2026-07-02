import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
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
import { ICertification, CertificationType, CertificationStatus } from '../../models/certification.model';

function expiryAfterIssueDateValidator(group: AbstractControl): ValidationErrors | null {
  const issue  = group.get('issueDate')?.value as string | undefined;
  const expiry = group.get('expiryDate')?.value as string | undefined;
  if (issue && expiry && new Date(expiry) <= new Date(issue)) {
    return { expiryBeforeIssue: true };
  }
  return null;
}

function issueDateNotFutureValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v = ctrl.value as string | undefined;
  if (v && new Date(v) > new Date()) {
    return { futureDate: true };
  }
  return null;
}

interface CertFormValue {
  type:       FormControl<CertificationType>;
  name:       FormControl<string>;
  issuer:     FormControl<string>;
  issueDate:  FormControl<string>;
  expiryDate: FormControl<string>;
  notes:      FormControl<string>;
}

export const CERT_TYPE_LABELS: Record<CertificationType, string> = {
  'organic':      'Café Orgánico',
  'utz':          'UTZ Certified',
  'fair-trade':   'Fairtrade Internacional',
  'rainforest':   'Rainforest Alliance',
  'bird-friendly':'Bird Friendly (Smithsonian)',
  'direct-trade': 'Direct Trade',
  'shade-grown':  'Shade Grown',
  'other':        'Otra certificación',
};

@Component({
  selector: 'app-certification-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './certification-form-modal.component.html',
  styleUrl: './certification-form-modal.component.scss',
})
export class CertificationFormModalComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly open = input.required<boolean>();

  readonly closed = output<void>();
  readonly saved  = output<Omit<ICertification, 'id'>>();

  readonly selectedFile = signal<File | null>(null);

  readonly certTypeEntries = Object.entries(CERT_TYPE_LABELS) as [CertificationType, string][];

  readonly form = new FormGroup<CertFormValue>(
    {
      type:       new FormControl<CertificationType>('organic', { nonNullable: true, validators: [Validators.required] }),
      name:       new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      issuer:     new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      issueDate:  new FormControl<string>('', { nonNullable: true, validators: [Validators.required, issueDateNotFutureValidator] }),
      expiryDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      notes:      new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(300)] }),
    },
    { validators: expiryAfterIssueDateValidator },
  );

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  get typeCtrl()       { return this.form.controls.type; }
  get nameCtrl()       { return this.form.controls.name; }
  get issuerCtrl()     { return this.form.controls.issuer; }
  get issueDateCtrl()  { return this.form.controls.issueDate; }
  get expiryDateCtrl() { return this.form.controls.expiryDate; }
  get notesCtrl()      { return this.form.controls.notes; }

  get hasDateRangeError(): boolean {
    return !!(this.form.errors?.['expiryBeforeIssue'] &&
      this.issueDateCtrl.touched &&
      this.expiryDateCtrl.touched);
  }

  hasError(ctrl: AbstractControl | null): boolean {
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  getError(ctrl: AbstractControl | null): string {
    if (!ctrl || !ctrl.errors) return '';
    const e = ctrl.errors as ValidationErrors;
    if (e['required'])    return 'Este campo es obligatorio.';
    if (e['minlength'])   return `Mínimo ${(e['minlength'] as { requiredLength: number }).requiredLength} caracteres.`;
    if (e['maxlength'])   return `Máximo ${(e['maxlength'] as { requiredLength: number }).requiredLength} caracteres.`;
    if (e['futureDate'])  return 'La fecha de emisión no puede ser futura.';
    return 'Valor inválido.';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  private computeStatus(expiryDate: string): CertificationStatus {
    const today    = new Date();
    const expiry   = new Date(expiryDate);
    const daysLeft = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 0)    return 'vencida';
    if (daysLeft <= 90)  return 'proximo-vencimiento';
    return 'vigente';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v      = this.form.getRawValue();
    const file   = this.selectedFile();
    const status = this.computeStatus(v.expiryDate);

    const cert: Omit<ICertification, 'id'> = {
      type:         v.type,
      name:         v.name,
      issuer:       v.issuer,
      issueDate:    v.issueDate,
      expiryDate:   v.expiryDate,
      status,
      notes:        v.notes || undefined,
      documentName: file ? file.name : undefined,
      documentUrl:  file && isPlatformBrowser(this.platformId)
                      ? URL.createObjectURL(file)
                      : undefined,
    };

    this.saved.emit(cert);
  }

  onClose(): void {
    this.form.reset({
      type:       'organic',
      name:       '',
      issuer:     '',
      issueDate:  '',
      expiryDate: '',
      notes:      '',
    });
    this.selectedFile.set(null);
    this.closed.emit();
  }
}
