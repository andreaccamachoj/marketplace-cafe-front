import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { roleGuard } from '@core/auth/guards/role.guard';
import { Role } from '@core/auth/models/role.enum';

export const BUYER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/buyer-dashboard.component').then(
        m => m.BuyerDashboardComponent,
      ),
    canActivate: [authGuard, roleGuard],
    data: { role: Role.BUYER },
  },
];
