import { Pipe, PipeTransform } from '@angular/core';

const LABELS: Record<string, string> = {
  pending:    'Pendiente',
  confirmed:  'Confirmado',
  preparing:  'En preparación',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

@Pipe({ name: 'orderStatus', standalone: true, pure: true })
export class OrderStatusPipe implements PipeTransform {
  transform(value: string): string {
    return LABELS[value?.toLowerCase()] ?? value;
  }
}
