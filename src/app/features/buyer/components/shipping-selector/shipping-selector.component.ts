import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IShippingOption } from '../../models/shipping.model';

@Component({
  selector: 'app-shipping-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './shipping-selector.component.html',
  styleUrl: './shipping-selector.component.scss',
})
export class ShippingSelectorComponent {
  readonly options  = input.required<IShippingOption[]>();
  readonly selected = input<string | null>(null);

  readonly selectedChange = output<string>();
}
