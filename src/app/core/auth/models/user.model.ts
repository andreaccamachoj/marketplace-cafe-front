import { Role } from './role.enum';
import { ProducerStatus } from './producer-status.enum';

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: Role[];
  status: 'active' | 'inactive' | 'suspended';
  producerStatus?: ProducerStatus;
  producerProfileId?: string;
  createdAt: string;
}
