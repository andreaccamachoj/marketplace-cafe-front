import { IUser } from './user.model';

export interface IAuthResponse {
  user: IUser;
  token: string;
  expiresAt: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'buyer' | 'producer';
}
