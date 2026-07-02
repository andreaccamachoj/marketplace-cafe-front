import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ICartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  templateUrl: './cart-item-row.component.html',
  styleUrl: './cart-item-row.component.scss',
})
export class CartItemRowComponent {
  readonly item = input.required<ICartItem>();

  readonly remove = output<string>();
  readonly qtyChange = output<{ id: string; qty: number }>();

  protected onDecrease(): void {
    const i = this.item();
    if (i.qty > 1) {
      this.qtyChange.emit({ id: i.id, qty: i.qty - 1 });
    }
  }

  protected onIncrease(): void {
    const i = this.item();
    if (i.qty < i.maxStock) {
      this.qtyChange.emit({ id: i.id, qty: i.qty + 1 });
    }
  }

  protected onRemove(): void {
    this.remove.emit(this.item().id);
  }
}
