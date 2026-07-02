# ADR-003 — Mock In-Memory como Capa de Datos (sin Backend Real)

**Estado:** Aceptado  
**Fecha:** 2026-04-20  
**Autores:** Equipo de Desarrollo — World Coffee Marketplace (UNAB)

---

## Contexto

El proyecto World Coffee Marketplace es un prototipo funcional de alta fidelidad para un trabajo de grado universitario. El objetivo es demostrar la arquitectura frontend, los flujos de usuario y la propuesta de valor del marketplace, no implementar un backend de producción.

Las alternativas para la capa de datos eran:

1. **Backend real (REST API)**: Requeriría tiempo significativo adicional para base de datos, autenticación, seguridad y despliegue.
2. **JSON Server / MSW (Mock Service Worker)**: Aproximación más realista a HTTP pero añade complejidad de infraestructura.
3. **Firebase / Supabase**: Backend como servicio, viable pero introduce dependencias externas y costos.
4. **Mock in-memory con servicios Angular**: Servicios `providedIn: 'root'` que mantienen el estado en señales durante la sesión del navegador.

---

## Decisión

**Se implementa una capa de mock in-memory completa mediante servicios Angular con `providedIn: 'root'`**, que contienen datos semilla realistas y exponen métodos CRUD síncronos o que retornan `Promise<void>` para simular latencia cuando sea necesario.

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<IProduct[]>(SEED_PRODUCTS);

  list(filter?: CatalogFilter): IProduct[] {
    // Filtrado y ordenamiento en memoria
    return applyFilter(this._products(), filter);
  }

  getByIdSync(id: string): IProduct | undefined {
    return this._products().find(p => p.id === id);
  }
}
```

---

## Estructura de datos semilla

Cada dominio tiene su propio conjunto de datos representativos:

| Servicio | Datos semilla | Cardinalidad |
|----------|--------------|--------------|
| `ProductService` | Cafés con certificaciones, cupping scores, farm info | 12-16 productos |
| `AuthService` | Usuarios (buyer, producer admin) | 3 usuarios |
| `CartService` | Carrito vacío por defecto | 0 items inicial |
| `OrderService` | Pedidos históricos del comprador | 4 pedidos |
| `FavoritesService` | Favoritos del comprador demo | 3 favoritos |
| `ReviewService` | Reseñas de productos y del comprador | 4 reseñas (catalog) + 4 (buyer) |
| `ProducerProductService` | Productos del productor demo | 6 productos |
| `ProducerApprovalService` | Solicitudes de aprobación | 6 entradas |
| `AdminUserService` | Usuarios en sistema | 6 usuarios |

---

## Justificación

| Criterio | Backend real | MSW | Mock in-memory |
|----------|-------------|-----|---------------|
| Tiempo de implementación | ❌ Semanas | ⚠️ Días | ✅ Horas |
| Dependencias externas | ❌ Alta | ⚠️ Media | ✅ Ninguna |
| Fidelidad al contrato HTTP | ✅ Exacta | ✅ Alta | ⚠️ Media |
| Funcionamiento offline | ❌ No | ⚠️ Parcial | ✅ Completo |
| Adecuación al objetivo académico | ⚠️ Sobre-alcance | ✅ Buena | ✅ Óptima |
| Persistencia entre sesiones | ✅ Sí | ✅ Sí | ❌ No (RAM) |

---

## Limitaciones conocidas y aceptadas

1. **Sin persistencia**: Los datos se reinician al recargar la página. Para un prototipo de demostración, esto es aceptable.
2. **Sin validación de concurrencia**: No se simula conflictos de escritura simultánea.
3. **Sin paginación real**: La paginación es opcional y se implementa en memoria.
4. **Autenticación simulada**: Las credenciales son constantes en código (no en producción real).

---

## Migración futura

Cuando el proyecto requiera un backend real, la transición está diseñada para ser mínima:

1. Reemplazar los métodos de los servicios que retornan datos síncronos por llamadas HTTP.
2. Los componentes no requieren cambios porque consumen señales (`computed()`) independientemente de la fuente.
3. Agregar `HttpClient` y los interceptors existentes (`base-url.interceptor.ts`, `error-handler.interceptor.ts`) ya están preparados.

```typescript
// Migración futura: solo cambiar el servicio
list(filter?: CatalogFilter): Observable<IProduct[]> {
  return this.http.get<IProduct[]>('/api/products', { params: toParams(filter) });
}
```

---

## Consecuencias

**Positivas:**
- Desarrollo rápido sin infraestructura backend.
- Datos realistas y coherentes entre todas las vistas.
- Funciona sin conexión a internet.
- Facilita demostraciones en cualquier entorno.

**Negativas:**
- No valida la API real; requiere integración posterior.
- Los datos semilla deben mantenerse coherentes manualmente entre servicios.

---

## Referencias

- [Angular in-memory-web-api](https://github.com/angular/angular/tree/main/packages/misc/angular-in-memory-web-api) (alternativa considerada pero no adoptada)
- [Testing with mock services — Angular docs](https://angular.dev/guide/testing/services)
