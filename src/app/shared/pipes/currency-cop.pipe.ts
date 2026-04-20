import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyCop', standalone: true, pure: true })
export class CurrencyCopPipe implements PipeTransform {
  transform(value: number): string {
    return `$ ${value.toLocaleString('es-CO')}`;
  }
}
