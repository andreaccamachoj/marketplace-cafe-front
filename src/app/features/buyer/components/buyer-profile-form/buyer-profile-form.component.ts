import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IBuyerProfile,
  IBuyerPasswordPayload,
  IBuyerProfilePayload,
} from '../../models/buyer-profile.model';
import { matchFieldValidator } from '@shared/utils/validators/match-field.validator';
import { passwordStrengthValidator } from '@shared/utils/validators/password.validator';

@Component({
  selector: 'app-buyer-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './buyer-profile-form.component.html',
  styleUrl: './buyer-profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyerProfileFormComponent {
  readonly profile         = input.required<IBuyerProfile>();
  readonly loading         = input<boolean>(false);
  readonly passwordLoading = input<boolean>(false);

  readonly save         = output<IBuyerProfilePayload>();
  readonly savePassword = output<IBuyerPasswordPayload>();

  /* ── Profile form ── */
  protected readonly profileForm = new FormGroup({
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

  /* ── Password form ── */
  protected readonly passwordForm = new FormGroup(
    {
      currentPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, passwordStrengthValidator],
      }),
      confirmNewPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [matchFieldValidator('newPassword', 'confirmNewPassword')] },
  );

  protected readonly showCurrentPwd = signal(false);
  protected readonly showNewPwd     = signal(false);
  protected readonly showConfirmPwd = signal(false);

  constructor() {
    // Hydrate profile form whenever the input signal changes.
    effect(() => {
      const p = this.profile();
      this.profileForm.patchValue({
        fullName:         p.fullName,
        phone:            p.phone,
        city:             p.city,
        department:       p.department,
        preferredPayment: p.preferredPayment,
        newsletterOptIn:  p.newsletterOptIn,
      });
      this.profileForm.markAsPristine();
    });
  }

  /* ── Getters for template error access ── */
  protected get fullName()   { return this.profileForm.controls['fullName'];   }
  protected get phone()      { return this.profileForm.controls['phone'];      }
  protected get city()       { return this.profileForm.controls['city'];       }
  protected get department() { return this.profileForm.controls['department']; }

  protected get currentPassword()    { return this.passwordForm.controls['currentPassword'];    }
  protected get newPassword()        { return this.passwordForm.controls['newPassword'];        }
  protected get confirmNewPassword() { return this.passwordForm.controls['confirmNewPassword']; }

  /* ── Submit handlers ── */
  protected onSubmitProfile(): void {
    if (this.profileForm.invalid || this.profileForm.pristine) return;
    this.save.emit(this.profileForm.getRawValue());
  }

  protected onSubmitPassword(): void {
    if (this.passwordForm.invalid) return;
    this.savePassword.emit(this.passwordForm.getRawValue() as IBuyerPasswordPayload);
    this.passwordForm.reset();
  }
}
