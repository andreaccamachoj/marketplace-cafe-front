import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

export const roleGuard: CanActivateFn = (route) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as Role | undefined;

  if (!requiredRole || auth.hasRole(requiredRole)) return true;
  return router.createUrlTree(['/']);
};
