import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressFormComponent } from './address-form.component';
import { IAddress, IAddressPayload } from '../../models/checkout.model';

const MOCK_ADDRESS: IAddress = {
  id: 'addr-1',
  label: 'Oficina',
  line1: 'Carrera 15 # 93-47',
  line2: 'Piso 3',
  city: 'Bogotá',
  department: 'Cundinamarca',
  zipCode: '110221',
  isDefault: false,
};

describe('AddressFormComponent', () => {
  let fixture: ComponentFixture<AddressFormComponent>;
  let component: AddressFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts in creation mode when no address input', () => {
    expect((component as any).isEditMode).toBeFalse();
  });

  it('switches to edit mode when address input is set', () => {
    fixture.componentRef.setInput('address', MOCK_ADDRESS);
    fixture.detectChanges();
    expect((component as any).isEditMode).toBeTrue();
  });

  it('populates form when address input is provided', () => {
    fixture.componentRef.setInput('address', MOCK_ADDRESS);
    fixture.detectChanges();
    expect(component['form'].value.label).toBe('Oficina');
    expect(component['form'].value.city).toBe('Bogotá');
  });

  it('form is invalid when required fields are empty', () => {
    expect(component['form'].invalid).toBeTrue();
  });

  it('form is valid when all required fields are filled', () => {
    component['form'].setValue({
      label: 'Casa',
      line1: 'Calle 10 #5-20',
      line2: '',
      city: 'Medellín',
      department: 'Antioquia',
      zipCode: '',
    });
    expect(component['form'].valid).toBeTrue();
  });

  it('does not emit saved when form is invalid', () => {
    const emitted: IAddressPayload[] = [];
    component.saved.subscribe(v => emitted.push(v));
    (component as any).onSubmit();
    expect(emitted.length).toBe(0);
  });

  it('emits saved with payload when form is valid and submitted', () => {
    const emitted: IAddressPayload[] = [];
    component.saved.subscribe(v => emitted.push(v));
    component['form'].setValue({
      label: 'Casa',
      line1: 'Calle 10 #5-20',
      line2: '',
      city: 'Medellín',
      department: 'Antioquia',
      zipCode: '',
    });
    (component as any).onSubmit();
    expect(emitted.length).toBe(1);
    expect(emitted[0].label).toBe('Casa');
    expect(emitted[0].city).toBe('Medellín');
  });

  it('emits cancelled when onCancel is called', () => {
    let count = 0;
    component.cancelled.subscribe(() => count++);
    (component as any).onCancel();
    expect(count).toBe(1);
  });

  it('label field is invalid when shorter than 2 chars', () => {
    component['form'].get('label')!.setValue('A');
    expect(component['form'].get('label')!.invalid).toBeTrue();
  });

  it('zipCode field accepts only digits up to 6', () => {
    const ctrl = component['form'].get('zipCode')!;
    ctrl.setValue('ABC');
    expect(ctrl.invalid).toBeTrue();
    ctrl.setValue('110221');
    expect(ctrl.valid).toBeTrue();
  });
});
