import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchFieldValidator(controlName: string, matchControlName: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const control      = group.get(controlName);
    const matchControl = group.get(matchControlName);
    if (!control || !matchControl) return null;
    if (matchControl.errors && !matchControl.errors['mismatch']) return null;
    if (control.value !== matchControl.value) {
      matchControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      matchControl.setErrors(null);
      return null;
    }
  };
}
