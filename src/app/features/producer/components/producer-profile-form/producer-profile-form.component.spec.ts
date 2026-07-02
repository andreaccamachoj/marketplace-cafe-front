import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducerProfileFormComponent } from './producer-profile-form.component';
import { IProducerProfile } from '../../models/producer-profile.model';

const MOCK_PROFILE: IProducerProfile = {
  id: 'prod-1', fullName: 'Carlos Ramírez', email: 'producer@wcm.co',
  phone: '3109876543', city: 'Medellín', department: 'Antioquia',
  bio: 'Caficultor con 15 años.', avatarInitials: 'CR',
};

describe('ProducerProfileFormComponent', () => {
  let fixture: ComponentFixture<ProducerProfileFormComponent>;
  let component: ProducerProfileFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerProfileFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProducerProfileFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', MOCK_PROFILE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('profileForm is hydrated from profile input', () => {
    expect(component['profileForm'].value.fullName).toBe('Carlos Ramírez');
    expect(component['profileForm'].value.phone).toBe('3109876543');
    expect(component['profileForm'].value.city).toBe('Medellín');
  });

  it('onSubmitProfile does nothing when form is pristine', () => {
    let emitted = false;
    component.saveProfile.subscribe(() => (emitted = true));
    component['onSubmitProfile']();
    expect(emitted).toBe(false);
  });

  it('onSubmitProfile emits payload when form is dirty and valid', () => {
    let payload: unknown;
    component.saveProfile.subscribe(p => (payload = p));
    component['profileForm'].controls['fullName'].setValue('Nuevo Nombre');
    component['profileForm'].markAsDirty();
    component['onSubmitProfile']();
    expect(payload).toBeTruthy();
  });

  it('onSubmitProfile does nothing when fullName is too short', () => {
    let emitted = false;
    component.saveProfile.subscribe(() => (emitted = true));
    component['profileForm'].controls['fullName'].setValue('AB');
    component['profileForm'].markAsDirty();
    component['onSubmitProfile']();
    expect(emitted).toBe(false);
  });

  it('passwordForm matchFieldValidator errors when passwords differ', () => {
    component['passwordForm'].controls['currentPassword'].setValue('OldPass#1');
    component['passwordForm'].controls['newPassword'].setValue('NewPass#1');
    component['passwordForm'].controls['confirmNewPassword'].setValue('Differs#1');
    expect(component['passwordForm'].errors?.['mismatch']).toBeTruthy();
  });

  it('onSubmitPassword does nothing when form is invalid', () => {
    let emitted = false;
    component.savePassword.subscribe(() => (emitted = true));
    component['onSubmitPassword']();
    expect(emitted).toBe(false);
  });

  it('onSubmitPassword emits and resets when form is valid', () => {
    let payload: unknown;
    component.savePassword.subscribe(p => (payload = p));
    component['passwordForm'].controls['currentPassword'].setValue('OldPass#1');
    component['passwordForm'].controls['newPassword'].setValue('NewPass#1');
    component['passwordForm'].controls['confirmNewPassword'].setValue('NewPass#1');
    component['onSubmitPassword']();
    expect(payload).toBeTruthy();
    expect(component['passwordForm'].pristine).toBe(true);
  });
});
