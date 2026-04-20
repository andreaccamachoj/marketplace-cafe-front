import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function arrayMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl<unknown[]>): ValidationErrors | null => {
    const value = control.value;
    if (!value || !Array.isArray(value)) {
      return { minLengthArray: { requiredLength: minLength, actualLength: 0 } };
    }
    return value.length >= minLength
      ? null
      : { minLengthArray: { requiredLength: minLength, actualLength: value.length } };
  };
}
