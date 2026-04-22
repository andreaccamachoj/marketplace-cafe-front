import { Component } from '@angular/core';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductPayload } from '../../models/product.model';
import { PRODUCT_COPY } from '../../constants/product.constants';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [ModalComponent, ProductFormComponent],
  templateUrl: './product-dashboard.component.html',
  styleUrl: './product-dashboard.component.scss',
})
export class ProductDashboardComponent {
  isModalOpen = false;
  readonly COPY = PRODUCT_COPY;

  openProductModal(): void {
    this.isModalOpen = true;
  }

  closeProductModal(): void {
    this.isModalOpen = false;
  }

  handleSaveProduct(payload: ProductPayload): void {
    console.log('Guardando producto:', payload);
    this.closeProductModal();
  }
}
