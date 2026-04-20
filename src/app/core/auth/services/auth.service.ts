import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../models/user.model';
import { ILoginCredentials, IRegisterPayload } from '../models/auth-response.model';
import { Role } from '../models/role.enum';
import { ProducerStatus } from '../models/producer-status.enum';
import { TokenStorageService } from './token-storage.service';
import { NotificationService } from '../../services/notification.service';

interface ISeedUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  roles: Role[];
  status: 'active';
  producerStatus?: ProducerStatus;
  producerProfileId?: string;
  createdAt: string;
}

const SEED_USERS: ISeedUser[] = [
  {
    id: 'u1',
    email: 'buyer@wcm.co',
    password: 'Cafe#2025',
    fullName: 'Ana Compradora',
    phone: '3001112233',
    roles: [Role.BUYER],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    email: 'producer@wcm.co',
    password: 'Cafe#2025',
    fullName: 'Carlos Productor',
    phone: '3004445566',
    roles: [Role.PRODUCER],
    status: 'active',
    producerStatus: ProducerStatus.APPROVED,
    producerProfileId: 'p1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    email: 'admin@wcm.co',
    password: 'Cafe#2025',
    fullName: 'Admin WCM',
    phone: '3007778899',
    roles: [Role.ADMIN],
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(TokenStorageService);
  private readonly router  = inject(Router);
  private readonly notify  = inject(NotificationService);

  readonly currentUser = signal<IUser | null>(this.storage.getUser<IUser>());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly currentRole     = computed(() => this.currentUser()?.roles[0] ?? null);
  readonly isProducerApproved = computed(
    () => this.currentUser()?.producerStatus === ProducerStatus.APPROVED,
  );

  async login(credentials: ILoginCredentials): Promise<void> {
    const found = SEED_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password,
    );
    if (!found) throw new Error('Credenciales inválidas');

    const user: IUser = {
      id:               found.id,
      email:            found.email,
      fullName:         found.fullName,
      phone:            found.phone,
      roles:            found.roles,
      status:           found.status,
      producerStatus:   found.producerStatus,
      producerProfileId: found.producerProfileId,
      createdAt:        found.createdAt,
    };

    this.storage.setToken('mock-jwt-token');
    this.storage.setUser(user);
    this.currentUser.set(user);

    await this.navigateByRole(user.roles[0]);
  }

  async register(payload: IRegisterPayload): Promise<void> {
    const exists = SEED_USERS.some(u => u.email === payload.email);
    if (exists) throw new Error('El correo ya está registrado');

    const role = payload.role === 'producer' ? Role.PRODUCER : Role.BUYER;
    const user: IUser = {
      id:             `u${Date.now()}`,
      email:          payload.email,
      fullName:       payload.fullName,
      phone:          payload.phone,
      roles:          [role],
      status:         'active',
      producerStatus: role === Role.PRODUCER ? ProducerStatus.PENDING : undefined,
      createdAt:      new Date().toISOString(),
    };

    this.storage.setToken('mock-jwt-token');
    this.storage.setUser(user);
    this.currentUser.set(user);
    await this.navigateByRole(role);
  }

  async recoverPassword(email: string): Promise<void> {
    await Promise.resolve();
    this.notify.info(`Si el correo ${email} existe, recibirás un enlace de recuperación.`);
  }

  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  hasRole(role: Role): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  private async navigateByRole(role: Role): Promise<void> {
    const paths: Record<Role, string> = {
      [Role.BUYER]:    '/buyer',
      [Role.PRODUCER]: '/producer',
      [Role.ADMIN]:    '/admin',
    };
    await this.router.navigate([paths[role] ?? '/']);
  }
}
