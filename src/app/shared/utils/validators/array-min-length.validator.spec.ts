import { FormControl } from '@angular/forms';
import { arrayMinLengthValidator } from './array-min-length.validator';

describe('arrayMinLengthValidator', () => {
  it('returns null when array meets minimum length', () => {
    const ctrl = new FormControl(['a', 'b', 'c']);
    expect(arrayMinLengthValidator(3)(ctrl)).toBeNull();
  });

  it('returns null when array exceeds minimum length', () => {
    const ctrl = new FormControl(['a', 'b', 'c', 'd']);
    expect(arrayMinLengthValidator(2)(ctrl)).toBeNull();
  });

  it('returns error when array is empty', () => {
    const ctrl = new FormControl([]);
    expect(arrayMinLengthValidator(1)(ctrl)).toEqual({
      minLengthArray: { requiredLength: 1, actualLength: 0 },
    });
  });

  it('returns error when array is below minimum length', () => {
    const ctrl = new FormControl(['a']);
    expect(arrayMinLengthValidator(3)(ctrl)).toEqual({
      minLengthArray: { requiredLength: 3, actualLength: 1 },
    });
  });

  it('returns error for null value', () => {
    const ctrl = new FormControl(null);
    expect(arrayMinLengthValidator(1)(ctrl)).toEqual({
      minLengthArray: { requiredLength: 1, actualLength: 0 },
    });
  });

  it('returns error for non-array value', () => {
    const ctrl = new FormControl('not an array' as unknown as unknown[]);
    expect(arrayMinLengthValidator(1)(ctrl)).toEqual({
      minLengthArray: { requiredLength: 1, actualLength: 0 },
    });
  });
});
