import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BuyerDashboardComponent } from './buyer-dashboard.component';
import { PaymentMethodService } from '../../services/payment-method.service';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { ReviewService } from '../../services/review.service';
import { FavoritesService } from '../../services/favorites.service';
import { BuyerProfileService } from '../../services/buyer-profile.service';
import { ICartItem } from '../../models/cart.model';
import { IOrder } from '../../models/order.model';
import { IAddress, IAddressPayload } from '../../models/checkout.model';
import { IReview, IReviewPayload } from '../../models/review.model';
import { IFavorite } from '../../models/favorite.model';
import { IBuyerProfile, IBuyerPasswordPayload, IBuyerProfilePayload } from '../../models/buyer-profile.model';

/* ── Fixtures ── */

const MOCK_USER = {
  id: 'buyer-1',
  email: 'buyer@wcm.co',
  fullName: 'Ana García',
  roles: ['buyer' as any],
  status: 'active' as any,
  createdAt: '2025-01-01',
};

const MOCK_ITEM: ICartItem = {
  id: 'ci-1', productId: 'p-1', name: 'Café Sierra', producer: 'Finca El Edén',
  price: 45000, qty: 2, emoji: '☕', organic: false, fairTrade: false, maxStock: 10,
};

const MOCK_ORDER: IOrder = {
  id: 'ord-1', number: 'WCM-001', date: '2025-01-10', status: 'confirmed',
  subtotal: 90000, shippingAmount: 0, discountAmount: 0, total: 90000,
  address: 'Calle 10 #5-20', shippingOptionId: 'standard', buyerId: 'buyer-1',
  items: [{ productId: 'p-1', name: 'Café', productName: 'Café', qty: 2, unitPrice: 45000, subtotal: 90000, emoji: '☕' }],
  steps: [{ label: 'Confirmado', done: true, active: true }],
};

const MOCK_ADDRESS: IAddress = {
  id: 'addr-1', label: 'Casa', line1: 'Calle 10 #5-20', city: 'Bogotá',
  department: 'Cundinamarca', isDefault: true,
};

const MOCK_REVIEW: IReview = {
  id: 'rev-1', productId: 'p-1', productName: 'Café Sierra', productImageUrl: '',
  orderId: 'ord-1', buyerId: 'buyer-1', buyerName: 'Ana García', buyerInitials: 'AG',
  rating: 4, title: 'Muy bueno', body: 'Excelente sabor y aroma del café colombiano.',
  status: 'published', isVerifiedPurchase: true, helpfulCount: 0, createdAt: '2025-01-10T00:00:00Z',
};

const MOCK_FAVORITE: IFavorite = {
  id: 'fav-1', productId: 'p-2', productName: 'Café Nariño',
  productOrigin: 'Nariño', productPrice: 38000, productImageUrl: '',
  productRating: 4.2, productCategory: 'Arábica', addedAt: new Date().toISOString(),
};

const MOCK_PROFILE: IBuyerProfile = {
  id: 'buyer-1', fullName: 'Ana García', email: 'buyer@wcm.co', phone: '3001234567',
  city: 'Bogotá', department: 'Cundinamarca', preferredPayment: 'card',
  newsletterOptIn: false, avatarInitials: 'AG',
};

/* ── Test suite ── */

describe('BuyerDashboardComponent', () => {
  let fixture: ComponentFixture<BuyerDashboardComponent>;
  let component: BuyerDashboardComponent;

  /* service mocks */
  let cartItems: ReturnType<typeof signal<ICartItem[]>>;
  let cartCount: ReturnType<typeof signal<number>>;
  let cartTotal: ReturnType<typeof signal<number>>;
  let cartSubtotal: ReturnType<typeof signal<number>>;
  let cartShipping: ReturnType<typeof signal<number>>;
  let cartDiscount: ReturnType<typeof signal<number>>;
  let cartShippingId: ReturnType<typeof signal<string>>;
  let cartCoupon: ReturnType<typeof signal<string | null>>;

  let orderList: ReturnType<typeof signal<IOrder[]>>;
  let addrList: ReturnType<typeof signal<IAddress[]>>;
  let reviewList: ReturnType<typeof signal<IReview[]>>;
  let favList: ReturnType<typeof signal<IFavorite[]>>;
  let favCount: ReturnType<typeof signal<number>>;
  let profileVal: ReturnType<typeof signal<IBuyerProfile>>;
  let currentUser: ReturnType<typeof signal<typeof MOCK_USER | null>>;

  let cartSvc: jasmine.SpyObj<CartService>;
  let orderSvc: jasmine.SpyObj<OrderService>;
  let addrSvc: jasmine.SpyObj<AddressService>;
  let reviewSvc: jasmine.SpyObj<ReviewService>;
  let favSvc: jasmine.SpyObj<FavoritesService>;
  let profileSvc: jasmine.SpyObj<BuyerProfileService>;
  let authSvc: jasmine.SpyObj<AuthService>;
  let notifySvc: jasmine.SpyObj<NotificationService>;
  let paymentSvc: jasmine.SpyObj<PaymentMethodService>;

  beforeEach(async () => {
    /* signals for cart */
    cartItems     = signal<ICartItem[]>([MOCK_ITEM]);
    cartCount     = signal(2);
    cartTotal     = signal(90000);
    cartSubtotal  = signal(90000);
    cartShipping  = signal(0);
    cartDiscount  = signal(0);
    cartShippingId = signal('standard');
    cartCoupon    = signal<string | null>(null);

    /* signals for other services */
    orderList  = signal<IOrder[]>([MOCK_ORDER]);
    addrList   = signal<IAddress[]>([MOCK_ADDRESS]);
    reviewList = signal<IReview[]>([MOCK_REVIEW]);
    favList    = signal<IFavorite[]>([MOCK_FAVORITE]);
    favCount   = signal(1);
    profileVal = signal<IBuyerProfile>(MOCK_PROFILE);
    currentUser = signal<typeof MOCK_USER | null>(MOCK_USER);

    cartSvc = jasmine.createSpyObj('CartService', ['add', 'remove', 'updateQty', 'selectShipping', 'applyCoupon', 'removeCoupon', 'clear'], {
      items:           cartItems.asReadonly(),
      count:           cartCount.asReadonly(),
      total:           cartTotal.asReadonly(),
      subtotal:        cartSubtotal.asReadonly(),
      shipping:        cartShipping.asReadonly(),
      discount:        cartDiscount.asReadonly(),
      shippingOptionId: cartShippingId.asReadonly(),
      couponCode:      cartCoupon.asReadonly(),
    });
    cartSvc.applyCoupon.and.returnValue(true);

    orderSvc = jasmine.createSpyObj('OrderService', ['place', 'load', 'list', 'getById', 'markReviewSubmitted'], {
      orders: orderList.asReadonly(),
      all:    orderList.asReadonly(),
    });
    orderSvc.place.and.returnValue(of(MOCK_ORDER));
    orderSvc.load.and.stub();

    addrSvc = jasmine.createSpyObj('AddressService', ['setDefault', 'add', 'update', 'remove', 'load'], {
      addresses:      addrList.asReadonly(),
      defaultAddress: computed(() => addrList().find(a => a.isDefault) ?? null),
      count:          computed(() => addrList().length),
    });

    reviewSvc = jasmine.createSpyObj('ReviewService', ['add', 'update', 'remove', 'byBuyer', 'canReview', 'getByProductId'], {
      all:   computed(() => reviewList()),
      count: computed(() => reviewList().length),
    });
    reviewSvc.add.and.returnValue(of(MOCK_REVIEW));

    favSvc = jasmine.createSpyObj('FavoritesService', ['load', 'toggle', 'add', 'remove', 'isFavorite'], {
      all:   computed(() => favList()),
      count: computed(() => favCount()),
    });

    profileSvc = jasmine.createSpyObj('BuyerProfileService', ['update'], {
      profile: computed(() => profileVal()),
    });
    profileSvc.update.and.returnValue(of(MOCK_PROFILE));

    authSvc = jasmine.createSpyObj('AuthService', ['logout', 'changePassword', 'hasRole', 'updateProfile'], {
      currentUser:     currentUser,
      isAuthenticated: computed(() => currentUser() !== null),
      isBuyer:         computed(() => true),
      currentRole:     computed(() => 'buyer'),
    });
    authSvc.changePassword.and.returnValue(of(undefined as any));
    authSvc.logout.and.stub();

    notifySvc = jasmine.createSpyObj('NotificationService', ['success', 'error', 'info', 'show']);

    paymentSvc = jasmine.createSpyObj('PaymentMethodService', [], {
      paymentMethods: signal<any[]>([]).asReadonly(),
    });

    await TestBed.configureTestingModule({
      imports: [BuyerDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: CartService,         useValue: cartSvc     },
        { provide: OrderService,        useValue: orderSvc    },
        { provide: AddressService,      useValue: addrSvc     },
        { provide: ReviewService,       useValue: reviewSvc   },
        { provide: FavoritesService,    useValue: favSvc      },
        { provide: BuyerProfileService, useValue: profileSvc  },
        { provide: AuthService,         useValue: authSvc     },
        { provide: NotificationService, useValue: notifySvc   },
        { provide: PaymentMethodService, useValue: paymentSvc },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuyerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ── Initialization ── */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls favSvc.load() on ngOnInit', () => {
    expect(favSvc.load).toHaveBeenCalled();
  });

  it('initializes activeTab to "cart"', () => {
    expect(component.activeTab()).toBe('cart');
  });

  it('firstName is derived from currentUser fullName', () => {
    expect((component as any).firstName()).toBe('Ana');
  });

  /* ── Tabs ── */

  it('setTab changes activeTab', () => {
    component.setTab('orders');
    expect(component.activeTab()).toBe('orders');
  });

  it('setTabAndFilter sets tab and orderFilter together', () => {
    component.setTabAndFilter('orders', 'shipped');
    expect(component.activeTab()).toBe('orders');
    expect(component.orderFilter()).toBe('shipped');
  });

  /* ── Sidebar ── */

  it('toggleSidebar flips sidebarOpen', () => {
    expect(component.sidebarOpen()).toBeFalse();
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeTrue();
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeFalse();
  });

  /* ── Cart ── */

  it('cartItems reflects cartSvc.items', () => {
    expect(component.cartItems()).toEqual([MOCK_ITEM]);
  });

  it('onItemRemove calls cartSvc.remove', () => {
    component.onItemRemove('ci-1');
    expect(cartSvc.remove).toHaveBeenCalledWith('ci-1');
  });

  it('onQtyChange calls cartSvc.updateQty', () => {
    component.onQtyChange({ id: 'ci-1', qty: 3 });
    expect(cartSvc.updateQty).toHaveBeenCalledWith('ci-1', 3);
  });

  it('onShippingChange calls cartSvc.selectShipping', () => {
    component.onShippingChange('express');
    expect(cartSvc.selectShipping).toHaveBeenCalledWith('express');
  });

  it('onCouponApply calls cartSvc.applyCoupon and shows success toast when coupon is valid', () => {
    cartSvc.applyCoupon.and.returnValue(true);
    component.onCouponApply('CAFE10');
    expect(cartSvc.applyCoupon).toHaveBeenCalledWith('CAFE10');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('onCouponApply shows error toast when coupon is invalid', () => {
    cartSvc.applyCoupon.and.returnValue(false);
    component.onCouponApply('BADCODE');
    expect(notifySvc.error).toHaveBeenCalled();
  });

  it('onCouponRemove shows info notification', () => {
    component.onCouponRemove();
    expect(notifySvc.info).toHaveBeenCalled();
  });

  it('onAddressChange sets selectedAddressId', () => {
    component.onAddressChange('addr-2');
    expect(component.selectedAddressId()).toBe('addr-2');
  });

  /* ── Checkout ── */

  it('onCheckout opens checkout overlay', () => {
    component.onCheckout();
    expect(component.checkoutOpen()).toBeTrue();
  });

  it('handleCancelCheckout closes checkout overlay', () => {
    component.checkoutOpen.set(true);
    component.handleCancelCheckout();
    expect(component.checkoutOpen()).toBeFalse();
  });

  it('handleConfirmOrder calls orderSvc.place and shows success on next', () => {
    orderSvc.place.and.returnValue(of(MOCK_ORDER));
    component.handleConfirmOrder();
    expect(orderSvc.place).toHaveBeenCalled();
    expect(notifySvc.success).toHaveBeenCalled();
    expect(component.checkoutOpen()).toBeFalse();
    expect(component.checkoutConfirming()).toBeFalse();
  });

  /* ── Orders ── */

  it('orders reflects orderSvc.orders', () => {
    expect(component.orders()).toEqual([MOCK_ORDER]);
  });

  it('filteredOrders returns all orders when filter is "all"', () => {
    component.orderFilter.set('all');
    expect(component.filteredOrders()).toEqual([MOCK_ORDER]);
  });

  it('filteredOrders filters by status when filter is set', () => {
    component.orderFilter.set('shipped');
    expect(component.filteredOrders().length).toBe(0);
  });

  it('toggleOrder expands an order', () => {
    component.toggleOrder('ord-1');
    expect(component.expandedOrder()).toBe('ord-1');
  });

  it('toggleOrder collapses already-expanded order', () => {
    component.expandedOrder.set('ord-1');
    component.toggleOrder('ord-1');
    expect(component.expandedOrder()).toBeNull();
  });

  it('activeOrdersCount counts confirmed/preparing/shipped orders', () => {
    expect(component.activeOrdersCount()).toBe(1);
  });

  it('onOrderReviewClick opens review modal', () => {
    component.onOrderReviewClick({ orderId: 'ord-1', productId: 'p-1', productName: 'Café' });
    expect(component.reviewModalOpen()).toBeTrue();
    expect(component.reviewModalMode()).toBe('create');
  });

  /* ── Review modal ── */

  it('openCreateReview sets modal signals and opens modal', () => {
    component.openCreateReview('p-1', 'Café Sierra', 'ord-1');
    expect(component.reviewModalOpen()).toBeTrue();
    expect(component.reviewModalMode()).toBe('create');
    expect(component.reviewModalProduct()).toBe('Café Sierra');
    expect(component.reviewModalProductId()).toBe('p-1');
    expect(component.reviewModalOrderId()).toBe('ord-1');
  });

  it('openEditReview sets modal signals and opens modal', () => {
    component.openEditReview(MOCK_REVIEW);
    expect(component.reviewModalOpen()).toBeTrue();
    expect(component.reviewModalMode()).toBe('edit');
    expect(component.selectedReview()).toEqual(MOCK_REVIEW);
  });

  it('closeReviewModal closes the modal', () => {
    component.reviewModalOpen.set(true);
    component.closeReviewModal();
    expect(component.reviewModalOpen()).toBeFalse();
  });

  it('handleSaveReview in create mode calls reviewSvc.add and shows success', () => {
    component.openCreateReview('p-1', 'Café Sierra', 'ord-1');
    const payload: IReviewPayload = { productId: 'p-1', orderId: 'ord-1', rating: 5, title: 'Genial', body: 'Muy buen producto...' };
    component.handleSaveReview(payload);
    expect(reviewSvc.add).toHaveBeenCalled();
  });

  it('handleSaveReview in edit mode calls reviewSvc.update and shows success', () => {
    component.openEditReview(MOCK_REVIEW);
    const payload: IReviewPayload = { productId: 'p-1', orderId: 'ord-1', rating: 3, title: 'Ok', body: 'Está bien el café' };
    component.handleSaveReview(payload);
    expect(reviewSvc.update).toHaveBeenCalledWith('rev-1', { rating: 3, title: 'Ok', body: 'Está bien el café' });
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleDeleteReview calls reviewSvc.remove and shows success', () => {
    component.handleDeleteReview('rev-1');
    expect(reviewSvc.remove).toHaveBeenCalledWith('rev-1', 'buyer-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  /* ── Favorites ── */

  it('myFavorites reflects favSvc.all', () => {
    expect(component.myFavorites()).toEqual([MOCK_FAVORITE]);
  });

  it('handleRemoveFavorite calls favSvc.remove and shows success', () => {
    component.handleRemoveFavorite('p-2');
    expect(favSvc.remove).toHaveBeenCalledWith('p-2');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleAddFavoriteToCart calls cartSvc.add and shows success', () => {
    component.handleAddFavoriteToCart(MOCK_FAVORITE);
    expect(cartSvc.add).toHaveBeenCalled();
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleViewFavoriteProduct navigates to product page', () => {
    spyOn((component as any).router, 'navigate');
    component.handleViewFavoriteProduct('p-2');
    expect((component as any).router.navigate).toHaveBeenCalledWith(['/productos', 'p-2']);
  });

  /* ── Address CRUD ── */

  it('openAddressForm opens form and sets editingAddress to null for new', () => {
    component.openAddressForm(null);
    expect(component.addressFormOpen()).toBeTrue();
    expect(component.editingAddress()).toBeNull();
  });

  it('openAddressForm sets editingAddress when editing', () => {
    component.openAddressForm(MOCK_ADDRESS);
    expect(component.editingAddress()).toEqual(MOCK_ADDRESS);
  });

  it('closeAddressForm closes form and clears editingAddress', () => {
    component.openAddressForm(MOCK_ADDRESS);
    component.closeAddressForm();
    expect(component.addressFormOpen()).toBeFalse();
    expect(component.editingAddress()).toBeNull();
  });

  it('handleSaveAddress calls addrSvc.update when editing', () => {
    component.openAddressForm(MOCK_ADDRESS);
    const payload: IAddressPayload = { label: 'Casa', line1: 'Calle 10 #5-20', city: 'Bogotá', department: 'Cundinamarca' };
    component.handleSaveAddress(payload);
    expect(addrSvc.update).toHaveBeenCalledWith('addr-1', payload);
    expect(notifySvc.success).toHaveBeenCalled();
    expect(component.addressFormOpen()).toBeFalse();
  });

  it('handleSaveAddress calls addrSvc.add when creating new', () => {
    component.openAddressForm(null);
    const payload: IAddressPayload = { label: 'Oficina', line1: 'Carrera 7 #30-10', city: 'Bogotá', department: 'Cundinamarca' };
    component.handleSaveAddress(payload);
    expect(addrSvc.add).toHaveBeenCalledWith(payload);
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleDeleteAddress calls addrSvc.remove and shows success', () => {
    component.handleDeleteAddress('addr-1');
    expect(addrSvc.remove).toHaveBeenCalledWith('addr-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleSetDefaultAddress calls addrSvc.setDefault and shows success', () => {
    component.handleSetDefaultAddress('addr-1');
    expect(addrSvc.setDefault).toHaveBeenCalledWith('addr-1');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  /* ── Profile ── */

  it('profile reflects profileSvc.profile', () => {
    expect((component as any).profile()).toEqual(MOCK_PROFILE);
  });

  it('handleSaveProfile calls profileSvc.update and shows success', () => {
    const payload: IBuyerProfilePayload = {
      fullName: 'Ana García', phone: '3001234567', city: 'Bogotá',
      department: 'Cundinamarca', preferredPayment: 'card', newsletterOptIn: false,
    };
    component.handleSaveProfile(payload);
    expect(profileSvc.update).toHaveBeenCalledWith(payload);
    expect(notifySvc.success).toHaveBeenCalled();
  });

  it('handleSavePassword calls authSvc.changePassword and shows success', () => {
    const payload: IBuyerPasswordPayload = {
      currentPassword: 'OldPass#1', newPassword: 'NewPass#2', confirmNewPassword: 'NewPass#2',
    };
    component.handleSavePassword(payload);
    expect(authSvc.changePassword).toHaveBeenCalledWith('OldPass#1', 'NewPass#2');
    expect(notifySvc.success).toHaveBeenCalled();
  });

  /* ── Stats ── */

  it('stats computed aggregates data from services', () => {
    const stats = component.stats();
    expect(stats.totalOrders).toBe(1);
    expect(stats.cartItems).toBe(2);
    expect(stats.favorites).toBe(1);
  });

  /* ── Logout ── */

  it('logout calls authSvc.logout', () => {
    component.logout();
    expect(authSvc.logout).toHaveBeenCalled();
  });

  /* ── Reviews computed ── */

  it('myReviews filters reviews by buyerId', () => {
    expect(component.myReviews().length).toBe(1);
    expect(component.myReviews()[0].id).toBe('rev-1');
  });

  it('avgRating computes average of myReviews', () => {
    expect(component.avgRating()).toBe(4);
  });

  it('avgRating returns 0 when no reviews', () => {
    reviewList.set([]);
    fixture.detectChanges();
    expect(component.avgRating()).toBe(0);
  });
});
