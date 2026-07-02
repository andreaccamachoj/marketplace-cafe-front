import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { IUser } from '../models/user.model';
import { ILoginCredentials, IRegisterPayload } from '../models/auth-response.model';
import { Role } from '../models/role.enum';
import { ProducerStatus } from '../models/producer-status.enum';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from '../../services/notification.service';

interface BackendTokens { accessToken: string; refreshToken: string; }
interface BackendUser { id: string; email: string; fullName: string; phone?: string; status: string; producerStatus?: string; createdAt: string; }
interface JwtPayload { sub: string; email: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http    = inject(HttpClient);
  private readonly storage = inject(TokenStorageService);
  private readonly router  = inject(Router);
  private readonly notify  = inject(NotificationService);

  readonly currentUser        = signal<IUser | null>(null);
  readonly isAuthenticated    = computed(() => this.currentUser() !== null);
  readonly currentRole        = computed(() => this.currentUser()?.roles[0] ?? null);
  readonly isProducerApproved = computed(
    () => this.currentUser()?.producerStatus === ProducerStatus.APPROVED,
  );
  readonly isBuyer = computed(() => this.currentRole() === Role.BUYER);

  constructor() {
    // Sin auto-login: cada arranque de la app comienza sin sesión y descarta
    // cualquier token/usuario persistido de una sesión previa.
    this.storage.clear();
  }

  async login(credentials: ILoginCredentials): Promise<void> {
    const tokens = await firstValueFrom(
      this.http.post<BackendTokens>('/auth/login', credentials),
    );
    await this.handleAuthTokens(tokens);
  }

  async register(payload: IRegisterPayload): Promise<void> {
    const url = payload.role === 'producer'
      ? '/auth/register/producer'
      : '/auth/register/buyer';
    const tokens = await firstValueFrom(
      this.http.post<BackendTokens>(url, {
        email:    payload.email,
        password: payload.password,
        fullName: payload.fullName,
        phone:    payload.phone,
      }),
    );
    await this.handleAuthTokens(tokens);
  }

  async recoverPassword(email: string): Promise<void> {
    await firstValueFrom(
      this.http.post('/auth/password-reset/request', { email }),
    );
    this.notify.info(`Si el correo ${email} existe, recibirás un enlace de recuperación.`);
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  updateProfile(patch: { fullName?: string; phone?: string; producerStatus?: ProducerStatus }): void {
    this.currentUser.update(u => (u ? { ...u, ...patch } : u));
    const updated = this.currentUser();
    if (updated) this.storage.setUser(updated);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.patch<void>('/auth/me/password', { oldPassword, newPassword });
  }

  hasRole(role: Role): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  private async handleAuthTokens(tokens: BackendTokens): Promise<void> {
    this.storage.setToken(tokens.accessToken);
    const jwt = this.decodeJwt(tokens.accessToken);
    const backendUser = await firstValueFrom(
      this.http.get<BackendUser>('/auth/me'),
    );
    const user: IUser = {
      id:             jwt.sub,
      email:          backendUser.email,
      fullName:       backendUser.fullName,
      phone:          backendUser.phone,
      roles:          [jwt.role.toLowerCase() as Role],
      status:         this.mapStatus(backendUser.status),
      producerStatus: backendUser.producerStatus as ProducerStatus | undefined,
      createdAt:      backendUser.createdAt,
    };
    this.storage.setUser(user);
    this.currentUser.set(user);
    await this.navigateByRole(user.roles[0]);
  }

  private decodeJwt(token: string): JwtPayload {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64)) as JwtPayload;
  }

  private mapStatus(status: string): 'active' | 'inactive' | 'suspended' {
    if (status === 'banned') return 'suspended';
    return status as 'active' | 'inactive';
  }

  private async navigateByRole(role: Role): Promise<void> {
    const paths: Record<Role, string> = {
      [Role.BUYER]:    '/panel/comprador',
      [Role.PRODUCER]: '/panel/productor',
      [Role.ADMIN]:    '/panel/admin',
    };
    await this.router.navigate([paths[role] ?? '/']);
  }
}
