import { AbstractControl, ValidationErrors } from '@angular/forms';

export function requiredFileValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return { requiredFile: true };
  }
  return null;
}
