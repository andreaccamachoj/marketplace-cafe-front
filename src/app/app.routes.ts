import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    // LAZY LOADING: Descarga el dashboard y el modal solo cuando el usuario entra aquí
    loadComponent: () => import('./features/product-management/containers/product-dashboard/product-dashboard.component')
      .then(m => m.ProductDashboardComponent),
    title: 'Gestión de Productos' // Opcional: Angular actualiza la etiqueta <title> automáticamente
  },
  {
    path: '**',
    redirectTo: 'productos'
  }
];
