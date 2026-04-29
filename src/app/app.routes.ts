import { Routes } from '@angular/router';
import { publicGuard } from '@core/auth/guards/public.guard';

export const routes: Routes = [
  /* ── Auth (público, redirige si ya hay sesión) ── */
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [publicGuard],
  },

  /* ── Catálogo público ── */
  {
    path: '',
    loadChildren: () => import('./features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },

  /* ── Paneles privados (rutas definitivas) ── */
  {
    path: 'panel/comprador',
    loadChildren: () => import('./features/buyer/buyer.routes').then(m => m.BUYER_ROUTES),
  },
  {
    path: 'panel/productor',
    loadChildren: () => import('./features/producer/producer.routes').then(m => m.PRODUCER_ROUTES),
  },
  {
    path: 'panel/admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },

  /* ── Aliases de compatibilidad (redirigen a rutas definitivas) ── */
  { path: 'buyer',    redirectTo: 'panel/comprador', pathMatch: 'prefix' },
  { path: 'producer', redirectTo: 'panel/productor', pathMatch: 'prefix' },
  { path: 'admin',    redirectTo: 'panel/admin',     pathMatch: 'prefix' },

  /* ── Fallback ── */
  { path: '**', redirectTo: '' },
];
