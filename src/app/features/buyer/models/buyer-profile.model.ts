export interface IBuyerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  department: string;
  preferredPayment: 'card' | 'transfer' | 'cash_on_delivery';
  newsletterOptIn: boolean;
  avatarInitials: string;
}

export interface IBuyerProfilePayload {
  fullName: string;
  phone: string;
  city: string;
  department: string;
  preferredPayment: 'card' | 'transfer' | 'cash_on_delivery';
  newsletterOptIn: boolean;
}

export interface IBuyerPasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
