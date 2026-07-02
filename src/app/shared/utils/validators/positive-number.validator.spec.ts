import { FormControl } from '@angular/forms';
import { positiveNumberValidator } from './positive-number.validator';

describe('positiveNumberValidator', () => {
  function control(value: number | string | null) {
    return new FormControl(value);
  }

  it('returns null for null value', () => {
    expect(positiveNumberValidator(control(null))).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(positiveNumberValidator(control(''))).toBeNull();
  });

  it('returns null for positive number', () => {
    expect(positiveNumberValidator(control(5))).toBeNull();
  });

  it('returns null for zero', () => {
    expect(positiveNumberValidator(control(0))).toBeNull();
  });

  it('returns negativeNumber error for negative number', () => {
    expect(positiveNumberValidator(control(-1))).toEqual({ negativeNumber: true });
  });

  it('returns negativeNumber error for negative decimal', () => {
    expect(positiveNumberValidator(control(-0.5))).toEqual({ negativeNumber: true });
  });

  it('returns null for numeric string positive', () => {
    expect(positiveNumberValidator(control('10'))).toBeNull();
  });

  it('returns negativeNumber error for numeric string negative', () => {
    expect(positiveNumberValidator(control('-3'))).toEqual({ negativeNumber: true });
  });
});
