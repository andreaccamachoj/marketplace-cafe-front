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
import { IBuyerProfile, IBuyerProfilePayload } from '../../models/buyer-profile.model';

@Component({
  selector: 'app-buyer-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './buyer-profile-form.component.html',
  styleUrl: './buyer-profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerProfileFormComponent {
  readonly profile = input.required<IBuyerProfile>();
  readonly loading = input<boolean>(false);
  readonly save    = output<IBuyerProfilePayload>();

  protected readonly form = new FormGroup({
    fullName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    preferredPayment: new FormControl<'card' | 'transfer' | 'cash_on_delivery'>('card', {
      nonNullable: true,
    }),
    newsletterOptIn: new FormControl<boolean>(false, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const p = this.profile();
      this.form.patchValue({
        fullName:         p.fullName,
        phone:            p.phone,
        city:             p.city,
        department:       p.department,
        preferredPayment: p.preferredPayment,
        newsletterOptIn:  p.newsletterOptIn,
      });
      this.form.markAsPristine();
    });
  }

  protected get fullName()   { return this.form.controls['fullName']; }
  protected get phone()      { return this.form.controls['phone']; }
  protected get city()       { return this.form.controls['city']; }
  protected get department() { return this.form.controls['department']; }

  protected onSubmit(): void {
    if (this.form.invalid || this.form.pristine) return;
    this.save.emit(this.form.getRawValue());
  }
}
