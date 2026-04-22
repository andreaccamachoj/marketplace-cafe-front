import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { roleGuard } from '@core/auth/guards/role.guard';
import { producerApprovedGuard } from '@core/auth/guards/producer-approved.guard';
import { Role } from '@core/auth/models/role.enum';

export const PRODUCER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/producer-dashboard.component').then(
        m => m.ProducerDashboardComponent,
      ),
    canActivate: [authGuard, roleGuard, producerApprovedGuard],
    data: { role: Role.PRODUCER },
  },
];
