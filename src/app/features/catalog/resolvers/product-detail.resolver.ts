import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IProduct } from '../models/product.model';
import { ProductService } from '../services/product.service';

export const productDetailResolver: ResolveFn<IProduct | null> = (route) => {
  const productService = inject(ProductService);
  const router = inject(Router);

  const id = route.paramMap.get('id');
  if (!id) {
    router.navigate(['/']);
    return null;
  }

  return productService.getById(id).pipe(
    map(product => {
      if (!product) {
        router.navigate(['/']);
        return null;
      }
      return product;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(null);
    }),
  );
};
