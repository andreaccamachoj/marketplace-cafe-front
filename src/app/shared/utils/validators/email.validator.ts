import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  return EMAIL_REGEX.test(value) ? null : { invalidEmail: true };
}
