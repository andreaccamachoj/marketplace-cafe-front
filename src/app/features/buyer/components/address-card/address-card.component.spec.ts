import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressCardComponent } from './address-card.component';
import { IAddress } from '../../models/checkout.model';

const MOCK_ADDRESS: IAddress = {
  id: 'addr-1',
  label: 'Casa',
  line1: 'Calle 10 # 5-20',
  line2: 'Apt 301',
  city: 'Bucaramanga',
  department: 'Santander',
  zipCode: '680001',
  isDefault: false,
};

describe('AddressCardComponent', () => {
  let fixture: ComponentFixture<AddressCardComponent>;
  let component: AddressCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AddressCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('address', MOCK_ADDRESS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives address input correctly', () => {
    expect(component.address()).toEqual(MOCK_ADDRESS);
  });

  it('emits setDefault with address id', () => {
    const emitted: string[] = [];
    component.setDefault.subscribe(v => emitted.push(v));
    component.setDefault.emit(MOCK_ADDRESS.id);
    expect(emitted).toEqual(['addr-1']);
  });

  it('emits edit with address object', () => {
    const emitted: IAddress[] = [];
    component.edit.subscribe(v => emitted.push(v));
    component.edit.emit(MOCK_ADDRESS);
    expect(emitted).toEqual([MOCK_ADDRESS]);
  });

  it('emits delete with address id', () => {
    const emitted: string[] = [];
    component.delete.subscribe(v => emitted.push(v));
    component.delete.emit(MOCK_ADDRESS.id);
    expect(emitted).toEqual(['addr-1']);
  });
});
