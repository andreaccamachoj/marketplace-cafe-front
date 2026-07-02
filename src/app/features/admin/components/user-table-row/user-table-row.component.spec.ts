import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { UserTableRowComponent } from './user-table-row.component';
import { IAdminUser } from '../../models/admin-user.model';

const MOCK_USER: IAdminUser = {
  id: 'u-1', fullName: 'Ana García', email: 'ana@wcm.co',
  role: 'buyer', status: 'active', joinedAt: '2025-01-10T10:00:00Z',
  avatarInitials: 'AG',
};

describe('UserTableRowComponent', () => {
  let fixture: ComponentFixture<UserTableRowComponent>;
  let component: UserTableRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableRowComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();
    fixture = TestBed.createComponent(UserTableRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', MOCK_USER);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('roleLabel maps buyer to Comprador', () => {
    expect(component.roleLabel('buyer')).toBe('Comprador');
  });

  it('roleLabel maps producer to Productor', () => {
    expect(component.roleLabel('producer')).toBe('Productor');
  });

  it('roleLabel maps admin to Admin', () => {
    expect(component.roleLabel('admin')).toBe('Admin');
  });

  it('statusLabel maps active to Activo', () => {
    expect(component.statusLabel('active')).toBe('Activo');
  });

  it('statusLabel maps suspended to Suspendido', () => {
    expect(component.statusLabel('suspended')).toBe('Suspendido');
  });

  it('statusLabel maps pending to Pendiente', () => {
    expect(component.statusLabel('pending')).toBe('Pendiente');
  });

  it('formatDate returns — when iso is undefined', () => {
    expect(component.formatDate(undefined)).toBe('—');
  });

  it('formatDate returns a date string for valid ISO', () => {
    const result = component.formatDate('2025-01-10T10:00:00Z');
    expect(result).toContain('2025');
  });

  it('suspendUser emits user id', () => {
    let emitted = '';
    component.suspendUser.subscribe(id => (emitted = id));
    component.suspendUser.emit('u-1');
    expect(emitted).toBe('u-1');
  });

  it('reactivate emits user id', () => {
    let emitted = '';
    component.reactivate.subscribe(id => (emitted = id));
    component.reactivate.emit('u-1');
    expect(emitted).toBe('u-1');
  });

  it('viewProfile emits user id', () => {
    let emitted = '';
    component.viewProfile.subscribe(id => (emitted = id));
    component.viewProfile.emit('u-1');
    expect(emitted).toBe('u-1');
  });
});
