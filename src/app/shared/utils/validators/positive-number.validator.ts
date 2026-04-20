import { AbstractControl, ValidationErrors } from '@angular/forms';

export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value);
  if (control.value === null || control.value === '') return null;
  return value >= 0 ? null : { negativeNumber: true };
}
