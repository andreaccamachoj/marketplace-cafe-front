import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProduct, CatalogFilter, SortBy } from '../models/product.model';

const SEED_PRODUCTS: IProduct[] = [
  {
    id: '1',
    name: 'Café Especial Huila',
    producerName: 'Finca La Esperanza',
    category: 'grano',
    description: 'Notas de frutos rojos, chocolate y panela con acidez brillante. Proceso lavado, secado en cama africana.',
    price: 48000, unit: '500g',
    rating: 4.9, reviewCount: 128, stock: 85, maxStock: 100,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Huila',
    emoji: '🫘', bg: 'rgba(74,140,86,.08)',
  },
  {
    id: '2',
    name: 'Nariño Supremo',
    producerName: 'Coop. Nariño Verde',
    category: 'grano',
    description: 'Taza limpia con acidez cítrica, cuerpo medio y dulzor de caña. Cultivado a 2.200 msnm.',
    price: 52000, unit: '500g',
    rating: 4.8, reviewCount: 96, stock: 40, maxStock: 100,
    images: [],
    certifications: ['ORGANIC', 'RAINFOREST'],
    region: 'Nariño',
    emoji: '🌿', bg: 'rgba(26,107,138,.07)',
  },
  {
    id: '3',
    name: 'Blend Sierra Nevada',
    producerName: 'Sierra Nevada Farms',
    category: 'molido',
    description: 'Mezcla de tres variedades de altura. Chocolate negro, nuez y caramelo con cuerpo cremoso.',
    price: 38000, unit: '500g',
    rating: 4.7, reviewCount: 74, stock: 92, maxStock: 100,
    images: [],
    certifications: ['RAINFOREST'],
    region: 'Magdalena',
    emoji: '🏔️', bg: 'rgba(192,120,32,.07)',
  },
  {
    id: '4',
    name: 'San Agustín Washed',
    producerName: 'Finca El Paraíso',
    category: 'grano',
    description: 'Proceso lavado de alta limpieza. Perfil floral con jazmín, durazno y acidez málica elegante.',
    price: 64000, unit: '500g',
    rating: 5.0, reviewCount: 42, stock: 18, maxStock: 100,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Huila',
    emoji: '🌸', bg: 'rgba(153,120,93,.08)',
  },
  {
    id: '5',
    name: 'Café Tolima Natural',
    producerName: 'Familia Guerrero',
    category: 'grano',
    description: 'Proceso natural con fermentación lenta. Intenso en fruta tropical, mango y mora con dulzor pronunciado.',
    price: 56000, unit: '500g',
    rating: 4.8, reviewCount: 63, stock: 60, maxStock: 100,
    images: [],
    certifications: ['ORGANIC'],
    region: 'Tolima',
    emoji: '🌺', bg: 'rgba(74,140,86,.06)',
  },
  {
    id: '6',
    name: 'Caturra Antioquia',
    producerName: 'Coop. Eje Cafetero',
    category: 'molido',
    description: 'Variedad Caturra de cuerpo robusto. Notas de almendra, chocolate amargo y cítrico tímido.',
    price: 42000, unit: '500g',
    rating: 4.6, reviewCount: 81, stock: 75, maxStock: 100,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE', 'RAINFOREST'],
    region: 'Antioquia',
    emoji: '☕', bg: 'rgba(55,38,23,.05)',
  },
  {
    id: '7',
    name: 'Cauca Geisha',
    producerName: 'Hacienda La Divisa',
    category: 'grano',
    description: 'Variedad Geisha de altísima expresión. Té de jazmín, bergamota y acidez fosfórica muy delicada.',
    price: 98000, unit: '250g',
    rating: 4.9, reviewCount: 31, stock: 12, maxStock: 100,
    images: [],
    certifications: ['ORGANIC'],
    region: 'Cauca',
    emoji: '✨', bg: 'rgba(192,120,32,.06)',
  },
  {
    id: '8',
    name: 'Descafeinado Swiss Water',
    producerName: 'Coop. Nariño Verde',
    category: 'descafeinado',
    description: 'Descafeinado por proceso natural Swiss Water. Conserva el sabor original con chocolate y nuez suave.',
    price: 46000, unit: '500g',
    rating: 4.5, reviewCount: 57, stock: 50, maxStock: 100,
    images: [],
    certifications: ['ORGANIC', 'RAINFOREST'],
    region: 'Nariño',
    emoji: '💧', bg: 'rgba(26,107,138,.06)',
  },
  {
    id: '9',
    name: 'Tostado Oscuro Bogotá',
    producerName: 'Tostadora Artesanal',
    category: 'molido',
    description: 'Tostado oscuro español con cuerpo pleno. Ideal para espresso. Notas de tabaco, cacao y madera.',
    price: 35000, unit: '500g',
    rating: 4.4, reviewCount: 109, stock: 95, maxStock: 100,
    images: [],
    certifications: ['FAIRTRADE'],
    region: 'Cundinamarca',
    emoji: '🖤', bg: 'rgba(55,38,23,.07)',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly products = signal<IProduct[]>(SEED_PRODUCTS);
  readonly count = computed(() => this.products().length);

  list(filter?: CatalogFilter): IProduct[] {
    let result = [...this.products()];

    if (filter?.category) {
      result = result.filter(p => p.category === filter.category);
    }

    if (filter?.certs && filter.certs.length > 0) {
      result = result.filter(p =>
        filter.certs!.some(cert => p.certifications.includes(cert as any))
      );
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.producerName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (filter?.sort) {
      result = this.sortProducts(result, filter.sort);
    }

    return result;
  }

  getById(id: string): Observable<IProduct | undefined> {
    return of(this.products().find(p => p.id === id));
  }

  search(query: string): IProduct[] {
    return this.list({ query });
  }

  private sortProducts(products: IProduct[], sortBy: SortBy): IProduct[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.reverse();
      case 'relevance':
      default:
        return sorted;
    }
  }
}
