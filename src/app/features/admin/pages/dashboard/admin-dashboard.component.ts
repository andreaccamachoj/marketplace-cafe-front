import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { DashboardNavComponent } from '@shared/layout/dashboard-nav/dashboard-nav.component';

import { ProducerApprovalService } from '../../services/producer-approval.service';
import { AdminUserService } from '../../services/admin-user.service';
import { AdminCategoryService } from '../../services/admin-category.service';
import { AdminActivityService } from '../../services/admin-activity.service';

import { IProducerApproval } from '../../models/producer-approval.model';
import { IAdminCategory } from '../../models/admin-category.model';

import { PendingProducerCardComponent } from '../../components/pending-producer-card/pending-producer-card.component';
import { ProducerTableRowComponent } from '../../components/producer-table-row/producer-table-row.component';
import { UserTableRowComponent } from '../../components/user-table-row/user-table-row.component';
import { CategoryTableRowComponent } from '../../components/category-table-row/category-table-row.component';
import { ProducerDetailModalComponent } from '../../components/producer-detail-modal/producer-detail-modal.component';
import { RejectionReasonModalComponent } from '../../components/rejection-reason-modal/rejection-reason-modal.component';
import { CategoryFormModalComponent } from '../../components/category-form-modal/category-form-modal.component';
import { ActivityFeedItemComponent } from '../../components/activity-feed-item/activity-feed-item.component';

type AdminTab = 'overview' | 'users' | 'products' | 'producers' | 'categories';
type ProducerFilter = 'all' | 'pending' | 'approved' | 'rejected';

/* Inline product data for the products tab (view-only) */
interface IAdminProduct {
  id: string;
  emoji: string;
  name: string;
  category: string;
  producer: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
}

const PRODUCTS_DATA: IAdminProduct[] = [
  { id: 'p1', emoji: '☕', name: 'Geisha Washed', category: 'Especial', producer: 'Finca La Esperanza', price: 58000, stock: 35, status: 'active' },
  { id: 'p2', emoji: '🫘', name: 'Tabi Natural', category: 'Microlote', producer: 'Café del Huila', price: 42000, stock: 60, status: 'active' },
  { id: 'p3', emoji: '🌿', name: 'Caturra Honey', category: 'Honey Process', producer: 'Sierra Nevada Beans', price: 36000, stock: 80, status: 'pending' },
  { id: 'p4', emoji: '🍂', name: 'Bourbon Natural', category: 'Natural', producer: 'Cafés del Eje', price: 29000, stock: 0, status: 'inactive' },
  { id: 'p5', emoji: '🏔', name: 'Castillo Washed', category: 'Lavado', producer: 'Nariño Select', price: 32000, stock: 45, status: 'active' },
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    DecimalPipe,
    RouterLink,
    FormsModule,
    DashboardNavComponent,
    PendingProducerCardComponent,
    ProducerTableRowComponent,
    UserTableRowComponent,
    CategoryTableRowComponent,
    ProducerDetailModalComponent,
    RejectionReasonModalComponent,
    CategoryFormModalComponent,
    ActivityFeedItemComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly approvalSvc  = inject(ProducerApprovalService);
  private readonly userSvc      = inject(AdminUserService);
  private readonly categorySvc  = inject(AdminCategoryService);
  private readonly activitySvc  = inject(AdminActivityService);
  protected readonly auth       = inject(AuthService);
  protected readonly notify     = inject(NotificationService);

  /* ── Computed stats ── */
  protected readonly stats = computed(() => ({
    totalUsers:       this.userSvc.all().length,
    activeUsers:      this.userSvc.activeCount(),
    pendingProducers: this.approvalSvc.pendingCount(),
    totalCategories:  this.categorySvc.all().length,
  }));

  /* ── Data signals ── */
  protected readonly allProducers   = computed(() => this.approvalSvc.all());
  protected readonly pendingProducers = computed(() => this.approvalSvc.pending());
  protected readonly allUsers       = computed(() => this.userSvc.all());
  protected readonly allCategories  = computed(() => this.categorySvc.all());
  protected readonly recentActivity = computed(() => this.activitySvc.recent());
  protected readonly products       = signal<IAdminProduct[]>(PRODUCTS_DATA);

  /* ── Admin name ── */
  protected readonly adminName = computed(() =>
    this.auth.currentUser()?.fullName.split(' ')[0] ?? 'Admin',
  );

  /* ── UI state ── */
  readonly sidebarOpen      = signal(false);
  protected readonly activeTab = signal<AdminTab>('overview');

  /* Producers tab filter */
  protected readonly producerFilter = signal<ProducerFilter>('all');
  protected readonly filteredProducers = computed(() => {
    const filter = this.producerFilter();
    const all = this.allProducers();
    if (filter === 'all') return all;
    return all.filter(p => p.status === filter);
  });

  /* Users tab search */
  protected userSearchQuery = '';
  protected readonly filteredUsers = computed(() => {
    const q = this.userSearchQuery.toLowerCase().trim();
    if (!q) return this.allUsers();
    return this.allUsers().filter(u =>
      u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  });

  /* Producer detail modal */
  protected readonly selectedProducer    = signal<IProducerApproval | null>(null);
  protected readonly producerModalOpen   = signal(false);

  /* Rejection reason modal */
  protected readonly rejectModalOpen     = signal(false);
  protected readonly rejectTargetId      = signal<string>('');
  protected readonly rejectTargetName    = signal<string>('');

  /* Category form modal */
  protected readonly categoryModalOpen   = signal(false);
  protected readonly selectedCategory    = signal<IAdminCategory | null>(null);

  /* ── Producer filter options ── */
  protected readonly producerFilterOptions: { value: ProducerFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobados' },
    { value: 'rejected', label: 'Rechazados' },
  ];

  /* ── Sidebar ── */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.auth.logout();
  }

  showToast(msg: string, type: 'info' | 'success' | 'error'): void {
    if (type === 'success') this.notify.success(msg);
    else if (type === 'error') this.notify.error(msg);
    else this.notify.info(msg);
  }

  /* ── Producer actions ── */
  openProducerDetail(p: IProducerApproval): void {
    this.selectedProducer.set(p);
    this.producerModalOpen.set(true);
  }

  closeProducerModal(): void {
    this.producerModalOpen.set(false);
    this.selectedProducer.set(null);
  }

  handleQuickApprove(id: string): void {
    const producer = this.approvalSvc.getById(id);
    if (!producer) return;
    this.approvalSvc.approve(id, this.adminName());
    this.activitySvc.addItem({
      type: 'producer_approved',
      title: 'Productor aprobado',
      description: `${producer.producerName} — ${producer.farmName} fue aprobado`,
      timestamp: new Date().toISOString(),
      actorName: this.adminName(),
      iconEmoji: '✅',
      severity: 'success',
    });
    this.notify.success(`Productor "${producer.producerName}" aprobado correctamente.`);
    this.closeProducerModal();
  }

  openRejectModal(id: string): void {
    const producer = this.approvalSvc.getById(id);
    if (!producer) return;
    this.rejectTargetId.set(id);
    this.rejectTargetName.set(producer.producerName);
    this.rejectModalOpen.set(true);
  }

  handleRejectConfirmed(reason: string): void {
    const id = this.rejectTargetId();
    const producer = this.approvalSvc.getById(id);
    if (!producer) return;
    this.approvalSvc.reject(id, reason, this.adminName());
    this.activitySvc.addItem({
      type: 'producer_rejected',
      title: 'Solicitud rechazada',
      description: `${producer.producerName} — ${producer.farmName} fue rechazado`,
      timestamp: new Date().toISOString(),
      actorName: this.adminName(),
      iconEmoji: '❌',
      severity: 'warning',
    });
    this.notify.error(`Solicitud de "${producer.producerName}" rechazada.`);
    this.rejectModalOpen.set(false);
    this.closeProducerModal();
  }

  handleDetailRejected(event: { id: string; reason: string }): void {
    const producer = this.approvalSvc.getById(event.id);
    if (!producer) return;
    this.approvalSvc.reject(event.id, event.reason, this.adminName());
    this.activitySvc.addItem({
      type: 'producer_rejected',
      title: 'Solicitud rechazada',
      description: `${producer.producerName} — ${producer.farmName} fue rechazado`,
      timestamp: new Date().toISOString(),
      actorName: this.adminName(),
      iconEmoji: '❌',
      severity: 'warning',
    });
    this.notify.error(`Solicitud de "${producer.producerName}" rechazada.`);
    this.closeProducerModal();
  }

  /* ── User actions ── */
  handleSuspendUser(id: string): void {
    const user = this.userSvc.all().find(u => u.id === id);
    if (!user) return;
    this.userSvc.suspend(id);
    this.activitySvc.addItem({
      type: 'user_suspended',
      title: 'Usuario suspendido',
      description: `${user.fullName} fue suspendido`,
      timestamp: new Date().toISOString(),
      actorName: this.adminName(),
      iconEmoji: '🚫',
      severity: 'danger',
    });
    this.notify.success(`Usuario "${user.fullName}" suspendido.`);
  }

  handleReactivateUser(id: string): void {
    const user = this.userSvc.all().find(u => u.id === id);
    if (!user) return;
    this.userSvc.reactivate(id);
    this.notify.success(`Usuario "${user.fullName}" reactivado.`);
  }

  /* ── Category actions ── */
  openCreateCategory(): void {
    this.selectedCategory.set(null);
    this.categoryModalOpen.set(true);
  }

  openEditCategory(cat: IAdminCategory): void {
    this.selectedCategory.set(cat);
    this.categoryModalOpen.set(true);
  }

  closeCategoryModal(): void {
    this.categoryModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  handleSaveCategory(data: Partial<IAdminCategory>): void {
    const existing = this.selectedCategory();
    if (existing) {
      this.categorySvc.update(existing.id, data);
      this.notify.success(`Categoría "${data['name']}" actualizada.`);
    } else {
      const catData = data as Omit<IAdminCategory, 'id' | 'createdAt' | 'productCount'>;
      this.categorySvc.add(catData);
      this.activitySvc.addItem({
        type: 'category_created',
        title: 'Categoría creada',
        description: `Se creó la categoría ${data['name']}`,
        timestamp: new Date().toISOString(),
        actorName: this.adminName(),
        iconEmoji: '📁',
        severity: 'info',
      });
      this.notify.success(`Categoría "${data['name']}" creada.`);
    }
    this.closeCategoryModal();
  }

  handleToggleCategoryActive(id: string): void {
    this.categorySvc.toggleActive(id);
  }

  handleDeleteCategory(id: string): void {
    const cat = this.categorySvc.all().find(c => c.id === id);
    if (!cat) return;
    this.categorySvc.remove(id);
    this.notify.success(`Categoría "${cat.name}" eliminada.`);
  }
}
