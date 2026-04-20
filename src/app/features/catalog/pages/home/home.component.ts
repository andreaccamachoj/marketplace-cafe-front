import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct, SortBy, CatalogFilter } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { FiltersBarComponent } from '../../components/filters-bar/filters-bar.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { SustainabilitySectionComponent } from '../../components/sustainability-section/sustainability-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    FiltersBarComponent,
    ProductGridComponent,
    SustainabilitySectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="home-page">
      <app-hero-section (exploreCatalog)="scrollToProducts()"></app-hero-section>

      <section class="home-page__catalog">
        <app-filters-bar
          [selectedCategory]="selectedCategory()"
          [selectedCerts]="selectedCerts()"
          [sortBy]="sortBy()"
          [resultCount]="products().length"
          (categoryChange)="onCategoryChange($event)"
          (certChange)="onCertChange($event)"
          (sortChange)="onSortChange($event)"
        ></app-filters-bar>

        <app-product-grid
          [products]="products()"
          [loading]="false"
          (addToCart)="onAddToCart($event)"
          (toggleFavorite)="onToggleFavorite($event)"
        ></app-product-grid>
      </section>

      <app-sustainability-section></app-sustainability-section>
    </main>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly selectedCerts = signal<string[]>([]);
  protected readonly sortBy = signal<SortBy>('relevance');

  protected readonly products = computed(() => {
    const filter: CatalogFilter = {
      category: this.selectedCategory(),
      certs: this.selectedCerts(),
      sort: this.sortBy(),
    };
    return this.productService.list(filter);
  });

  protected onCategoryChange(cat: string | null): void {
    this.selectedCategory.set(cat);
  }

  protected onCertChange(certs: string[]): void {
    this.selectedCerts.set(certs);
  }

  protected onSortChange(sort: SortBy): void {
    this.sortBy.set(sort);
  }

  protected onAddToCart(product: IProduct): void {
    // TODO: Connect to CartService
  }

  protected onToggleFavorite(id: string): void {
    // TODO: Connect to FavoritesService
  }

  protected scrollToProducts(): void {
    const section = document.querySelector('.home-page__catalog');
    section?.scrollIntoView({ behavior: 'smooth' });
  }
}
