import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { ReviewService } from '../../services/review.service';
import { FavoritesService } from '../../services/favorites.service';
import { BuyerProfileService } from '../../services/buyer-profile.service';
import { CartItemRowComponent } from '../../components/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { FavoriteProductCardComponent } from '../../components/favorite-product-card/favorite-product-card.component';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';
import { ReviewFormModalComponent } from '../../components/review-form-modal/review-form-modal.component';
import { BuyerProfileFormComponent } from '../../components/buyer-profile-form/buyer-profile-form.component';
import { AddressCardComponent } from '../../components/address-card/address-card.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { IReview, IReviewPayload } from '../../models/review.model';
import { IFavorite } from '../../models/favorite.model';
import { IBuyerPasswordPayload, IBuyerProfilePayload } from '../../models/buyer-profile.model';
import { IAddress, IAddressPayload } from '../../models/checkout.model';

type BuyerTab = 'cart' | 'orders' | 'favorites' | 'reviews' | 'profile';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    DashboardNavComponent,
    CartItemRowComponent,
    CartSummaryComponent,
    OrderCardComponent,
    FavoriteProductCardComponent,
    ReviewCardComponent,
    ReviewFormModalComponent,
    BuyerProfileFormComponent,
    AddressCardComponent,
    AddressFormComponent,
  ],
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.scss',
})
export class BuyerDashboardComponent {
  protected readonly router      = inject(Router);
  private readonly auth          = inject(AuthService);
  protected readonly notify      = inject(NotificationService);
  protected readonly cartSvc     = inject(CartService);
  protected readonly orderSvc    = inject(OrderService);
  protected readonly addrSvc     = inject(AddressService);
  private readonly reviewSvc     = inject(ReviewService);
  private readonly favSvc        = inject(FavoritesService);
  private readonly profileSvc    = inject(BuyerProfileService);

  /* ── UI state ── */
  readonly sidebarOpen   = signal(false);
  readonly activeTab     = signal<BuyerTab>('cart');
  readonly orderFilter   = signal<string>('all');
  readonly expandedOrder = signal<string | null>(null);

  /* ── User ── */
  protected readonly firstName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Usuario',
  );

  /* ── Cart ── */
  readonly cartItems          = this.cartSvc.items;
  readonly cartCount          = this.cartSvc.count;
  readonly cartTotal          = this.cartSvc.total;
  readonly cartSubtotal       = this.cartSvc.subtotal;
  readonly cartShipping       = this.cartSvc.shipping;
  readonly cartDiscount       = this.cartSvc.discount;
  readonly selectedShippingId = this.cartSvc.shippingOptionId;
  readonly appliedCoupon      = this.cartSvc.couponCode;

  /* ── Address ── */
  readonly defaultAddress = this.addrSvc.defaultAddress;
  readonly addresses      = this.addrSvc.addresses;

  /* ── Address CRUD state ── */
  readonly addressFormOpen   = signal(false);
  readonly editingAddress    = signal<IAddress | null>(null);
  readonly addressSaving     = signal(false);

  /* ── Orders ── */
  readonly orders = this.orderSvc.orders;

  readonly activeOrdersCount = computed(() =>
    this.orders().filter(
      o => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'shipped',
    ).length,
  );

  readonly deliveredCount = computed(() =>
    this.orders().filter(
      o => o.status === 'delivered' || o.status === 'completed',
    ).length,
  );

  readonly orderFilters = [
    { label: 'Todos',      value: 'all'       },
    { label: 'En camino',  value: 'shipped'   },
    { label: 'Preparando', value: 'preparing' },
    { label: 'Entregados', value: 'delivered' },
    { label: 'Cancelados', value: 'cancelled' },
  ];

  readonly filteredOrders = computed(() => {
    const filter = this.orderFilter();
    return filter === 'all'
      ? this.orders()
      : this.orders().filter(o => o.status === filter);
  });

  /* ── Reviews ── */
  private readonly BUYER_ID = 'u-buyer-1';

  readonly myReviews = computed(() =>
    this.reviewSvc.all().filter(r => r.buyerId === this.BUYER_ID),
  );

  readonly avgRating = computed(() => {
    const reviews = this.myReviews();
    if (!reviews.length) return 0;
    return (
      Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
      ) / 10
    );
  });

  readonly reviewableProducts = computed(() => {
    const delivered = this.orderSvc.all().filter(
      o => o.status === 'delivered' || o.status === 'completed',
    );
    const reviewed = new Set(this.myReviews().map(r => r.productId));
    const seen = new Set<string>();
    const result: { productId: string; productName: string; orderId: string }[] = [];
    for (const order of delivered) {
      for (const item of order.items) {
        if (!reviewed.has(item.productId) && !seen.has(item.productId)) {
          result.push({
            productId:   item.productId,
            productName: item.productName,
            orderId:     order.id,
          });
          seen.add(item.productId);
        }
      }
    }
    return result;
  });

  /* ── Review modal state ── */
  readonly reviewModalOpen    = signal(false);
  readonly reviewModalMode    = signal<'create' | 'edit'>('create');
  readonly reviewModalProduct = signal('');
  readonly reviewModalOrderId = signal('');
  readonly selectedReview     = signal<IReview | null>(null);

  openCreateReview(productId: string, productName: string, orderId: string): void {
    void productId;
    this.selectedReview.set(null);
    this.reviewModalMode.set('create');
    this.reviewModalProduct.set(productName);
    this.reviewModalOrderId.set(orderId);
    this.reviewModalOpen.set(true);
  }

  openEditReview(review: IReview): void {
    this.selectedReview.set(review);
    this.reviewModalMode.set('edit');
    this.reviewModalProduct.set(review.productName);
    this.reviewModalOpen.set(true);
  }

  closeReviewModal(): void {
    this.reviewModalOpen.set(false);
  }

  handleSaveReview(payload: IReviewPayload): void {
    if (this.reviewModalMode() === 'create') {
      this.reviewSvc.add(
        {
          ...payload,
          productId: payload.productId
            || (this.reviewableProducts().find(
              p => p.productName === this.reviewModalProduct(),
            )?.productId ?? ''),
          orderId: payload.orderId || this.reviewModalOrderId(),
        },
        { id: this.BUYER_ID, name: 'Comprador Demo', initials: 'CD' },
        this.reviewModalProduct(),
        '',
      );
      this.notify.success('Reseña publicada correctamente');
    } else {
      const rev = this.selectedReview();
      if (rev) {
        this.reviewSvc.update(rev.id, {
          rating: payload.rating,
          title:  payload.title,
          body:   payload.body,
        });
      }
      this.notify.success('Reseña actualizada correctamente');
    }
    this.closeReviewModal();
  }

  handleDeleteReview(id: string): void {
    this.reviewSvc.remove(id, this.BUYER_ID);
    this.notify.success('Reseña eliminada');
  }

  /* ── Favorites ── */
  readonly myFavorites = this.favSvc.all;

  handleRemoveFavorite(productId: string): void {
    this.favSvc.remove(productId);
    this.notify.success('Producto eliminado de favoritos');
  }

  handleAddFavoriteToCart(fav: IFavorite): void {
    this.cartSvc.add({
      id:        fav.productId,
      productId: fav.productId,
      name:      fav.productName,
      producer:  fav.productOrigin,
      price:     fav.productPrice,
      emoji:     '☕',
      organic:   false,
      fairTrade: false,
      maxStock:  99,
    });
    this.notify.success(`${fav.productName} agregado al carrito`);
  }

  handleViewFavoriteProduct(productId: string): void {
    this.router.navigate(['/productos', productId]);
  }

  /* ── Profile ── */
  readonly profile         = this.profileSvc.profile;
  readonly profileSaving   = signal(false);
  readonly passwordSaving  = signal(false);

  handleSaveProfile(payload: IBuyerProfilePayload): void {
    this.profileSaving.set(true);
    this.profileSvc.update(payload);
    this.profileSaving.set(false);
    this.notify.success('Perfil actualizado correctamente');
  }

  handleSavePassword(payload: IBuyerPasswordPayload): void {
    // In a real app this would call an auth endpoint.
    // For the mock we just show a success toast.
    void payload;
    this.notify.success('Contraseña actualizada correctamente.');
  }

  /* ── Actions: address CRUD ── */
  openAddressForm(address: IAddress | null = null): void {
    this.editingAddress.set(address);
    this.addressFormOpen.set(true);
  }

  closeAddressForm(): void {
    this.addressFormOpen.set(false);
    this.editingAddress.set(null);
  }

  handleSaveAddress(payload: IAddressPayload): void {
    this.addressSaving.set(true);
    const editing = this.editingAddress();
    if (editing) {
      this.addrSvc.update(editing.id, payload);
      this.notify.success('Dirección actualizada correctamente.');
    } else {
      this.addrSvc.add(payload);
      this.notify.success('Dirección agregada correctamente.');
    }
    this.addressSaving.set(false);
    this.closeAddressForm();
  }

  handleDeleteAddress(id: string): void {
    this.addrSvc.remove(id);
    this.notify.success('Dirección eliminada.');
  }

  handleSetDefaultAddress(id: string): void {
    this.addrSvc.setDefault(id);
    this.notify.success('Dirección principal actualizada.');
  }

  /* ── Stats overview ── */
  readonly stats = computed(() => ({
    totalOrders: this.orderSvc.all().length,
    delivered:   this.deliveredCount(),
    cartItems:   this.cartSvc.count(),
    favorites:   this.favSvc.count(),
    reviews:     this.myReviews().length,
  }));

  /* ── Actions ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: BuyerTab): void {
    this.activeTab.set(tab);
  }

  setTabAndFilter(tab: BuyerTab, filter: string): void {
    this.activeTab.set(tab);
    this.orderFilter.set(filter);
  }

  onItemRemove(id: string): void {
    this.cartSvc.remove(id);
  }

  onQtyChange(event: { id: string; qty: number }): void {
    this.cartSvc.updateQty(event.id, event.qty);
  }

  onShippingChange(optionId: string): void {
    this.cartSvc.selectShipping(optionId);
  }

  onCouponApply(code: string): void {
    const ok = this.cartSvc.applyCoupon(code);
    if (ok) {
      this.notify.success('Cupón aplicado: 10% de descuento');
    } else {
      this.notify.error('Cupón inválido o expirado');
    }
  }

  onCouponRemove(): void {
    this.notify.info('Cupón eliminado');
  }

  onCheckout(): void {
    this.notify.info('Checkout — próximamente');
  }

  toggleOrder(id: string): void {
    this.expandedOrder.update(v => (v === id ? null : id));
  }

  logout(): void {
    this.auth.logout();
  }
}
