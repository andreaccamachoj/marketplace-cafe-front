import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';

import { ProducerProductService } from '../../services/producer-product.service';
import { ProducerOrderService } from '../../services/producer-order.service';
import { FarmService } from '../../services/farm.service';
import { ProducerProfileService } from '../../services/producer-profile.service';
import { ProducerReviewService } from '../../services/producer-review.service';
import { ReceivedOrderStatus } from '../../models/received-order.model';
import { IManagedProduct } from '../../models/managed-product.model';
import { IFarm } from '../../models/farm.model';
import { ICertification } from '../../models/certification.model';
import { IProducerProfilePayload, IProducerPasswordPayload } from '../../models/producer-profile.model';
import { IProducerReplyPayload } from '../../models/producer-review.model';
import { ProductTableRowComponent } from '../../components/product-table-row/product-table-row.component';
import { ReceivedOrderRowComponent } from '../../components/received-order-row/received-order-row.component';
import { FarmInfoCardComponent } from '../../components/farm-info-card/farm-info-card.component';
import { CertificationListComponent } from '../../components/certification-list/certification-list.component';
import { SalesMiniChartComponent } from '../../components/sales-mini-chart/sales-mini-chart.component';
import { ProductFormModalComponent } from '../../components/product-form-modal/product-form-modal.component';
import { FarmEditModalComponent } from '../../components/farm-edit-modal/farm-edit-modal.component';
import { CertificationFormModalComponent } from '../../components/certification-form-modal/certification-form-modal.component';
import { ProducerProfileFormComponent } from '../../components/producer-profile-form/producer-profile-form.component';
import { ProducerReviewCardComponent } from '../../components/producer-review-card/producer-review-card.component';

@Component({
  selector: 'app-producer-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardNavComponent,
    ProductTableRowComponent,
    ReceivedOrderRowComponent,
    FarmInfoCardComponent,
    CertificationListComponent,
    SalesMiniChartComponent,
    ProductFormModalComponent,
    FarmEditModalComponent,
    CertificationFormModalComponent,
    ProducerProfileFormComponent,
    ProducerReviewCardComponent,
  ],
  templateUrl: './producer-dashboard.component.html',
  styleUrl: './producer-dashboard.component.scss',
})
export class ProducerDashboardComponent implements OnInit {
  protected readonly auth          = inject(AuthService);
  protected readonly notify        = inject(NotificationService);
  protected readonly productSvc    = inject(ProducerProductService);
  protected readonly orderSvc      = inject(ProducerOrderService);
  protected readonly farmSvc       = inject(FarmService);
  protected readonly profileSvc    = inject(ProducerProfileService);
  protected readonly reviewSvc     = inject(ProducerReviewService);

  /* ── UI state ── */
  readonly sidebarOpen   = signal(false);
  readonly activeTab     = signal<'products' | 'orders' | 'farm' | 'profile' | 'reviews'>('products');
  readonly productFilter = signal<'all' | 'active' | 'draft' | 'inactive'>('all');
  readonly productSearch = signal('');

  /* ── Product modal state ── */
  readonly productModalOpen = signal(false);
  readonly productModalMode = signal<'create' | 'edit' | 'view'>('create');
  readonly selectedProduct  = signal<IManagedProduct | null>(null);
  readonly pendingCoverFile = signal<File | null>(null);

  /* ── Farm edit modal state ── */
  readonly farmEditOpen = signal(false);

  /* ── Certification modal state ── */
  readonly certModalOpen = signal(false);

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

  readonly draftCount = computed(
    () => this.products().filter(p => p.status === 'draft').length,
  );

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

  readonly preparingCount = computed(
    () => this.orders().filter(o => o.status === 'confirmed' || o.status === 'preparing').length,
  );

  /* ── Farm from service ── */
  readonly farm = this.farmSvc.farm;

  /* ── Profile from service ── */
  readonly profile      = this.profileSvc.profile;
  readonly profileLoading = signal(false);

  /* ── Reviews from service ── */
  readonly reviewGroups = this.reviewSvc.reviewGroups;

  /* ── Stats (real) ── */
  readonly avgRating   = computed(() => this.reviewSvc.globalAvgRating());
  readonly reviewCount = computed(() => this.reviewSvc.totalReviews());

  readonly monthlySales = computed(() => {
    const now = new Date();
    return this.orderSvc.orders()
      .filter(o => {
        if (!o.createdAt) return false;
        const d = new Date(o.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, o) => sum + o.total, 0);
  });

  readonly monthlySalesFormatted = computed(() => {
    const v = this.monthlySales();
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.', ',') + 'M';
    if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
    return v.toLocaleString('es-CO');
  });

  readonly semesterSales = computed(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);
    const total = this.orderSvc.orders()
      .filter(o => o.createdAt && new Date(o.createdAt) >= cutoff)
      .reduce((sum, o) => sum + o.total, 0);
    if (total >= 1_000_000) return '$' + (total / 1_000_000).toFixed(1).replace('.', ',') + 'M';
    if (total >= 1_000)     return '$' + (total / 1_000).toFixed(0) + 'K';
    return '$' + total.toLocaleString('es-CO');
  });

  /* ── Actions: sidebar / tabs ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: 'products' | 'orders' | 'farm' | 'profile' | 'reviews'): void {
    this.activeTab.set(tab);
    if (tab === 'orders') this.orderSvc.load();
  }

  onSearchInput(event: Event): void {
    this.productSearch.set((event.target as HTMLInputElement).value);
  }

  logout(): void {
    this.auth.logout();
  }

  /* ── Actions: product modal ── */
  openCreateProduct(): void {
    this.selectedProduct.set(null);
    this.productModalMode.set('create');
    this.productModalOpen.set(true);
  }

  openEditProduct(p: IManagedProduct): void {
    this.selectedProduct.set(p);
    this.productModalMode.set('edit');
    this.productModalOpen.set(true);
  }

  openViewProduct(p: IManagedProduct): void {
    this.selectedProduct.set(p);
    this.productModalMode.set('view');
    this.productModalOpen.set(true);
  }

  closeProductModal(): void {
    this.productModalOpen.set(false);
  }

  handleSaveProduct(data: Partial<IManagedProduct>): void {
    const coverFile = this.pendingCoverFile();
    if (this.productModalMode() === 'create') {
      this.productSvc.add(data, coverFile);
      this.notify.success('Producto creado correctamente.');
    } else {
      const current = this.selectedProduct();
      if (current) {
        this.productSvc.update(current.id, data, coverFile);
        this.notify.success('Producto actualizado correctamente.');
      }
    }
    this.pendingCoverFile.set(null);
    this.closeProductModal();
  }

  /* ── Actions: product table row ── */
  onToggleStatus(id: string): void {
    this.productSvc.toggleStatus(id);
    this.notify.success('Estado del producto actualizado.');
  }

  onEditProduct(id: string): void {
    const p = this.products().find(x => x.id === id);
    if (p) this.openEditProduct(p);
  }

  onViewProduct(id: string): void {
    const p = this.products().find(x => x.id === id);
    if (p) this.openViewProduct(p);
  }

  onRemoveProduct(id: string): void {
    this.productSvc.remove(id);
    this.notify.success('Producto eliminado.');
  }

  /* ── Actions: orders ── */
  onOrderStatusChange(event: { id: string; status: ReceivedOrderStatus }): void {
    this.orderSvc.updateStatus(event.id, event.status);
    this.notify.success('Estado del pedido actualizado.');
  }

  /* ── Actions: farm modal ── */
  openFarmEdit(): void {
    this.farmEditOpen.set(true);
  }

  closeFarmEdit(): void {
    this.farmEditOpen.set(false);
  }

  handleSaveFarm(data: Partial<IFarm>): void {
    this.farmSvc.updateFarm(data);
    this.notify.success('Información de la finca actualizada.');
    this.closeFarmEdit();
  }

  /* ── Actions: certification modal ── */
  openCertModal(): void {
    this.certModalOpen.set(true);
  }

  closeCertModal(): void {
    this.certModalOpen.set(false);
  }

  handleSaveCert(cert: Omit<ICertification, 'id'>): void {
    this.farmSvc.addCertification(cert);
    this.notify.success('Certificación agregada correctamente.');
    this.closeCertModal();
  }

  /* ── Actions: producer profile ── */
  handleSaveProfile(payload: IProducerProfilePayload): void {
    this.profileLoading.set(true);
    this.profileSvc.update(payload).subscribe({
      next: () => {
        this.notify.success('Perfil actualizado correctamente.');
        this.profileLoading.set(false);
      },
      error: () => this.profileLoading.set(false),
    });
  }

  handleSavePassword(payload: IProducerPasswordPayload): void {
    this.auth.changePassword(payload.currentPassword, payload.newPassword).subscribe({
      next: () => this.notify.success('Contraseña actualizada correctamente.'),
      error: () => {},
    });
  }

  /* ── Actions: reviews ── */
  handleReply(payload: IProducerReplyPayload): void {
    this.reviewSvc.reply(payload.reviewId, payload.text);
    this.notify.success('Respuesta publicada.');
  }

  ngOnInit(): void {
    this.productSvc.load();
    this.orderSvc.load();
    this.reviewSvc.load();
  }
}
