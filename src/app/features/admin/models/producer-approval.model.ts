export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface IProducerApproval {
  id: string;
  producerName: string;
  farmName: string;
  region: string;
  department: string;
  submittedAt: string;
  status: ApprovalStatus;
  documents: IApprovalDocument[];
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  hectares: number;
  mainVariety: string;
  email: string;
  phone: string;
}

export interface IApprovalDocument {
  id: string;
  name: string;
  type: 'rut' | 'predial' | 'cedula' | 'certificacion' | 'otro';
  url: string;
  uploadedAt: string;
}
