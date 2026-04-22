export type CertStatus = 'valid' | 'expiring';

export interface IFarmCertification {
  id: string;
  icon: string;
  name: string;
  body: string;
  validUntil: string;
  status: CertStatus;
}

export interface IFarm {
  id: string;
  name: string;
  municipality: string;
  department: string;
  altitude: string;
  area: string;
  process: string;
  description: string;
  certifications: IFarmCertification[];
}
