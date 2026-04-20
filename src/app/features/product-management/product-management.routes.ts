import { Routes } from '@angular/router';
import { ProductDashboardComponent } from './containers/product-dashboard/product-dashboard.component';

export const PRODUCT_MANAGEMENT_ROUTES: Routes = [
  {
    path: 'productos',
    component: ProductDashboardComponent,
    data: { title: 'Gestión de Productos' }
  },
];
