export type CertificationType =
  | 'organic'
  | 'utz'
  | 'fair-trade'
  | 'rainforest'
  | 'bird-friendly'
  | 'direct-trade'
  | 'shade-grown'
  | 'other';

export type CertificationStatus = 'vigente' | 'proximo-vencimiento' | 'vencida';

export interface ICertification {
  id: string;
  type: CertificationType;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  documentName?: string;
  documentUrl?: string;
  notes?: string;
  iconBg?: string;
}
