import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const publicGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  const role = auth.currentRole();
  const paths: Record<string, string> = {
    [Role.BUYER]:    '/panel/comprador',
    [Role.PRODUCER]: '/panel/productor',
    [Role.ADMIN]:    '/panel/admin',
  };
  return router.createUrlTree([paths[role ?? ''] ?? '/']);
};
