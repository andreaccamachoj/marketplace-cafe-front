import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyerProfileFormComponent } from './buyer-profile-form.component';
import { IBuyerProfile, IBuyerPasswordPayload, IBuyerProfilePayload } from '../../models/buyer-profile.model';

const MOCK_PROFILE: IBuyerProfile = {
  id: 'buyer-1',
  fullName: 'Ana García',
  email: 'ana@example.com',
  phone: '3001234567',
  city: 'Bogotá',
  department: 'Cundinamarca',
  preferredPayment: 'card',
  newsletterOptIn: false,
  avatarInitials: 'AG',
};

describe('BuyerProfileFormComponent', () => {
  let fixture: ComponentFixture<BuyerProfileFormComponent>;
  let component: BuyerProfileFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerProfileFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BuyerProfileFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', MOCK_PROFILE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hydrates profileForm from profile input', () => {
    expect(component['profileForm'].value.fullName).toBe('Ana García');
    expect(component['profileForm'].value.city).toBe('Bogotá');
  });

  it('profileForm is valid after hydration', () => {
    expect(component['profileForm'].valid).toBeTrue();
  });

  it('does not emit save when profileForm is invalid', () => {
    const emitted: IBuyerProfilePayload[] = [];
    component.save.subscribe(v => emitted.push(v));
    component['profileForm'].get('fullName')!.setValue('');
    (component as any).onSubmitProfile();
    expect(emitted.length).toBe(0);
  });

  it('does not emit save when profileForm is pristine', () => {
    const emitted: IBuyerProfilePayload[] = [];
    component.save.subscribe(v => emitted.push(v));
    // Form is pristine right after hydration
    (component as any).onSubmitProfile();
    expect(emitted.length).toBe(0);
  });

  it('emits save with payload when profileForm is valid and dirty', () => {
    const emitted: IBuyerProfilePayload[] = [];
    component.save.subscribe(v => emitted.push(v));
    component['profileForm'].get('phone')!.setValue('3109876543');
    component['profileForm'].markAsDirty();
    (component as any).onSubmitProfile();
    expect(emitted.length).toBe(1);
    expect(emitted[0].fullName).toBe('Ana García');
  });

  it('passwordForm is invalid when empty', () => {
    expect(component['passwordForm'].invalid).toBeTrue();
  });

  it('does not emit savePassword when passwordForm is invalid', () => {
    const emitted: IBuyerPasswordPayload[] = [];
    component.savePassword.subscribe(v => emitted.push(v));
    (component as any).onSubmitPassword();
    expect(emitted.length).toBe(0);
  });

  it('emits savePassword and resets form when passwordForm is valid', () => {
    const emitted: IBuyerPasswordPayload[] = [];
    component.savePassword.subscribe(v => emitted.push(v));
    component['passwordForm'].setValue({
      currentPassword: 'Cafe#2025',
      newPassword: 'NewCafe#2026',
      confirmNewPassword: 'NewCafe#2026',
    });
    (component as any).onSubmitPassword();
    expect(emitted.length).toBe(1);
    expect(emitted[0].currentPassword).toBe('Cafe#2025');
  });

  it('passwordForm is invalid when newPassword and confirmNewPassword do not match', () => {
    component['passwordForm'].setValue({
      currentPassword: 'Cafe#2025',
      newPassword: 'NewCafe#2026',
      confirmNewPassword: 'DifferentPass#2026',
    });
    expect(component['passwordForm'].invalid).toBeTrue();
  });

  it('loading defaults to false', () => {
    expect(component.loading()).toBeFalse();
  });

  it('passwordLoading defaults to false', () => {
    expect(component.passwordLoading()).toBeFalse();
  });
});
