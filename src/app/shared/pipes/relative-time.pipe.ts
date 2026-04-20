import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime', standalone: true, pure: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60)   return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
    return date.toLocaleDateString('es-CO');
  }
}
