export type UserStatus = 'active' | 'suspended' | 'pending';

export interface IAdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'buyer' | 'producer' | 'admin';
  status: UserStatus;
  joinedAt: string;
  lastLoginAt?: string;
  ordersCount?: number;
  productsCount?: number;
  avatarInitials: string;
}
