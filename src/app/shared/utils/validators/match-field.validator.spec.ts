import { FormControl, FormGroup } from '@angular/forms';
import { matchFieldValidator } from './match-field.validator';

describe('matchFieldValidator', () => {
  function makeGroup(password: string, confirm: string) {
    return new FormGroup(
      {
        password: new FormControl(password),
        confirm: new FormControl(confirm),
      },
      { validators: matchFieldValidator('password', 'confirm') }
    );
  }

  it('returns null when fields match', () => {
    const group = makeGroup('abc123', 'abc123');
    expect(group.errors).toBeNull();
  });

  it('returns mismatch error when fields differ', () => {
    const group = makeGroup('abc123', 'different');
    expect(group.errors).toEqual({ mismatch: true });
  });

  it('sets mismatch error on matchControl when fields differ', () => {
    const group = makeGroup('abc123', 'different');
    expect(group.get('confirm')?.errors).toEqual({ mismatch: true });
  });

  it('clears mismatch error on matchControl when fields match', () => {
    const group = makeGroup('abc123', 'abc123');
    expect(group.get('confirm')?.errors).toBeNull();
  });

  it('returns null when control name does not exist', () => {
    const group = new FormGroup(
      { password: new FormControl('abc') },
      { validators: matchFieldValidator('password', 'nonexistent') }
    );
    expect(group.errors).toBeNull();
  });

  it('returns null when matchControl has other errors (not mismatch)', () => {
    const group = new FormGroup(
      {
        password: new FormControl('abc123'),
        confirm: new FormControl('other'),
      },
      { validators: matchFieldValidator('password', 'confirm') }
    );
    group.get('confirm')!.setErrors({ required: true });
    group.updateValueAndValidity();
    expect(group.get('confirm')?.errors).not.toBeNull();
  });
});
