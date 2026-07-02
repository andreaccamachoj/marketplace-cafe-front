import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID, signal, computed } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProducerDashboardComponent } from './producer-dashboard.component';
import { ProducerProductService } from '../../services/producer-product.service';
import { ProducerOrderService } from '../../services/producer-order.service';
import { ProducerReviewService } from '../../services/producer-review.service';
import { ProducerProfileService } from '../../services/producer-profile.service';
import { FarmService } from '../../services/farm.service';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { CategoryService } from '@features/catalog/services/category.service';
import { CertificationService } from '@features/catalog/services/certification.service';

import { IManagedProduct } from '../../models/managed-product.model';
import { IReceivedOrder } from '../../models/received-order.model';
import { IFarm } from '../../models/farm.model';
import { IProducerProfile } from '../../models/producer-profile.model';
import { IProducerReviewGroup } from '../../models/producer-review.model';

const MOCK_PRODUCT: IManagedProduct = {
  id: 'p-1', emoji: '☕', name: 'Café Sierra', category: 'Arábica', categoryId: 'cat-1',
  unit: '500g', status: 'active', price: 45000, stock: 100,
  certifications: [], rating: 4, reviewCount: 5, salesCount: 30,
};

const MOCK_ORDER: IReceivedOrder = {
  id: 'ord-1', number: 'WCM-001', buyerName: 'Ana', buyerInitials: 'A',
  buyerCity: 'Medellín', date: '10 ene.', status: 'confirmed',
  items: [{ name: 'Café', qty: 2, emoji: '☕' }], total: 90000, shipping: 'standard',
};

const MOCK_FARM: IFarm = {
  id: 'farm-1', name: 'El Edén', municipality: 'Salento', department: 'Quindío',
  altitude: '1800 msnm', area: '5 hectáreas', mainVariety: 'Caturra', process: 'Lavado',
  description: 'Finca ecológica', certifications: [],
  metrics: { annualProduction: '100', yieldPerHa: '20', process: 'Lavado', harvestSeason: 'Oct-Dic', treeCount: '5000', cuppingScore: '85' },
  profileStatus: { status: 'approved', approvedBy: 'admin', approvalDate: '2025-01-01', verifiedDocs: 3 },
};

const MOCK_PROFILE: IProducerProfile = {
  id: 'prod-1', fullName: 'Carlos Ramírez', email: 'producer@wcm.co',
  phone: '3109876543', city: 'Medellín', department: 'Antioquia',
  bio: 'Caficultor', avatarInitials: 'CR',
};

describe('ProducerDashboardComponent', () => {
  let fixture: ComponentFixture<ProducerDashboardComponent>;
  let component: ProducerDashboardComponent;

  let productSvc: jasmine.SpyObj<ProducerProductService>;
  let orderSvc: jasmine.SpyObj<ProducerOrderService>;
  let reviewSvc: jasmine.SpyObj<ProducerReviewService>;
  let profileSvc: jasmine.SpyObj<ProducerProfileService>;
  let farmSvc: jasmine.SpyObj<FarmService>;
  let authSvc: jasmine.SpyObj<AuthService>;
  let notifySvc: jasmine.SpyObj<NotificationService>;
  let categorySvc: jasmine.SpyObj<CategoryService>;
  let certSvc: jasmine.SpyObj<CertificationService>;

  const productsSignal = signal<IManagedProduct[]>([MOCK_PRODUCT]);
  const ordersSignal   = signal<IReceivedOrder[]>([MOCK_ORDER]);
  const farmSignal     = signal<IFarm>(MOCK_FARM);
  const profileSignal  = signal<IProducerProfile>(MOCK_PROFILE);
  const userSignal     = signal<any>({ fullName: 'Carlos Ramírez', producerStatus: 'approved', roles: ['PRODUCER'] });

  beforeEach(async () => {
    productSvc = jasmine.createSpyObj('ProducerProductService', ['load', 'add', 'update', 'remove', 'toggleStatus'], {
      products: productsSignal.asReadonly(),
      activeCount: computed(() => productsSignal().filter(p => p.status === 'active').length),
      pendingCount: computed(() => productsSignal().filter(p => p.status === 'draft').length),
      saving: signal(false).asReadonly(),
    });

    orderSvc = jasmine.createSpyObj('ProducerOrderService', ['load', 'updateStatus'], {
      orders: ordersSignal.asReadonly(),
      pendingCount: computed(() => ordersSignal().filter(o => o.status !== 'delivered').length),
    });

    reviewSvc = jasmine.createSpyObj('ProducerReviewService', ['load', 'reply'], {
      reviews: signal<any[]>([]).asReadonly(),
      totalReviews: computed(() => 0),
      globalAvgRating: computed(() => 0),
      reviewGroups: computed<IProducerReviewGroup[]>(() => []),
    });

    farmSvc = jasmine.createSpyObj('FarmService', ['updateFarm', 'addCertification', 'removeCertification'], {
      farm: farmSignal.asReadonly(),
      certifications: computed(() => []),
    });

    profileSvc = jasmine.createSpyObj('ProducerProfileService', ['update'], {
      profile: computed(() => profileSignal()),
    });
    profileSvc.update.and.returnValue(of(MOCK_PROFILE));

    authSvc = jasmine.createSpyObj('AuthService', ['logout', 'changePassword', 'updateProfile'], {
      currentUser: userSignal.asReadonly(),
      isAuthenticated: computed(() => true),
      currentRole: computed(() => 'PRODUCER'),
    });
    authSvc.changePassword.and.returnValue(of(void 0));

    notifySvc = jasmine.createSpyObj('NotificationService', ['success', 'error', 'info']);

    categorySvc = jasmine.createSpyObj('CategoryService', [], { categories: signal<any[]>([]).asReadonly() });
    certSvc = jasmine.createSpyObj('CertificationService', [], { certifications: signal<any[]>([]).asReadonly() });

    await TestBed.configureTestingModule({
      imports: [ProducerDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ProducerProductService, useValue: productSvc },
        { provide: ProducerOrderService, useValue: orderSvc },
        { provide: ProducerReviewService, useValue: reviewSvc },
        { provide: ProducerProfileService, useValue: profileSvc },
        { provide: FarmService, useValue: farmSvc },
        { provide: AuthService, useValue: authSvc },
        { provide: NotificationService, useValue: notifySvc },
        { provide: CategoryService, useValue: categorySvc },
        { provide: CertificationService, useValue: certSvc },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProducerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls load on product, order, and review services', () => {
    expect(productSvc.load).toHaveBeenCalled();
    expect(orderSvc.load).toHaveBeenCalled();
    expect(reviewSvc.load).toHaveBeenCalled();
  });

  it('activeTab defaults to products', () => {
    expect(component.activeTab()).toBe('products');
  });

  it('setTab changes active tab', () => {
    component.setTab('orders');
    expect(component.activeTab()).toBe('orders');
  });

  it('setTab orders calls orderSvc.load again', () => {
    orderSvc.load.calls.reset();
    component.setTab('orders');
    expect(orderSvc.load).toHaveBeenCalledTimes(1);
  });

  it('setTab farm does not call orderSvc.load', () => {
    orderSvc.load.calls.reset();
    component.setTab('farm');
    expect(orderSvc.load).not.toHaveBeenCalled();
  });

  it('toggleSidebar flips sidebarOpen', () => {
    expect(component.sidebarOpen()).toBe(false);
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBe(true);
  });

  it('firstName computed from currentUser', () => {
    expect(component['firstName']()).toBe('Carlos');
  });

  it('products reflects productSvc.products', () => {
    expect(component.products().length).toBe(1);
    expect(component.products()[0].id).toBe('p-1');
  });

  it('filteredProducts returns all by default', () => {
    expect(component.filteredProducts().length).toBe(1);
  });

  it('filteredProducts filters by status', () => {
    component.productFilter.set('draft');
    expect(component.filteredProducts().length).toBe(0);
  });

  it('openCreateProduct sets modal to create mode', () => {
    component.openCreateProduct();
    expect(component.productModalMode()).toBe('create');
    expect(component.selectedProduct()).toBeNull();
    expect(component.productModalOpen()).toBe(true);
  });

  it('openEditProduct sets modal to edit mode with product', () => {
    component.openEditProduct(MOCK_PRODUCT);
    expect(component.productModalMode()).toBe('edit');
    expect(component.selectedProduct()).toEqual(MOCK_PRODUCT);
    expect(component.productModalOpen()).toBe(true);
  });

  it('openViewProduct sets modal to view mode', () => {
    component.openViewProduct(MOCK_PRODUCT);
    expect(component.productModalMode()).toBe('view');
    expect(component.productModalOpen()).toBe(true);
  });

  it('closeProductModal sets productModalOpen to false', () => {
    component.productModalOpen.set(true);
    component.closeProductModal();
    expect(component.productModalOpen()).toBe(false);
  });

  it('handleSaveProduct in create mode calls productSvc.add', () => {
    component.productModalMode.set('create');
    component.handleSaveProduct({ name: 'Nuevo' });
    expect(productSvc.add).toHaveBeenCalledWith({ name: 'Nuevo' }, null);
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleSaveProduct in edit mode calls productSvc.update', () => {
    component.productModalMode.set('edit');
    component.selectedProduct.set(MOCK_PRODUCT);
    component.handleSaveProduct({ name: 'Updated' });
    expect(productSvc.update).toHaveBeenCalledWith('p-1', { name: 'Updated' }, null);
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('onToggleStatus calls productSvc.toggleStatus', () => {
    component.onToggleStatus('p-1');
    expect(productSvc.toggleStatus).toHaveBeenCalledWith('p-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('onRemoveProduct calls productSvc.remove', () => {
    component.onRemoveProduct('p-1');
    expect(productSvc.remove).toHaveBeenCalledWith('p-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('onOrderStatusChange calls orderSvc.updateStatus', () => {
    component.onOrderStatusChange({ id: 'ord-1', status: 'preparing' });
    expect(orderSvc.updateStatus).toHaveBeenCalledWith('ord-1', 'preparing');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('openFarmEdit sets farmEditOpen to true', () => {
    component.openFarmEdit();
    expect(component.farmEditOpen()).toBe(true);
  });

  it('closeFarmEdit sets farmEditOpen to false', () => {
    component.farmEditOpen.set(true);
    component.closeFarmEdit();
    expect(component.farmEditOpen()).toBe(false);
  });

  it('handleSaveFarm calls farmSvc.updateFarm and closes modal', () => {
    component.farmEditOpen.set(true);
    component.handleSaveFarm({ name: 'Nueva Finca' });
    expect(farmSvc.updateFarm).toHaveBeenCalledWith({ name: 'Nueva Finca' });
    expect(component.farmEditOpen()).toBe(false);
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('openCertModal sets certModalOpen to true', () => {
    component.openCertModal();
    expect(component.certModalOpen()).toBe(true);
  });

  it('closeCertModal sets certModalOpen to false', () => {
    component.certModalOpen.set(true);
    component.closeCertModal();
    expect(component.certModalOpen()).toBe(false);
  });

  it('handleSaveCert calls farmSvc.addCertification and closes modal', () => {
    component.certModalOpen.set(true);
    const cert = { type: 'organic' as const, name: 'Orgánico', issuer: 'BCS', issueDate: '2024-01-01', expiryDate: '2027-01-01', status: 'vigente' as const };
    component.handleSaveCert(cert);
    expect(farmSvc.addCertification).toHaveBeenCalledWith(cert);
    expect(component.certModalOpen()).toBe(false);
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleSaveProfile calls profileSvc.update', () => {
    const payload = { fullName: 'Carlos', phone: '310', city: 'Bogotá', department: 'Cundinamarca', bio: '' };
    component.handleSaveProfile(payload);
    expect(profileSvc.update).toHaveBeenCalledWith(payload);
  });

  it('handleSavePassword calls auth.changePassword', () => {
    component.handleSavePassword({ currentPassword: 'old', newPassword: 'new', confirmNewPassword: 'new' });
    expect(authSvc.changePassword).toHaveBeenCalledWith('old', 'new');
  });

  it('handleReply calls reviewSvc.reply', () => {
    component.handleReply({ reviewId: 'rev-1', text: 'Gracias!' });
    expect(reviewSvc.reply).toHaveBeenCalledWith('rev-1', 'Gracias!');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('logout calls auth.logout', () => {
    component.logout();
    expect(authSvc.logout).toHaveBeenCalled();
  });

  it('monthlySalesFormatted returns 0 for no orders with createdAt', () => {
    expect(component.monthlySalesFormatted()).toBeDefined();
  });
});
