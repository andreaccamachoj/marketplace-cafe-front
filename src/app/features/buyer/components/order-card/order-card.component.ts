import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { IOrder, ORDER_STATUS_LABELS } from '../../models/order.model';
import { OrderStepperComponent } from '../order-stepper/order-stepper.component';

@Component({
  selector: 'app-order-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, NgClass, OrderStepperComponent],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  readonly order = input.required<IOrder>();
  readonly expanded = input<boolean>(false);

  readonly toggle = output<string>();
  readonly reviewClick = output<string>();

  protected readonly statusLabels = ORDER_STATUS_LABELS;

  protected getStatusLabel(): string {
    return ORDER_STATUS_LABELS[this.order().status];
  }

  protected onToggle(): void {
    this.toggle.emit(this.order().id);
  }

  protected onReviewClick(): void {
    this.reviewClick.emit(this.order().id);
  }
}
