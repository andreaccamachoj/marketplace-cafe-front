import { FormControl } from '@angular/forms';
import { requiredFileValidator } from './required-file.validator';

describe('requiredFileValidator', () => {
  function control(value: unknown) {
    return new FormControl(value);
  }

  it('returns error for null value', () => {
    expect(requiredFileValidator(control(null))).toEqual({ requiredFile: true });
  });

  it('returns error for undefined value', () => {
    expect(requiredFileValidator(control(undefined))).toEqual({ requiredFile: true });
  });

  it('returns error for empty array', () => {
    expect(requiredFileValidator(control([]))).toEqual({ requiredFile: true });
  });

  it('returns null for non-empty array', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    expect(requiredFileValidator(control([file]))).toBeNull();
  });

  it('returns null for a truthy non-array value', () => {
    expect(requiredFileValidator(control('some-file-url'))).toBeNull();
  });
});
