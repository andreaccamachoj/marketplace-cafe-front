import { TestBed } from '@angular/core/testing';
import { RegisterFlowState } from './register-flow.state';

describe('RegisterFlowState', () => {
  let state: RegisterFlowState;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RegisterFlowState] });
    state = TestBed.inject(RegisterFlowState);
  });

  it('initial step is 1', () => {
    expect(state.step()).toBe(1);
  });

  it('initial selectedRole is "buyer"', () => {
    expect(state.selectedRole()).toBe('buyer');
  });

  it('initial personalData is empty', () => {
    expect(state.personalData()).toEqual({});
  });

  it('next() sets step to 2', () => {
    state.next();
    expect(state.step()).toBe(2);
  });

  it('prev() sets step back to 1', () => {
    state.next();
    state.prev();
    expect(state.step()).toBe(1);
  });

  it('selectRole("producer") updates selectedRole', () => {
    state.selectRole('producer');
    expect(state.selectedRole()).toBe('producer');
  });

  it('selectRole("buyer") reverts to buyer', () => {
    state.selectRole('producer');
    state.selectRole('buyer');
    expect(state.selectedRole()).toBe('buyer');
  });

  it('savePersonalData() stores data', () => {
    const data = {
      firstName: 'Ana', lastName: 'García', email: 'ana@test.com',
      phone: '3001234567', password: 'Pass#2025', acceptTerms: true,
    };
    state.savePersonalData(data);
    expect(state.personalData()).toEqual(data);
  });

  it('reset() clears step, role and personalData', () => {
    state.next();
    state.selectRole('producer');
    state.savePersonalData({ firstName: 'X', lastName: 'Y', email: 'x@y.com', phone: '', password: 'P', acceptTerms: true });
    state.reset();
    expect(state.step()).toBe(1);
    expect(state.selectedRole()).toBe('buyer');
    expect(state.personalData()).toEqual({});
  });
});
