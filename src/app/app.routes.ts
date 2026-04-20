import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },
  {
    path: 'panel',
    loadChildren: () => import('./features/product-management/product-management.routes').then(m => m.PRODUCT_MANAGEMENT_ROUTES),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
