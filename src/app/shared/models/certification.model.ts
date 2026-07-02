export type CertificationType =
  | 'organic'
  | 'fair_trade'
  | 'rainforest'
  | 'utz'
  | 'bird_friendly';

export interface ICertification {
  type: CertificationType;
  certifyingBody: string;
  issuedAt: string;
  expiresAt?: string;
}
