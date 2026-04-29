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
  IProducerProfile,
  IProducerPasswordPayload,
  IProducerProfilePayload,
} from '../../models/producer-profile.model';
import { matchFieldValidator } from '@shared/utils/validators/match-field.validator';
import { passwordStrengthValidator } from '@shared/utils/validators/password.validator';

@Component({
  selector: 'app-producer-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './producer-profile-form.component.html',
  styleUrl: './producer-profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducerProfileFormComponent {
  readonly profile         = input.required<IProducerProfile>();
  readonly loading         = input<boolean>(false);
  readonly passwordLoading = input<boolean>(false);

  readonly saveProfile  = output<IProducerProfilePayload>();
  readonly savePassword = output<IProducerPasswordPayload>();

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
    bio: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
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
        fullName:   p.fullName,
        phone:      p.phone,
        city:       p.city,
        department: p.department,
        bio:        p.bio,
      });
      this.profileForm.markAsPristine();
    });
  }

  /* ── Getters for template error access ── */
  protected get fullName()   { return this.profileForm.controls['fullName'];   }
  protected get phone()      { return this.profileForm.controls['phone'];      }
  protected get city()       { return this.profileForm.controls['city'];       }
  protected get department() { return this.profileForm.controls['department']; }
  protected get bio()        { return this.profileForm.controls['bio'];        }

  protected get currentPassword()   { return this.passwordForm.controls['currentPassword'];   }
  protected get newPassword()       { return this.passwordForm.controls['newPassword'];       }
  protected get confirmNewPassword(){ return this.passwordForm.controls['confirmNewPassword']; }

  protected get bioLength(): number {
    return this.bio.value.length;
  }

  /* ── Submit handlers ── */
  protected onSubmitProfile(): void {
    if (this.profileForm.invalid || this.profileForm.pristine) return;
    this.saveProfile.emit(this.profileForm.getRawValue());
  }

  protected onSubmitPassword(): void {
    if (this.passwordForm.invalid) return;
    this.savePassword.emit(this.passwordForm.getRawValue() as IProducerPasswordPayload);
    this.passwordForm.reset();
  }
}
