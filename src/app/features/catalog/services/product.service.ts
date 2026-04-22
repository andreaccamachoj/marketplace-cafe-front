import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IProduct, CatalogFilter, SortBy,
  IRoastLevel, IFlavorNote, ICuppingAttribute, IFarmInfo,
} from '../models/product.model';

const ROASTS: IRoastLevel[] = [
  { id: 'light',  name: 'Claro',  icon: '☀️', sub: 'Fruta · Floral' },
  { id: 'medium', name: 'Medio',  icon: '🌤️', sub: 'Caramelo · Nuez' },
  { id: 'dark',   name: 'Oscuro', icon: '☁️', sub: 'Chocolate · Tabaco' },
];

const PRESENTATIONS = ['Grano entero', 'Molido fino', 'Molido grueso'];

function cupping(score: number, aroma: number, flavor: number, body: number, finish: number): {
  cuppingScore: number; cuppingAttributes: ICuppingAttribute[];
} {
  return {
    cuppingScore: score,
    cuppingAttributes: [
      { label: 'Aroma',   value: aroma  },
      { label: 'Sabor',   value: flavor },
      { label: 'Cuerpo',  value: body   },
      { label: 'Final',   value: finish },
    ],
  };
}

const SEED_PRODUCTS: IProduct[] = [
  {
    id: '1',
    name: 'Café Especial Huila',
    producerName: 'Finca La Esperanza',
    category: 'grano',
    description: 'Notas de frutos rojos, chocolate negro y panela con acidez brillante. Proceso lavado y secado en cama africana a 1.850 msnm. Variedad Castillo de alta expresión aromática.',
    price: 48000, unit: '500g',
    rating: 4.9, reviewCount: 128, stock: 85, maxStock: 100,
    soldCount: 1240,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Huila',
    emoji: '🫘', bg: 'rgba(74,140,86,.08)',
    presentationTypes: PRESENTATIONS,
    roastLevels: ROASTS,
    flavorNotes: [
      { icon: '🍒', name: 'Frutos rojos', intensity: 90 },
      { icon: '🍫', name: 'Chocolate',    intensity: 75 },
      { icon: '🍬', name: 'Panela',       intensity: 65 },
      { icon: '🍋', name: 'Cítrico',      intensity: 50 },
    ],
    ...cupping(87, 8, 9, 7, 8),
    farmInfo: { name: 'Finca La Esperanza', municipality: 'Acevedo', department: 'Huila', altitude: 1850, area: 12, process: 'Lavado' },
  },
  {
    id: '2',
    name: 'Nariño Supremo',
    producerName: 'Coop. Nariño Verde',
    category: 'grano',
    description: 'Taza limpia con acidez cítrica vibrante, cuerpo medio y dulzor de caña. Cultivado a 2.200 msnm en el volcán Galeras. Variedad Colombia con proceso honey.',
    price: 52000, unit: '500g',
    rating: 4.8, reviewCount: 96, stock: 40, maxStock: 100,
    soldCount: 830,
    images: [],
    certifications: ['ORGANIC', 'RAINFOREST'],
    region: 'Nariño',
    emoji: '🌿', bg: 'rgba(26,107,138,.07)',
    presentationTypes: PRESENTATIONS,
    roastLevels: ROASTS,
    flavorNotes: [
      { icon: '🍊', name: 'Naranja',    intensity: 85 },
      { icon: '🍯', name: 'Miel',       intensity: 70 },
      { icon: '🌺', name: 'Floral',     intensity: 60 },
      { icon: '🍎', name: 'Manzana',    intensity: 45 },
    ],
    ...cupping(85, 8, 8, 7, 7),
    farmInfo: { name: 'Coop. Nariño Verde', municipality: 'La Unión', department: 'Nariño', altitude: 2200, area: 35, process: 'Honey' },
  },
  {
    id: '3',
    name: 'Blend Sierra Nevada',
    producerName: 'Sierra Nevada Farms',
    category: 'molido',
    description: 'Mezcla premium de tres variedades de alta montaña. Chocolate negro, nuez tostada y caramelo con cuerpo cremoso, ideal para espresso y métodos de filtro.',
    price: 38000, originalPrice: 45000, discountPercent: 15,
    unit: '500g',
    rating: 4.7, reviewCount: 74, stock: 92, maxStock: 100,
    soldCount: 615,
    images: [],
    certifications: ['RAINFOREST'],
    region: 'Magdalena',
    emoji: '🏔️', bg: 'rgba(192,120,32,.07)',
    presentationTypes: ['Molido espresso', 'Molido fino', 'Molido grueso'],
    roastLevels: ROASTS,
    flavorNotes: [
      { icon: '🍫', name: 'Chocolate',  intensity: 88 },
      { icon: '🥜', name: 'Nuez',       intensity: 72 },
      { icon: '🍮', name: 'Caramelo',   intensity: 65 },
      { icon: '🌰', name: 'Avellana',   intensity: 55 },
    ],
    ...cupping(84, 7, 8, 9, 8),
    farmInfo: { name: 'Sierra Nevada Farms', municipality: 'Santa Marta', department: 'Magdalena', altitude: 1600, area: 48, process: 'Natural' },
  },
  {
    id: '4',
    name: 'San Agustín Washed',
    producerName: 'Finca El Paraíso',
    category: 'grano',
    description: 'Proceso lavado de alta limpieza con fermentación controlada. Perfil floral intenso con jazmín, durazno maduro y acidez málica muy elegante. Variedad Gesha colombiana.',
    price: 64000, unit: '500g',
    rating: 5.0, reviewCount: 42, stock: 18, maxStock: 100,
    soldCount: 290,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Huila',
    emoji: '🌸', bg: 'rgba(153,120,93,.08)',
    presentationTypes: PRESENTATIONS,
    roastLevels: [ROASTS[0], ROASTS[1]],
    flavorNotes: [
      { icon: '🌸', name: 'Jazmín',    intensity: 92 },
      { icon: '🍑', name: 'Durazno',   intensity: 80 },
      { icon: '🫐', name: 'Arándano',  intensity: 68 },
      { icon: '🍵', name: 'Té verde',  intensity: 55 },
    ],
    ...cupping(91, 9, 9, 7, 9),
    farmInfo: { name: 'Finca El Paraíso', municipality: 'San Agustín', department: 'Huila', altitude: 1950, area: 8, process: 'Lavado' },
  },
  {
    id: '5',
    name: 'Café Tolima Natural',
    producerName: 'Familia Guerrero',
    category: 'grano',
    description: 'Proceso natural con fermentación lenta de 96 horas. Intenso en fruta tropical, mango, mora y un dulzor pronunciado que recuerda a uvas pasas. Secado en patios elevados.',
    price: 56000, unit: '500g',
    rating: 4.8, reviewCount: 63, stock: 60, maxStock: 100,
    soldCount: 480,
    images: [],
    certifications: ['ORGANIC'],
    region: 'Tolima',
    emoji: '🌺', bg: 'rgba(74,140,86,.06)',
    presentationTypes: PRESENTATIONS,
    roastLevels: ROASTS,
    flavorNotes: [
      { icon: '🥭', name: 'Mango',      intensity: 88 },
      { icon: '🍇', name: 'Uva',        intensity: 78 },
      { icon: '🫐', name: 'Mora',       intensity: 72 },
      { icon: '🍍', name: 'Tropical',   intensity: 60 },
    ],
    ...cupping(86, 8, 9, 8, 8),
    farmInfo: { name: 'Familia Guerrero', municipality: 'Planadas', department: 'Tolima', altitude: 1750, area: 6, process: 'Natural' },
  },
  {
    id: '6',
    name: 'Caturra Antioquia',
    producerName: 'Coop. Eje Cafetero',
    category: 'molido',
    description: 'Variedad Caturra de cuerpo robusto cultivada en el corazón del Eje Cafetero. Notas de almendra, chocolate amargo y un toque cítrico muy equilibrado. Perfecto para tinto.',
    price: 42000, unit: '500g',
    rating: 4.6, reviewCount: 81, stock: 75, maxStock: 100,
    soldCount: 720,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE', 'RAINFOREST'],
    region: 'Antioquia',
    emoji: '☕', bg: 'rgba(55,38,23,.05)',
    presentationTypes: ['Molido fino', 'Molido grueso', 'Grano entero'],
    roastLevels: [ROASTS[1], ROASTS[2]],
    flavorNotes: [
      { icon: '🌰', name: 'Almendra',   intensity: 82 },
      { icon: '🍫', name: 'Chocolate',  intensity: 76 },
      { icon: '🍋', name: 'Limón',      intensity: 40 },
      { icon: '🌿', name: 'Herbáceo',   intensity: 35 },
    ],
    ...cupping(83, 7, 8, 9, 7),
    farmInfo: { name: 'Coop. Eje Cafetero', municipality: 'Jericó', department: 'Antioquia', altitude: 1680, area: 22, process: 'Lavado' },
  },
  {
    id: '7',
    name: 'Cauca Geisha',
    producerName: 'Hacienda La Divisa',
    category: 'grano',
    description: 'Variedad Geisha de altísima expresión en el Macizo Colombiano. Té de jazmín, bergamota y acidez fosfórica muy delicada. Cosecha selectiva manual. Lote limitado.',
    price: 98000, unit: '250g',
    rating: 4.9, reviewCount: 31, stock: 12, maxStock: 100,
    soldCount: 145,
    images: [],
    certifications: ['ORGANIC'],
    region: 'Cauca',
    emoji: '✨', bg: 'rgba(192,120,32,.06)',
    presentationTypes: ['Grano entero'],
    roastLevels: [ROASTS[0]],
    flavorNotes: [
      { icon: '🌸', name: 'Jazmín',     intensity: 95 },
      { icon: '🍋', name: 'Bergamota',  intensity: 85 },
      { icon: '🍵', name: 'Té blanco',  intensity: 70 },
      { icon: '🌼', name: 'Floral',     intensity: 90 },
    ],
    ...cupping(93, 10, 9, 7, 9),
    farmInfo: { name: 'Hacienda La Divisa', municipality: 'El Tambo', department: 'Cauca', altitude: 2100, area: 4, process: 'Lavado' },
  },
  {
    id: '8',
    name: 'Descafeinado Swiss Water',
    producerName: 'Coop. Nariño Verde',
    category: 'descafeinado',
    description: 'Descafeinado mediante proceso natural Swiss Water sin químicos. Conserva el 99.9% del sabor original con notas de chocolate con leche, nuez de macadamia y final dulce.',
    price: 46000, unit: '500g',
    rating: 4.5, reviewCount: 57, stock: 50, maxStock: 100,
    soldCount: 390,
    images: [],
    certifications: ['ORGANIC', 'RAINFOREST'],
    region: 'Nariño',
    emoji: '💧', bg: 'rgba(26,107,138,.06)',
    presentationTypes: ['Molido fino', 'Grano entero'],
    roastLevels: [ROASTS[1], ROASTS[2]],
    flavorNotes: [
      { icon: '🍫', name: 'Choc. leche', intensity: 80 },
      { icon: '🥜', name: 'Macadamia',   intensity: 68 },
      { icon: '🍮', name: 'Vainilla',    intensity: 58 },
      { icon: '🌰', name: 'Nuez',        intensity: 50 },
    ],
    ...cupping(82, 7, 8, 8, 7),
    farmInfo: { name: 'Coop. Nariño Verde', municipality: 'La Unión', department: 'Nariño', altitude: 2000, area: 35, process: 'Swiss Water' },
  },
  {
    id: '9',
    name: 'Tostado Oscuro Bogotá',
    producerName: 'Tostadora Artesanal',
    category: 'molido',
    description: 'Tostado oscuro español con cuerpo pleno y bajo nivel de acidez. Ideal para espresso italiano y americano largo. Notas de tabaco, cacao amargo y madera de cedro.',
    price: 35000, originalPrice: 40000, discountPercent: 12,
    unit: '500g',
    rating: 4.4, reviewCount: 109, stock: 95, maxStock: 100,
    soldCount: 980,
    images: [],
    certifications: ['FAIRTRADE'],
    region: 'Cundinamarca',
    emoji: '🖤', bg: 'rgba(55,38,23,.07)',
    presentationTypes: ['Molido espresso', 'Molido fino'],
    roastLevels: [ROASTS[2]],
    flavorNotes: [
      { icon: '🍫', name: 'Cacao',      intensity: 85 },
      { icon: '🚬', name: 'Tabaco',     intensity: 70 },
      { icon: '🪵', name: 'Madera',     intensity: 60 },
      { icon: '🌶️', name: 'Especias',   intensity: 45 },
    ],
    ...cupping(81, 7, 7, 10, 7),
    farmInfo: { name: 'Tostadora Artesanal', municipality: 'Bogotá', department: 'Cundinamarca', altitude: 2600, area: 0, process: 'Tostado oscuro' },
  },
  {
    id: '10',
    name: 'Typica Popayán',
    producerName: 'Finca El Tambor',
    category: 'grano',
    description: 'Variedad Typica ancestral rescatada en el Cauca. Amargor dulce, cuerpo aterciopelado y acidez de ciruela madura. Fermentación en tanques de madera de 48 horas.',
    price: 58000, unit: '500g',
    rating: 4.7, reviewCount: 38, stock: 25, maxStock: 100,
    soldCount: 210,
    images: [],
    certifications: ['ORGANIC', 'FAIRTRADE'],
    region: 'Cauca',
    emoji: '🌄', bg: 'rgba(153,120,93,.09)',
    presentationTypes: PRESENTATIONS,
    roastLevels: ROASTS,
    flavorNotes: [
      { icon: '🍑', name: 'Ciruela',    intensity: 80 },
      { icon: '🍬', name: 'Azúcar',     intensity: 72 },
      { icon: '🍫', name: 'Chocolate',  intensity: 65 },
      { icon: '🌹', name: 'Rosa',       intensity: 50 },
    ],
    ...cupping(86, 8, 8, 9, 8),
    farmInfo: { name: 'Finca El Tambor', municipality: 'Popayán', department: 'Cauca', altitude: 1900, area: 9, process: 'Fermentación en madera' },
  },
  {
    id: '11',
    name: 'Blend Espresso Premium',
    producerName: 'Café La Palma',
    category: 'molido',
    description: 'Blend diseñado para espresso de alto rendimiento. Combinación de Caturra y Castillo de Huila y Antioquia. Cremosidad, equilibrio y persistencia en el paladar.',
    price: 44000, unit: '500g',
    rating: 4.6, reviewCount: 67, stock: 70, maxStock: 100,
    soldCount: 550,
    images: [],
    certifications: ['FAIRTRADE', 'RAINFOREST'],
    region: 'Cundinamarca',
    emoji: '🎯', bg: 'rgba(192,120,32,.08)',
    presentationTypes: ['Molido espresso', 'Molido fino'],
    roastLevels: [ROASTS[1], ROASTS[2]],
    flavorNotes: [
      { icon: '🍮', name: 'Caramelo',   intensity: 85 },
      { icon: '🍫', name: 'Chocolate',  intensity: 80 },
      { icon: '🥛', name: 'Cremoso',    intensity: 75 },
      { icon: '🌰', name: 'Avellana',   intensity: 60 },
    ],
    ...cupping(84, 7, 8, 9, 8),
    farmInfo: { name: 'Café La Palma', municipality: 'La Calera', department: 'Cundinamarca', altitude: 1700, area: 15, process: 'Lavado' },
  },
  {
    id: '12',
    name: 'Pink Bourbon Huila',
    producerName: 'Finca Vista Hermosa',
    category: 'grano',
    description: 'Variedad Pink Bourbon de altísima rareza y complejidad. Fermentación anaeróbica de 72 horas. Fresas silvestres, hibisco y acidez de maracuyá. Lote de colección.',
    price: 112000, unit: '250g',
    rating: 5.0, reviewCount: 19, stock: 8, maxStock: 100,
    soldCount: 72,
    images: [],
    certifications: ['ORGANIC'],
    region: 'Huila',
    emoji: '🌷', bg: 'rgba(139,32,32,.05)',
    presentationTypes: ['Grano entero'],
    roastLevels: [ROASTS[0]],
    flavorNotes: [
      { icon: '🍓', name: 'Fresa',      intensity: 95 },
      { icon: '🌺', name: 'Hibisco',    intensity: 88 },
      { icon: '🍊', name: 'Maracuyá',   intensity: 78 },
      { icon: '🌸', name: 'Rosas',      intensity: 65 },
    ],
    ...cupping(94, 10, 9, 7, 10),
    farmInfo: { name: 'Finca Vista Hermosa', municipality: 'Gigante', department: 'Huila', altitude: 2050, area: 5, process: 'Anaeróbico' },
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
        filter.certs!.some(c => p.certifications.includes(c as 'ORGANIC' | 'FAIRTRADE' | 'RAINFOREST'))
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

  getByIdSync(id: string): IProduct | undefined {
    return this.products().find(p => p.id === id);
  }

  search(query: string): IProduct[] {
    return this.list({ query });
  }

  private sortProducts(products: IProduct[], sortBy: SortBy): IProduct[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':  return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
      case 'rating':     return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':     return sorted.reverse();
      default:           return sorted;
    }
  }
}
