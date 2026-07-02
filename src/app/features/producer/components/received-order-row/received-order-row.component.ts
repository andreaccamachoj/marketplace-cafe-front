import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  IReceivedOrder,
  ORDER_STATUS_FLOW,
  RECEIVED_ORDER_STATUS_LABELS,
  ReceivedOrderStatus,
} from '../../models/received-order.model';

@Component({
  selector: 'app-received-order-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './received-order-row.component.html',
  styleUrl: './received-order-row.component.scss',
})
export class ReceivedOrderRowComponent {
  readonly order = input.required<IReceivedOrder>();

  readonly statusChange = output<{ id: string; status: ReceivedOrderStatus }>();

  protected readonly statusFlow = ORDER_STATUS_FLOW;
  protected readonly statusLabels = RECEIVED_ORDER_STATUS_LABELS;

  protected readonly statusSelectClass = computed(() => {
    const map: Record<ReceivedOrderStatus, string> = {
      confirmed: 'ss-confirmed',
      preparing: 'ss-preparing',
      shipped: 'ss-shipped',
      delivered: 'ss-delivered',
    };
    return 'status-select ' + map[this.order().status];
  });

  protected readonly itemsLabel = computed(() => {
    const count = this.order().items.length;
    return count === 1 ? '1 producto' : `${count} productos`;
  });

  protected onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as ReceivedOrderStatus;
    this.statusChange.emit({ id: this.order().id, status: value });
  }

  protected isDisabled(optionStatus: ReceivedOrderStatus): boolean {
    return (
      ORDER_STATUS_FLOW.indexOf(optionStatus) <=
      ORDER_STATUS_FLOW.indexOf(this.order().status)
    );
  }
}
