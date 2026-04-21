import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { roleGuard } from '@core/auth/guards/role.guard';
import { Role } from '@core/auth/models/role.enum';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard.component').then(
        m => m.AdminDashboardComponent,
      ),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN },
  },
];
