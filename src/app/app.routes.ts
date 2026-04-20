import { Routes } from '@angular/router';
import { publicGuard } from '@core/auth/guards/public.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [publicGuard],
  },
  {
    path: '',
    loadChildren: () => import('./features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },
  {
    path: 'panel',
    loadChildren: () => import('./features/product-management/product-management.routes').then(m => m.PRODUCT_MANAGEMENT_ROUTES),
  },
  { path: 'buyer',    redirectTo: '' },
  { path: 'producer', redirectTo: '' },
  { path: 'admin',    redirectTo: '' },
  { path: '**',       redirectTo: '' },
];
