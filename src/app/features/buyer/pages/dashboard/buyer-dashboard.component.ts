import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { CartItemRowComponent } from '../../components/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    DecimalPipe,
    RouterLink,
    DashboardNavComponent,
    CartItemRowComponent,
    CartSummaryComponent,
    OrderCardComponent,
    ReviewModalComponent,
  ],
  templateUrl: './buyer-dashboard.component.html',
  styleUrl: './buyer-dashboard.component.scss',
})
export class BuyerDashboardComponent {
  protected readonly auth     = inject(AuthService);
  protected readonly notify   = inject(NotificationService);
  protected readonly cartSvc  = inject(CartService);
  protected readonly orderSvc = inject(OrderService);
  protected readonly addrSvc  = inject(AddressService);

  /* ── UI state ── */
  readonly sidebarOpen     = signal(false);
  readonly activeTab       = signal<'cart' | 'orders'>('cart');
  readonly orderFilter     = signal<string>('all');
  readonly expandedOrder   = signal<string | null>(null);
  readonly reviewModalOpen = signal(false);
  readonly reviewOrderId   = signal<string | null>(null);

  /* ── User ── */
  protected readonly firstName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Usuario',
  );

  /* ── Cart (from service) ── */
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

  /* ── Orders (from service) ── */
  readonly orders = this.orderSvc.orders;

  readonly activeOrdersCount = computed(() =>
    this.orders().filter(
      o => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'shipped',
    ).length,
  );

  readonly deliveredCount = computed(() =>
    this.orders().filter(o => o.status === 'delivered').length,
  );

  readonly orderFilters = [
    { label: 'Todos',       value: 'all'       },
    { label: 'En camino',   value: 'shipped'   },
    { label: 'Preparando',  value: 'preparing' },
    { label: 'Entregados',  value: 'delivered' },
    { label: 'Cancelados',  value: 'cancelled' },
  ];

  readonly filteredOrders = computed(() => {
    const filter = this.orderFilter();
    return filter === 'all'
      ? this.orders()
      : this.orders().filter(o => o.status === filter);
  });

  /* ── Review modal target ── */
  protected readonly reviewOrder = computed(() => {
    const id = this.reviewOrderId();
    return id ? this.orderSvc.getById(id) : undefined;
  });

  protected reviewProductName(): string {
    const order = this.reviewOrder();
    if (!order || order.items.length === 0) return '';
    return order.items[0]?.name ?? '';
  }

  /* ── Actions ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: 'cart' | 'orders'): void {
    this.activeTab.set(tab);
  }

  setTabAndFilter(tab: 'cart' | 'orders', filter: string): void {
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

  onCheckout(): void {
    this.notify.info('Checkout — próximamente');
  }

  toggleOrder(id: string): void {
    this.expandedOrder.update(v => (v === id ? null : id));
  }

  openReview(orderId: string): void {
    this.reviewOrderId.set(orderId);
    this.reviewModalOpen.set(true);
  }

  closeReview(): void {
    this.reviewModalOpen.set(false);
    this.reviewOrderId.set(null);
  }

  onReviewSubmit(data: { rating: number; comment: string }): void {
    const orderId = this.reviewOrderId();
    if (!orderId) return;
    this.orderSvc.markReviewSubmitted(orderId);
    this.notify.success(`Reseña enviada (${data.rating}★). ¡Gracias!`);
    this.closeReview();
  }

  logout(): void {
    this.auth.logout();
  }

  protected showToast(msg: string, type: 'info' | 'success' | 'error'): void {
    if (type === 'success') {
      this.notify.success(msg);
    } else if (type === 'error') {
      this.notify.error(msg);
    } else {
      this.notify.info(msg);
    }
  }
}
