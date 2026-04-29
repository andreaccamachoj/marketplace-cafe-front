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
  readonly address   = input.required<IAddress>();
  readonly isDefault = input<boolean>(false);

  readonly addressSelect = output<IAddress>();
  readonly edit   = output<IAddress>();
}
