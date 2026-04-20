import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../services/notification.service';

export const producerApprovedGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const notify = inject(NotificationService);
  const router = inject(Router);

  if (auth.isProducerApproved()) return true;

  notify.warning('Tu cuenta de productor aún está pendiente de aprobación.');
  return router.createUrlTree(['/producer/pending']);
};
