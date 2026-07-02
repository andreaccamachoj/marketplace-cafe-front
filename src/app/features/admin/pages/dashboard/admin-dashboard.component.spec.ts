import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID, signal, computed } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { ProducerApprovalService } from '../../services/producer-approval.service';
import { AdminUserService } from '../../services/admin-user.service';
import { AdminCategoryService } from '../../services/admin-category.service';
import { AdminActivityService } from '../../services/admin-activity.service';
import { AdminProductService, IAdminProduct } from '../../services/admin-product.service';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

import { IProducerApproval } from '../../models/producer-approval.model';
import { IAdminUser } from '../../models/admin-user.model';
import { IAdminCategory } from '../../models/admin-category.model';
import { IActivityItem } from '../../models/activity.model';

const MOCK_PRODUCER: IProducerApproval = {
  id: 'apr-1', producerName: 'Carlos Ramírez', farmName: 'El Edén',
  region: 'Eje Cafetero', department: 'Quindío', submittedAt: '2025-01-10T10:00:00Z',
  status: 'pending', documents: [], hectares: 5, mainVariety: 'Caturra',
  email: 'carlos@wcm.co', phone: '3109876543',
};

const MOCK_USER: IAdminUser = {
  id: 'u-1', fullName: 'Ana García', email: 'ana@wcm.co',
  role: 'buyer', status: 'active', joinedAt: '2025-01-10T10:00:00Z', avatarInitials: 'AG',
};

const MOCK_CAT: IAdminCategory = {
  id: 'cat-1', name: 'Arábica', slug: 'arabica', description: 'Premium',
  productCount: 5, active: true, createdAt: '2025-01-01', iconEmoji: '☕',
};

const MOCK_PRODUCT: IAdminProduct = {
  id: 'p-1', emoji: '☕', name: 'Café Sierra', category: 'Arábica',
  producer: 'Carlos', price: 45000, stock: 100, status: 'draft',
};

describe('AdminDashboardComponent', () => {
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let component: AdminDashboardComponent;

  let approvalSvc: jasmine.SpyObj<ProducerApprovalService>;
  let userSvc: jasmine.SpyObj<AdminUserService>;
  let categorySvc: jasmine.SpyObj<AdminCategoryService>;
  let activitySvc: jasmine.SpyObj<AdminActivityService>;
  let productSvc: jasmine.SpyObj<AdminProductService>;
  let authSvc: jasmine.SpyObj<AuthService>;
  let notifySvc: jasmine.SpyObj<NotificationService>;

  const producersSignal   = signal<IProducerApproval[]>([MOCK_PRODUCER]);
  const usersSignal       = signal<IAdminUser[]>([MOCK_USER]);
  const categoriesSignal  = signal<IAdminCategory[]>([MOCK_CAT]);
  const activitiesSignal  = signal<IActivityItem[]>([]);
  const productsSignal    = signal<IAdminProduct[]>([MOCK_PRODUCT]);
  const userSignal        = signal<any>({ fullName: 'Admin User', roles: ['ADMIN'] });

  beforeEach(async () => {
    approvalSvc = jasmine.createSpyObj('ProducerApprovalService', ['approve', 'reject', 'getById'], {
      all: producersSignal.asReadonly(),
      pending: computed(() => producersSignal().filter(p => p.status === 'pending')),
      pendingCount: computed(() => producersSignal().filter(p => p.status === 'pending').length),
    });
    approvalSvc.getById.and.callFake((id: string) => producersSignal().find(p => p.id === id));

    userSvc = jasmine.createSpyObj('AdminUserService', ['suspend', 'reactivate'], {
      all: usersSignal.asReadonly(),
      activeCount: computed(() => usersSignal().filter(u => u.status === 'active').length),
      suspendedCount: computed(() => usersSignal().filter(u => u.status === 'suspended').length),
    });

    categorySvc = jasmine.createSpyObj('AdminCategoryService', ['add', 'update', 'toggleActive', 'remove'], {
      all: categoriesSignal.asReadonly(),
    });

    activitySvc = jasmine.createSpyObj('AdminActivityService', ['addItem'], {
      all: activitiesSignal.asReadonly(),
      recent: computed(() => activitiesSignal().slice(0, 5)),
    });

    productSvc = jasmine.createSpyObj('AdminProductService', ['activate'], {
      all: productsSignal.asReadonly(),
      pendingCount: computed(() => productsSignal().filter(p => p.status === 'draft').length),
    });

    authSvc = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: userSignal.asReadonly(),
      isAuthenticated: computed(() => true),
      currentRole: computed(() => 'ADMIN'),
    });

    notifySvc = jasmine.createSpyObj('NotificationService', ['success', 'error', 'info']);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ProducerApprovalService, useValue: approvalSvc },
        { provide: AdminUserService, useValue: userSvc },
        { provide: AdminCategoryService, useValue: categorySvc },
        { provide: AdminActivityService, useValue: activitySvc },
        { provide: AdminProductService, useValue: productSvc },
        { provide: AuthService, useValue: authSvc },
        { provide: NotificationService, useValue: notifySvc },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('activeTab defaults to overview', () => {
    expect(component['activeTab']()).toBe('overview');
  });

  it('setTab changes active tab', () => {
    component.setTab('users');
    expect(component['activeTab']()).toBe('users');
  });

  it('toggleSidebar flips sidebarOpen', () => {
    expect(component.sidebarOpen()).toBe(false);
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBe(true);
  });

  it('adminName computed from currentUser', () => {
    expect(component['adminName']()).toBe('Admin');
  });

  it('stats computed reflects service signals', () => {
    const stats = component['stats']();
    expect(stats.totalUsers).toBe(1);
    expect(stats.pendingProducers).toBe(1);
    expect(stats.totalCategories).toBe(1);
  });

  it('allProducers reflects approvalSvc.all', () => {
    expect(component['allProducers']().length).toBe(1);
  });

  it('filteredProducers returns all by default', () => {
    expect(component['filteredProducers']().length).toBe(1);
  });

  it('filteredProducers filters by status', () => {
    component['producerFilter'].set('approved');
    expect(component['filteredProducers']().length).toBe(0);
    component['producerFilter'].set('pending');
    expect(component['filteredProducers']().length).toBe(1);
  });

  /* ── Producer actions ── */
  it('openProducerDetail sets selectedProducer and opens modal', () => {
    component.openProducerDetail(MOCK_PRODUCER);
    expect(component['selectedProducer']()).toEqual(MOCK_PRODUCER);
    expect(component['producerModalOpen']()).toBe(true);
  });

  it('closeProducerModal clears selectedProducer and closes modal', () => {
    component.openProducerDetail(MOCK_PRODUCER);
    component.closeProducerModal();
    expect(component['producerModalOpen']()).toBe(false);
    expect(component['selectedProducer']()).toBeNull();
  });

  it('handleQuickApprove calls approvalSvc.approve and notifies', () => {
    component.handleQuickApprove('apr-1');
    expect(approvalSvc.approve).toHaveBeenCalledWith('apr-1', 'Admin');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleQuickApprove does nothing when producer not found', () => {
    component.handleQuickApprove('nonexistent');
    expect(approvalSvc.approve).not.toHaveBeenCalled();
  });

  it('openRejectModal sets rejectTargetId and opens modal', () => {
    component.openRejectModal('apr-1');
    expect(component['rejectTargetId']()).toBe('apr-1');
    expect(component['rejectTargetName']()).toBe('Carlos Ramírez');
    expect(component['rejectModalOpen']()).toBe(true);
  });

  it('openRejectModal does nothing when producer not found', () => {
    component.openRejectModal('nonexistent');
    expect(component['rejectModalOpen']()).toBe(false);
  });

  it('handleRejectConfirmed calls approvalSvc.reject and closes modals', () => {
    component['rejectTargetId'].set('apr-1');
    component.handleRejectConfirmed('Documentos incompletos del productor solicitante');
    expect(approvalSvc.reject).toHaveBeenCalledWith('apr-1', 'Documentos incompletos del productor solicitante', 'Admin');
    expect(notifySvc.error).toHaveBeenCalled();
    expect(component['rejectModalOpen']()).toBe(false);
  });

  it('handleDetailRejected calls approvalSvc.reject', () => {
    component.handleDetailRejected({ id: 'apr-1', reason: 'Razón de rechazo del productor en detalle.' });
    expect(approvalSvc.reject).toHaveBeenCalledWith('apr-1', 'Razón de rechazo del productor en detalle.', 'Admin');
    expect(notifySvc.error).toHaveBeenCalled();
  });

  /* ── User actions ── */
  it('handleSuspendUser calls userSvc.suspend', () => {
    component.handleSuspendUser('u-1');
    expect(userSvc.suspend).toHaveBeenCalledWith('u-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleSuspendUser does nothing when user not found', () => {
    component.handleSuspendUser('nonexistent');
    expect(userSvc.suspend).not.toHaveBeenCalled();
  });

  it('handleReactivateUser calls userSvc.reactivate', () => {
    component.handleReactivateUser('u-1');
    expect(userSvc.reactivate).toHaveBeenCalledWith('u-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleReactivateUser does nothing when user not found', () => {
    component.handleReactivateUser('nonexistent');
    expect(userSvc.reactivate).not.toHaveBeenCalled();
  });

  /* ── Category actions ── */
  it('openCreateCategory sets selectedCategory=null and opens modal', () => {
    component.openCreateCategory();
    expect(component['selectedCategory']()).toBeNull();
    expect(component['categoryModalOpen']()).toBe(true);
  });

  it('openEditCategory sets selectedCategory and opens modal', () => {
    component.openEditCategory(MOCK_CAT);
    expect(component['selectedCategory']()).toEqual(MOCK_CAT);
    expect(component['categoryModalOpen']()).toBe(true);
  });

  it('closeCategoryModal clears selectedCategory and closes modal', () => {
    component.openEditCategory(MOCK_CAT);
    component.closeCategoryModal();
    expect(component['categoryModalOpen']()).toBe(false);
    expect(component['selectedCategory']()).toBeNull();
  });

  it('handleSaveCategory calls categorySvc.add in create mode', () => {
    component['selectedCategory'].set(null);
    component.handleSaveCategory({ name: 'Robusta', slug: 'robusta', description: 'desc', iconEmoji: '🌿', active: true });
    expect(categorySvc.add).toHaveBeenCalled();
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleSaveCategory calls categorySvc.update in edit mode', () => {
    component['selectedCategory'].set(MOCK_CAT);
    component.handleSaveCategory({ name: 'Arábica Premium' });
    expect(categorySvc.update).toHaveBeenCalledWith('cat-1', { name: 'Arábica Premium' });
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleToggleCategoryActive calls categorySvc.toggleActive', () => {
    component.handleToggleCategoryActive('cat-1');
    expect(categorySvc.toggleActive).toHaveBeenCalledWith('cat-1');
  });

  it('handleDeleteCategory calls categorySvc.remove and notifies', () => {
    component.handleDeleteCategory('cat-1');
    expect(categorySvc.remove).toHaveBeenCalledWith('cat-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleDeleteCategory does nothing when category not found', () => {
    component.handleDeleteCategory('nonexistent');
    expect(categorySvc.remove).not.toHaveBeenCalled();
  });

  /* ── Product actions ── */
  it('handleActivateProduct calls productSvc.activate', () => {
    component.handleActivateProduct('p-1');
    expect(productSvc.activate).toHaveBeenCalledWith('p-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleActivateProduct does nothing when product not found', () => {
    component.handleActivateProduct('nonexistent');
    expect(productSvc.activate).not.toHaveBeenCalled();
  });

  it('logout calls auth.logout', () => {
    component.logout();
    expect(authSvc.logout).toHaveBeenCalled();
  });
});
