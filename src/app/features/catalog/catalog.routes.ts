import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const CATALOG_ROUTES: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Catálogo' } },
  { path: 'productos/:id', component: ProductDetailComponent, data: { title: 'Detalle del Producto' } },
];
