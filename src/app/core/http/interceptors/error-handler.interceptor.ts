import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { TokenStorageService } from '../../auth/services/token-storage.service';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Solicitud inválida.',
  401: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Conflicto con el estado actual del recurso.',
  500: 'Error interno del servidor. Intenta más tarde.',
};

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const notify  = inject(NotificationService);
  const storage = inject(TokenStorageService);
  const router  = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg = err.error?.message || (ERROR_MESSAGES[err.status] ?? 'Ocurrió un error inesperado.');
      notify.error(msg);
      if (err.status === 401) {
        storage.clear();
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    }),
  );
};
