import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductPayload } from '../../models/product.model';
import { PRODUCT_COPY } from '../../constants/product.constants';
import { ModalComponent } from '../../../../shared/components/modal/modal/modal.component';
// import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-product-dashboard',
  imports: [CommonModule, ModalComponent, ProductFormComponent],
  templateUrl: './product-dashboard.component.html',
  styleUrl: './product-dashboard.component.scss'
})
export class ProductDashboardComponent {
  // private productService = inject(ProductService);

  isModalOpen = false;
  readonly COPY = PRODUCT_COPY;

  openProductModal(): void {
    this.isModalOpen = true;
  }

  closeProductModal(): void {
    this.isModalOpen = false;
  }

  handleSaveProduct(payload: ProductPayload): void {
    // Aquí iría la llamada al servicio real
    console.log('Enviando al backend de forma segura y tipada:', payload);

    /* this.productService.createProduct(payload).subscribe({
      next: () => {
        this.closeProductModal();
        // Disparar notificación de éxito
      },
      error: (err) => // Manejo de errores
    });
    */

    this.closeProductModal();
  }
}
