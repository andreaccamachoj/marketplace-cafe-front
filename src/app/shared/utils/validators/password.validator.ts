import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface IPasswordStrength {
  score: number;
  label: string;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePasswordStrength(password: string): IPasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber    = /\d/.test(password);
  const hasSpecial   = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const score = [hasMinLength, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;
  const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];

  return { score, label: labels[score] ?? 'Muy débil', hasMinLength, hasUpperCase, hasNumber, hasSpecial };
}

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) return null;
  const { score } = evaluatePasswordStrength(value);
  return score >= 2 ? null : { weakPassword: true };
}
