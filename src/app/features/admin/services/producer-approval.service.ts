import { Injectable, computed, signal } from '@angular/core';
import { IProducerApproval } from '../models/producer-approval.model';

const SEED_APPROVALS: IProducerApproval[] = [
  {
    id: 'pa-1',
    producerName: 'Carlos Andrés Muñoz',
    farmName: 'Finca El Paraíso',
    region: 'Huila',
    department: 'Huila',
    submittedAt: '2025-04-18T10:00:00Z',
    status: 'pending',
    hectares: 12,
    mainVariety: 'Caturra y Colombia',
    email: 'carlos.munoz@ejemplo.co',
    phone: '310-555-0101',
    documents: [
      { id: 'd1', name: 'RUT Carlos Muñoz.pdf', type: 'rut', url: '/docs/rut-1.pdf', uploadedAt: '2025-04-18T09:30:00Z' },
      { id: 'd2', name: 'Certificado Predial.pdf', type: 'predial', url: '/docs/predial-1.pdf', uploadedAt: '2025-04-18T09:45:00Z' },
    ],
  },
  {
    id: 'pa-2',
    producerName: 'María Lucía Ospina',
    farmName: 'Hacienda Las Nubes',
    region: 'Nariño',
    department: 'Nariño',
    submittedAt: '2025-04-19T14:30:00Z',
    status: 'pending',
    hectares: 8,
    mainVariety: 'Geisha y Bourbon',
    email: 'maria.ospina@ejemplo.co',
    phone: '320-555-0202',
    documents: [
      { id: 'd3', name: 'RUT María Ospina.pdf', type: 'rut', url: '/docs/rut-2.pdf', uploadedAt: '2025-04-19T14:00:00Z' },
    ],
  },
  {
    id: 'pa-3',
    producerName: 'Javier Enrique Ríos',
    farmName: 'La Montañita',
    region: 'Cauca',
    department: 'Cauca',
    submittedAt: '2025-04-20T09:00:00Z',
    status: 'pending',
    hectares: 5,
    mainVariety: 'Castillo',
    email: 'javier.rios@ejemplo.co',
    phone: '315-555-0303',
    documents: [],
  },
  {
    id: 'pa-4',
    producerName: 'Luz Marina Vargas',
    farmName: 'Finca La Esperanza',
    region: 'Antioquia',
    department: 'Antioquia',
    submittedAt: '2025-03-10T08:00:00Z',
    status: 'approved',
    hectares: 20,
    mainVariety: 'Tabi y Colombia',
    email: 'luz.vargas@ejemplo.co',
    phone: '300-555-0404',
    documents: [],
    reviewedAt: '2025-03-12T11:00:00Z',
    reviewedBy: 'Admin WCM',
  },
  {
    id: 'pa-5',
    producerName: 'Andrés Felipe Gómez',
    farmName: 'San Agustín Estate',
    region: 'Huila',
    department: 'Huila',
    submittedAt: '2025-03-15T10:00:00Z',
    status: 'approved',
    hectares: 15,
    mainVariety: 'Bourbon Rosado',
    email: 'andres.gomez@ejemplo.co',
    phone: '317-555-0505',
    documents: [],
    reviewedAt: '2025-03-17T09:00:00Z',
    reviewedBy: 'Admin WCM',
  },
  {
    id: 'pa-6',
    producerName: 'Pedro Pablo Restrepo',
    farmName: 'Finca El Roble',
    region: 'Caldas',
    department: 'Caldas',
    submittedAt: '2025-03-20T12:00:00Z',
    status: 'rejected',
    hectares: 3,
    mainVariety: 'Caturra',
    email: 'pedro.restrepo@ejemplo.co',
    phone: '312-555-0606',
    documents: [],
    rejectionReason: 'Documentación incompleta. Falta certificado predial y RUT actualizado.',
    reviewedAt: '2025-03-22T15:00:00Z',
    reviewedBy: 'Admin WCM',
  },
];

@Injectable({ providedIn: 'root' })
export class ProducerApprovalService {
  private readonly _approvals = signal<IProducerApproval[]>(SEED_APPROVALS);

  readonly all = computed(() => this._approvals());
  readonly pending = computed(() => this._approvals().filter(a => a.status === 'pending'));
  readonly pendingCount = computed(() => this.pending().length);

  approve(id: string, reviewedBy: string): void {
    this._approvals.update(list =>
      list.map(a =>
        a.id === id
          ? { ...a, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy }
          : a,
      ),
    );
  }

  reject(id: string, reason: string, reviewedBy: string): void {
    this._approvals.update(list =>
      list.map(a =>
        a.id === id
          ? {
              ...a,
              status: 'rejected' as const,
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy,
            }
          : a,
      ),
    );
  }

  getById(id: string): IProducerApproval | undefined {
    return this._approvals().find(a => a.id === id);
  }
}
