import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { ProductFormComponent } from '@features/product-management/components/product-form/product-form.component';

import { ProducerProductService } from '../../services/producer-product.service';
import { ProducerOrderService } from '../../services/producer-order.service';
import { FarmService } from '../../services/farm.service';
import { ReceivedOrderStatus } from '../../models/received-order.model';
import { ProductTableRowComponent } from '../../components/product-table-row/product-table-row.component';
import { ReceivedOrderRowComponent } from '../../components/received-order-row/received-order-row.component';
import { FarmInfoCardComponent } from '../../components/farm-info-card/farm-info-card.component';
import { FarmMapComponent } from '../../components/farm-map/farm-map.component';
import { CertificationListComponent } from '../../components/certification-list/certification-list.component';
import { SalesMiniChartComponent } from '../../components/sales-mini-chart/sales-mini-chart.component';

@Component({
  selector: 'app-producer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    DashboardNavComponent,
    ModalComponent,
    ProductFormComponent,
    ProductTableRowComponent,
    ReceivedOrderRowComponent,
    FarmInfoCardComponent,
    FarmMapComponent,
    CertificationListComponent,
    SalesMiniChartComponent,
  ],
  templateUrl: './producer-dashboard.component.html',
  styleUrl: './producer-dashboard.component.scss',
})
export class ProducerDashboardComponent {
  protected readonly auth       = inject(AuthService);
  protected readonly notify     = inject(NotificationService);
  protected readonly productSvc = inject(ProducerProductService);
  protected readonly orderSvc   = inject(ProducerOrderService);
  protected readonly farmSvc    = inject(FarmService);

  /* ── UI state ── */
  readonly sidebarOpen    = signal(false);
  readonly activeTab      = signal<'products' | 'orders' | 'farm'>('products');
  readonly productFilter  = signal<'all' | 'active' | 'draft' | 'inactive'>('all');
  readonly productSearch  = signal('');
  readonly newProductOpen = signal(false);

  /* ── User ── */
  protected readonly firstName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Productor',
  );

  protected readonly producerStatus = computed(() =>
    this.auth.currentUser()?.producerStatus ?? 'pending',
  );

  /* ── Products from service ── */
  readonly products    = this.productSvc.products;
  readonly activeCount = this.productSvc.activeCount;

  readonly filteredProducts = computed(() => {
    const filter = this.productFilter();
    const search = this.productSearch().toLowerCase();
    return this.products()
      .filter(p => filter === 'all' || p.status === filter)
      .filter(
        p =>
          !search ||
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search),
      );
  });

  /* ── Orders from service ── */
  readonly orders       = this.orderSvc.orders;
  readonly pendingCount = this.orderSvc.pendingCount;

  /* ── Farm from service ── */
  readonly farm = this.farmSvc.farm;

  /* ── Stats (mock) ── */
  readonly monthlySales = signal(912000);
  readonly avgRating    = signal(4.8);
  readonly reviewCount  = signal(127);

  /* ── Actions ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: 'products' | 'orders' | 'farm'): void {
    this.activeTab.set(tab);
  }

  onToggleStatus(id: string): void {
    this.productSvc.toggleStatus(id);
    this.notify.success('Estado del producto actualizado.');
  }

  onEditProduct(_id: string): void {
    this.notify.info('Edición de producto — próximamente.');
  }

  onRemoveProduct(id: string): void {
    this.productSvc.remove(id);
    this.notify.success('Producto eliminado.');
  }

  onOrderStatusChange(event: { id: string; status: ReceivedOrderStatus }): void {
    this.orderSvc.updateStatus(event.id, event.status);
    this.notify.success('Estado del pedido actualizado.');
  }

  onNewProduct(_payload: unknown): void {
    this.notify.success('Producto guardado (mock).');
    this.newProductOpen.set(false);
  }

  onSearchInput(event: Event): void {
    this.productSearch.set((event.target as HTMLInputElement).value);
  }

  logout(): void {
    this.auth.logout();
  }
}
