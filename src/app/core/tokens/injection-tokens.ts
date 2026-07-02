import { InjectionToken } from '@angular/core';
import { ILoginCredentials, IRegisterPayload } from '../auth/models/auth-response.model';

export interface IAuthService {
  login(credentials: ILoginCredentials): Promise<void>;
  register(payload: IRegisterPayload): Promise<void>;
  logout(): void;
}

export interface INotificationService {
  success(message: string, title?: string): void;
  error(message: string, title?: string): void;
  info(message: string, title?: string): void;
  warning(message: string, title?: string): void;
}

export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>('AUTH_SERVICE');
export const NOTIFICATION_SERVICE_TOKEN = new InjectionToken<INotificationService>('NOTIFICATION_SERVICE');
