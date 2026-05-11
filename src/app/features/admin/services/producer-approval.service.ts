import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IProducerApproval, ApprovalStatus } from '../models/producer-approval.model';

function mapApproval(b: Record<string, unknown>): IProducerApproval {
  const statusMap: Record<string, ApprovalStatus> = {
    pending: 'pending', pending_review: 'pending', approved: 'approved', rejected: 'rejected',
  };
  return {
    id: String(b['id']),
    producerName: String(b['producerNameSnapshot'] ?? b['producerName'] ?? 'Productor'),
    farmName: String(b['farmNameSnapshot'] ?? b['farmName'] ?? ''),
    region: String(b['region'] ?? ''),
    department: String(b['department'] ?? ''),
    submittedAt: String(b['submittedAt'] ?? b['createdAt'] ?? ''),
    status: statusMap[String(b['status']?.toString().toLowerCase())] ?? 'pending',
    documents: [],
    hectares: Number(b['hectares'] ?? 0),
    mainVariety: String(b['mainVariety'] ?? ''),
    email: String(b['email'] ?? ''),
    phone: String(b['phone'] ?? ''),
    rejectionReason: b['rejectionReason'] ? String(b['rejectionReason']) : undefined,
    reviewedAt: b['reviewedAt'] ? String(b['reviewedAt']) : undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class ProducerApprovalService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _approvals = signal<IProducerApproval[]>([]);

  readonly all = computed(() => this._approvals());
  readonly pending = computed(() => this._approvals().filter(a => a.status === 'pending'));
  readonly pendingCount = computed(() => this.pending().length);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<Record<string, unknown>[]>('/admin/producer-approvals').subscribe({
      next: list => this._approvals.set(list.map(mapApproval)),
    });
  }

  approve(id: string, reviewedBy: string): void {
    this.http.patch(`/admin/producer-approvals/${id}/approve`, { notes: '' }).subscribe({
      next: () => this._approvals.update(list =>
        list.map(a => a.id === id ? { ...a, status: 'approved' as ApprovalStatus, reviewedAt: new Date().toISOString(), reviewedBy } : a)),
    });
  }

  reject(id: string, reason: string, reviewedBy: string): void {
    this.http.patch(`/admin/producer-approvals/${id}/reject`, { reason }).subscribe({
      next: () => this._approvals.update(list =>
        list.map(a => a.id === id ? { ...a, status: 'rejected' as ApprovalStatus, rejectionReason: reason, reviewedAt: new Date().toISOString(), reviewedBy } : a)),
    });
  }

  getById(id: string): IProducerApproval | undefined {
    return this._approvals().find(a => a.id === id);
  }
}
