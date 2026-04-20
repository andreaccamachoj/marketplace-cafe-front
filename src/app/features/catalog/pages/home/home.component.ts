import {
  Component, inject, signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct, SortBy, CatalogFilter } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { LandingNavbarComponent } from '../../components/landing-navbar/landing-navbar.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { FiltersBarComponent } from '../../components/filters-bar/filters-bar.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { SustainabilitySectionComponent } from '../../components/sustainability-section/sustainability-section.component';
import { ProducersSectionComponent } from '../../components/producers-section/producers-section.component';
import { FooterComponent } from '@shared/layout/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LandingNavbarComponent,
    HeroSectionComponent,
    FiltersBarComponent,
    ProductGridComponent,
    SustainabilitySectionComponent,
    ProducersSectionComponent,
    FooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#catalog">Saltar al catálogo</a>

    <!-- Navbar pública -->
    <app-landing-navbar
      [cartCount]="cartCount()"
      (searchChange)="onSearchChange($event)"
    ></app-landing-navbar>

    <!-- Hero -->
    <app-hero-section (exploreCatalog)="scrollToCatalog()"></app-hero-section>

    <!-- Filtros + Catálogo -->
    <app-filters-bar
      [selectedCategory]="selectedCategory()"
      [selectedCerts]="selectedCerts()"
      [sortBy]="sortBy()"
      [resultCount]="products().length"
      (categoryChange)="onCategoryChange($event)"
      (certChange)="onCertChange($event)"
      (sortChange)="onSortChange($event)"
    ></app-filters-bar>

    <main class="catalog-main" role="main" aria-label="Catálogo de productos" id="main-content">
      <app-product-grid
        [products]="products()"
        [loading]="false"
        (addToCart)="onAddToCart($event)"
        (toggleFavorite)="onToggleFavorite($event)"
      ></app-product-grid>
    </main>

    <!-- Sección sostenibilidad -->
    <app-sustainability-section></app-sustainability-section>

    <!-- Sección productores -->
    <app-producers-section></app-producers-section>

    <!-- Footer -->
    <app-footer></app-footer>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly selectedCerts    = signal<string[]>([]);
  protected readonly sortBy           = signal<SortBy>('relevance');
  protected readonly searchQuery      = signal<string>('');
  protected readonly cartCount        = signal<number>(0);

  protected readonly products = computed<IProduct[]>(() => {
    const filter: CatalogFilter = {
      category: this.selectedCategory(),
      certs:    this.selectedCerts(),
      sort:     this.sortBy(),
      query:    this.searchQuery() || undefined,
    };
    return this.productService.list(filter);
  });

  protected onCategoryChange(cat: string | null): void { this.selectedCategory.set(cat); }
  protected onCertChange(certs: string[]): void        { this.selectedCerts.set(certs); }
  protected onSortChange(sort: SortBy): void           { this.sortBy.set(sort); }
  protected onSearchChange(q: string): void            { this.searchQuery.set(q); }

  protected onAddToCart(product: IProduct): void {
    this.cartCount.update(n => n + 1);
    // TODO: conectar con CartService en Fase 6
  }

  protected onToggleFavorite(_id: string): void {
    // TODO: conectar con FavoritesService en Fase 6
  }

  protected scrollToCatalog(): void {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  }
}
