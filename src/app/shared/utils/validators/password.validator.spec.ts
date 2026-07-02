import { FormControl } from '@angular/forms';
import { evaluatePasswordStrength, passwordStrengthValidator } from './password.validator';

describe('evaluatePasswordStrength', () => {
  it('returns score 0 for empty string', () => {
    const result = evaluatePasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('Muy débil');
  });

  it('returns score 1 for only min length met', () => {
    const result = evaluatePasswordStrength('abcdefgh');
    expect(result.score).toBe(1);
    expect(result.hasMinLength).toBeTrue();
    expect(result.hasUpperCase).toBeFalse();
    expect(result.hasNumber).toBeFalse();
    expect(result.hasSpecial).toBeFalse();
  });

  it('returns score 2 for length + uppercase', () => {
    const result = evaluatePasswordStrength('Abcdefgh');
    expect(result.score).toBe(2);
    expect(result.label).toBe('Regular');
  });

  it('returns score 3 for length + uppercase + number', () => {
    const result = evaluatePasswordStrength('Abcdefg1');
    expect(result.score).toBe(3);
    expect(result.label).toBe('Fuerte');
  });

  it('returns score 4 for all criteria met', () => {
    const result = evaluatePasswordStrength('Abcdef1!');
    expect(result.score).toBe(4);
    expect(result.label).toBe('Muy fuerte');
    expect(result.hasMinLength).toBeTrue();
    expect(result.hasUpperCase).toBeTrue();
    expect(result.hasNumber).toBeTrue();
    expect(result.hasSpecial).toBeTrue();
  });
});

describe('passwordStrengthValidator', () => {
  function control(value: string | null) {
    return new FormControl(value);
  }

  it('returns null for empty value', () => {
    expect(passwordStrengthValidator(control(''))).toBeNull();
  });

  it('returns null for null value', () => {
    expect(passwordStrengthValidator(control(null))).toBeNull();
  });

  it('returns null for strong password (score >= 2)', () => {
    expect(passwordStrengthValidator(control('Abcdefgh'))).toBeNull();
  });

  it('returns weakPassword error for very short password', () => {
    expect(passwordStrengthValidator(control('ab'))).toEqual({ weakPassword: true });
  });

  it('returns weakPassword error for only lowercase long password', () => {
    expect(passwordStrengthValidator(control('abcdefgh'))).toEqual({ weakPassword: true });
  });
});
