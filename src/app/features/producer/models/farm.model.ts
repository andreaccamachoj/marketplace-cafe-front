export type CertStatus = 'valid' | 'expiring';

export interface IFarmCertification {
  id: string;
  icon: string;
  iconBg: string;
  name: string;
  body: string;
  validUntil: string;
  status: CertStatus;
}

export interface IFarmMetrics {
  annualProduction: string;
  yieldPerHa: string;
  process: string;
  harvestSeason: string;
  treeCount: string;
  cuppingScore: string;
}

export interface IFarmProfileStatus {
  status: 'approved' | 'pending' | 'rejected';
  approvedBy: string;
  approvalDate: string;
  verifiedDocs: number;
}

export interface IFarm {
  id: string;
  name: string;
  municipality: string;
  department: string;
  altitude: string;
  area: string;
  mainVariety: string;
  process: string;
  description: string;
  certifications: IFarmCertification[];
  metrics: IFarmMetrics;
  profileStatus: IFarmProfileStatus;
}
