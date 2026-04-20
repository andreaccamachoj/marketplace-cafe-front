import { Pipe, PipeTransform } from '@angular/core';

const LABELS: Record<string, string> = {
  organic:      'Orgánico',
  fair_trade:   'Comercio Justo',
  rainforest:   'Rainforest Alliance',
  utz:          'UTZ Certified',
  bird_friendly:'Bird Friendly',
};

@Pipe({ name: 'certificationLabel', standalone: true, pure: true })
export class CertificationLabelPipe implements PipeTransform {
  transform(value: string): string {
    return LABELS[value?.toLowerCase()] ?? value;
  }
}
