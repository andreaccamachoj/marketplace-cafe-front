import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { IOrder, ORDER_STATUS_LABELS } from '../../models/order.model';
import { OrderStepperComponent } from '../order-stepper/order-stepper.component';

export interface ReviewClickEvent {
  orderId:     string;
  productId:   string;
  productName: string;
}

@Component({
  selector: 'app-order-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, NgClass, OrderStepperComponent],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  readonly order              = input.required<IOrder>();
  readonly expanded           = input<boolean>(false);
  readonly reviewedProductIds = input<string[]>([]);

  readonly orderToggle = output<string>();
  readonly reviewClick = output<ReviewClickEvent>();

  protected readonly statusLabels = ORDER_STATUS_LABELS;

  protected getStatusLabel(): string {
    return ORDER_STATUS_LABELS[this.order().status];
  }

  protected isDelivered(): boolean {
    return this.order().status === 'delivered' || this.order().status === 'completed';
  }

  protected canReviewItem(productId: string): boolean {
    return this.isDelivered() && !this.reviewedProductIds().includes(productId);
  }

  protected onToggle(): void {
    this.orderToggle.emit(this.order().id);
  }

  protected onItemReviewClick(productId: string, productName: string): void {
    this.reviewClick.emit({ orderId: this.order().id, productId, productName });
  }
}
