import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleSpecificStepComponent } from './role-specific-step.component';

describe('RoleSpecificStepComponent', () => {
  let fixture: ComponentFixture<RoleSpecificStepComponent>;
  let component: RoleSpecificStepComponent;
  let el: HTMLElement;

  function create(role: 'buyer' | 'producer') {
    fixture   = TestBed.createComponent(RoleSpecificStepComponent);
    component = fixture.componentInstance;
    component.role = role;
    component.ngOnChanges();
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RoleSpecificStepComponent] }).compileComponents();
  });

  it('renders producer fields when role is producer', () => {
    create('producer');
    expect(el.querySelector('#farm-name')).toBeTruthy();
    expect(el.querySelector('#farm-region')).toBeTruthy();
    expect(el.querySelector('#hectares')).toBeTruthy();
  });

  it('renders buyer fields when role is buyer', () => {
    create('buyer');
    expect(el.querySelector('#country')).toBeTruthy();
    expect(el.querySelector('#company-name')).toBeTruthy();
  });

  it('does not render producer fields when role is buyer', () => {
    create('buyer');
    expect(el.querySelector('#farm-name')).toBeNull();
  });

  it('does not render buyer fields when role is producer', () => {
    create('producer');
    expect(el.querySelector('#country')).toBeNull();
  });

  it('submit button is disabled when producer form is empty', () => {
    create('producer');
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBeTrue();
  });

  it('submit button is disabled when buyer form is empty', () => {
    create('buyer');
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBeTrue();
  });

  it('shows farmName error on submit with empty producer form', () => {
    create('producer');
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    const alerts = Array.from(el.querySelectorAll('[role="alert"]')).map(e => e.textContent);
    expect(alerts.some(a => a?.includes('nombre de la finca'))).toBeTrue();
  });

  it('shows country error on submit with empty buyer form', () => {
    create('buyer');
    component['form'].markAllAsTouched();
    fixture.detectChanges();
    const alerts = Array.from(el.querySelectorAll('[role="alert"]')).map(e => e.textContent);
    expect(alerts.some(a => a?.includes('país es requerido'))).toBeTrue();
  });

  it('emits submitted with producer data on valid producer form', () => {
    create('producer');
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);

    const farmInput = el.querySelector<HTMLInputElement>('#farm-name')!;
    farmInput.value = 'Finca El Paraíso';
    farmInput.dispatchEvent(new Event('input'));

    const regionSelect = el.querySelector<HTMLSelectElement>('#farm-region')!;
    regionSelect.value = 'Huila';
    regionSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ farmName: 'Finca El Paraíso', region: 'Huila' }));
  });

  it('emits submitted with buyer data on valid buyer form', () => {
    create('buyer');
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);

    const countrySelect = el.querySelector<HTMLSelectElement>('#country')!;
    countrySelect.value = 'Colombia';
    countrySelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();

    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ country: 'Colombia' }));
  });

  it('emits back when back button is clicked', () => {
    create('buyer');
    const spy = jasmine.createSpy('back');
    component.back.subscribe(spy);
    el.querySelector<HTMLButtonElement>('.btn-back')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('does not emit submitted when form is invalid', () => {
    create('producer');
    const spy = jasmine.createSpy('submitted');
    component.submitted.subscribe(spy);
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('rebuilds form when role changes from buyer to producer', () => {
    create('buyer');
    fixture.componentRef.setInput('role', 'producer');
    fixture.detectChanges();
    expect(el.querySelector('#farm-name')).toBeTruthy();
  });
});
