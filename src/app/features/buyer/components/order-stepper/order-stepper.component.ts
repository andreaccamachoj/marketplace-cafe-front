import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { IOrderStep } from '../../models/order.model';

@Component({
  selector: 'app-order-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './order-stepper.component.html',
  styleUrl: './order-stepper.component.scss',
})
export class OrderStepperComponent {
  readonly steps = input.required<IOrderStep[]>();
}
