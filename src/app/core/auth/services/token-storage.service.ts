import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'wcm_token';
const USER_KEY  = 'wcm_user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setToken(token: string): void {
    if (this.isBrowser) localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  removeToken(): void {
    if (this.isBrowser) localStorage.removeItem(TOKEN_KEY);
  }

  setUser<T>(user: T): void {
    if (this.isBrowser) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  removeUser(): void {
    if (this.isBrowser) localStorage.removeItem(USER_KEY);
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
