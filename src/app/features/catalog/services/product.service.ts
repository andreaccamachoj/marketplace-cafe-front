import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProduct, CatalogFilter, SortBy } from '../models/product.model';

const SEED_PRODUCTS: IProduct[] = [
  {
    id: '1',
    name: 'Café Geisha Premium',
    producerName: 'Finca Los Robles',
    category: 'Café de Origen',
    description: 'Café de especialidad con notas florales y afrutadas, origen puro Huila',
    price: 45000,
    rating: 4.9,
    reviewCount: 128,
    stock: 45,
    maxStock: 100,
    images: ['https://via.placeholder.com/300x300?text=Geisha+Premium'],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Huila',
  },
  {
    id: '2',
    name: 'Bourbon Nariño',
    producerName: 'Cooperativa Café Puro',
    category: 'Café de Origen',
    description: 'Sabor equilibrado con notas de chocolate y caramelo',
    price: 28000,
    rating: 4.7,
    reviewCount: 94,
    stock: 62,
    maxStock: 100,
    images: ['https://via.placeholder.com/300x300?text=Bourbon+Nariño'],
    certifications: ['ORGANIC'],
    region: 'Nariño',
  },
  {
    id: '3',
    name: 'Typica Sierra Nevada',
    producerName: 'Hacienda El Paraíso',
    category: 'Café de Origen',
    description: 'Notas cítricas y acidez balanceada, café de altura',
    price: 32000,
    rating: 4.8,
    reviewCount: 156,
    stock: 38,
    maxStock: 100,
    images: ['https://via.placeholder.com/300x300?text=Typica+Sierra'],
    certifications: ['FAIRTRADE', 'RAINFOREST'],
    region: 'Sierra Nevada',
  },
  {
    id: '4',
    name: 'Blend Huila Premium',
    producerName: 'Asoproc Huila',
    category: 'Blend',
    description: 'Mezcla balanceada de Bourbon y Typica con sabor completo',
    price: 22000,
    rating: 4.6,
    reviewCount: 203,
    stock: 85,
    maxStock: 150,
    images: ['https://via.placeholder.com/300x300?text=Blend+Huila'],
    certifications: ['ORGANIC'],
    region: 'Huila',
  },
  {
    id: '5',
    name: 'Caturra Cauca',
    producerName: 'Finca El Bosque',
    category: 'Café de Origen',
    description: 'Café con cuerpo medio y notas a frutos rojos',
    price: 25000,
    rating: 4.5,
    reviewCount: 67,
    stock: 12,
    maxStock: 50,
    images: ['https://via.placeholder.com/300x300?text=Caturra+Cauca'],
    certifications: ['RAINFOREST'],
    region: 'Cauca',
  },
  {
    id: '6',
    name: 'Espresso Colombiano',
    producerName: 'Tostadora Bogotá',
    category: 'Blend',
    description: 'Mezcla oscura con cuerpo fuerte, ideal para espresso',
    price: 18000,
    rating: 4.4,
    reviewCount: 312,
    stock: 120,
    maxStock: 200,
    images: ['https://via.placeholder.com/300x300?text=Espresso+Colombiano'],
    certifications: ['FAIRTRADE'],
    region: 'Cundinamarca',
  },
  {
    id: '7',
    name: 'Decafeinado Suave',
    producerName: 'Procesadora Andina',
    category: 'Café de Origen',
    description: 'Café descafeinado natural sin perder sabor',
    price: 20000,
    rating: 4.3,
    reviewCount: 45,
    stock: 55,
    maxStock: 100,
    images: ['https://via.placeholder.com/300x300?text=Decafeinado'],
    certifications: ['ORGANIC'],
    region: 'Eje Cafetero',
  },
  {
    id: '8',
    name: 'Mokka Blend',
    producerName: 'Finca La Esperanza',
    category: 'Blend',
    description: 'Mezcla con sabor a chocolate y nueces, cuerpo completo',
    price: 24000,
    rating: 4.6,
    reviewCount: 89,
    stock: 42,
    maxStock: 100,
    images: ['https://via.placeholder.com/300x300?text=Mokka+Blend'],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Huila',
  },
  {
    id: '9',
    name: 'Arábica Premium Nariño',
    producerName: 'Selecciones Nariño',
    category: 'Café de Origen',
    description: 'Variedad 100% arábica con acidez característica',
    price: 35000,
    rating: 4.8,
    reviewCount: 134,
    stock: 28,
    maxStock: 80,
    images: ['https://via.placeholder.com/300x300?text=Arabica+Nariño'],
    certifications: ['RAINFOREST'],
    region: 'Nariño',
  },
  {
    id: '10',
    name: 'Café Tostado Medio',
    producerName: 'Cooperativa Cauca',
    category: 'Blend',
    description: 'Tostado medio para maquina automática, versátil',
    price: 19000,
    rating: 4.5,
    reviewCount: 178,
    stock: 98,
    maxStock: 150,
    images: ['https://via.placeholder.com/300x300?text=Tostado+Medio'],
    certifications: ['ORGANIC'],
    region: 'Cauca',
  },
  {
    id: '11',
    name: 'Microlote Especial Sierra',
    producerName: 'Artesanos de Montaña',
    category: 'Café de Origen',
    description: 'Edición limitada, producción en microlotes controlados',
    price: 52000,
    rating: 5.0,
    reviewCount: 34,
    stock: 8,
    maxStock: 30,
    images: ['https://via.placeholder.com/300x300?text=Microlote+Sierra'],
    certifications: ['ORGANIC', 'FAIRTRADE', 'RAINFOREST'],
    region: 'Sierra Nevada',
  },
  {
    id: '12',
    name: 'Café para Filter',
    producerName: 'Tostadora Manizales',
    category: 'Blend',
    description: 'Grano medio para preparar en cafetera de filtro',
    price: 16000,
    rating: 4.4,
    reviewCount: 267,
    stock: 156,
    maxStock: 250,
    images: ['https://via.placeholder.com/300x300?text=Filter+Coffee'],
    certifications: ['FAIRTRADE'],
    region: 'Caldas',
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
