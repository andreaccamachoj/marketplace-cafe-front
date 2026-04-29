export interface IProducerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  department: string;
  bio: string;
  avatarInitials: string;
}

export interface IProducerProfilePayload {
  fullName: string;
  phone: string;
  city: string;
  department: string;
  bio: string;
}

export interface IProducerPasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
