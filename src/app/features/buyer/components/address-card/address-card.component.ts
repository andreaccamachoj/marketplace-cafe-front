import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IAddress } from '../../models/checkout.model';

@Component({
  selector: 'app-address-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
})
export class AddressCardComponent {
  readonly address = input.required<IAddress>();

  readonly setDefault    = output<string>(); // emits id
  readonly edit          = output<IAddress>();
  readonly delete        = output<string>(); // emits id
}
