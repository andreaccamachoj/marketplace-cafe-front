import { FormControl } from '@angular/forms';
import { emailValidator } from './email.validator';

describe('emailValidator', () => {
  function control(value: string | null) {
    return new FormControl(value);
  }

  it('returns null for empty string', () => {
    expect(emailValidator(control(''))).toBeNull();
  });

  it('returns null for null value', () => {
    expect(emailValidator(control(null))).toBeNull();
  });

  it('returns null for valid email', () => {
    expect(emailValidator(control('user@example.com'))).toBeNull();
  });

  it('returns null for email with subdomain', () => {
    expect(emailValidator(control('user@mail.example.co'))).toBeNull();
  });

  it('returns error for email without @', () => {
    expect(emailValidator(control('invalidemail.com'))).toEqual({ invalidEmail: true });
  });

  it('returns error for email without domain', () => {
    expect(emailValidator(control('user@'))).toEqual({ invalidEmail: true });
  });

  it('returns error for email without TLD of 2+ chars', () => {
    expect(emailValidator(control('user@example.c'))).toEqual({ invalidEmail: true });
  });

  it('returns error for email with spaces', () => {
    expect(emailValidator(control('user @example.com'))).toEqual({ invalidEmail: true });
  });

  it('returns error for plain text', () => {
    expect(emailValidator(control('notanemail'))).toEqual({ invalidEmail: true });
  });
});
