# Plan de Trabajo — Conversión de Mockups HTML a Angular
## World Coffee Marketplace · Versión 2.0
### Revisado y actualizado — 2026-04-20

---

## ANÁLISIS COMPARATIVO: PROYECTO_CONTEXT.md vs PLAN.md (v1)

Antes de las fases, se documenta el resultado del análisis de brechas entre el contexto definido en `PROYECTO_CONTEXT.md` y el plan de trabajo original. Este análisis justifica la reestructuración del plan.

### Omisiones críticas detectadas

| # | Brecha | Severidad | Referencia en contexto |
|---|--------|-----------|------------------------|
| B-01 | **Pantalla `detalle_producto_cafe.html` sin fase propia** — el contexto la lista como pantalla diseñada completa; el plan v1 solo la menciona como sub-ítem de home sin fidelidad visual | Alta | §8, RF-16, HU-14 |
| B-02 | **Validación visual obligatoria contra mockups HTML omitida** — login y landing presentaron desviaciones estructurales porque el plan no establecía verificación formal contra los archivos HTML base | Alta | §12 |
| B-03 | **Rutas de paneles incorrectas** — contexto define `/panel/comprador`, `/panel/productor`, `/panel/admin`; plan v1 y código actual usan `/buyer`, `/producer`, `/admin` | Alta | §9 Routing |
| B-04 | **Componentes de product-detail no modelados** — contexto especifica: `product-options/`, `product-cta/`, `product-detail-tabs/`, `flavor-notes/`, `product-suggestions/` | Alta | §9 catalog/components |
| B-05 | **`IProduct` incompleto** — el mockup de detalle requiere: `originalPrice`, `discountPercent`, `presentationTypes[]`, `roastLevels[]`, `flavorNotes[]`, `cuppingScore`, `cuppingAttributes` (aroma/flavor/body/finish) | Media | detalle_producto_cafe.html |
| B-06 | **`breadcrumb` layout component omitido** — contexto incluye `shared/components/layout/breadcrumb/` | Media | §9 shared/layout |
| B-07 | **Directivas `scroll-spy` e `intersection-observer` omitidas** | Baja | §9 shared/directives |
| B-08 | **`shared/utils/` omitido** — contexto especifica `form.utils.ts`, `date.utils.ts`, `string.utils.ts` | Baja | §9 shared/utils |
| B-09 | **`product-detail.resolver.ts` omitido** — mejora UX al pre-cargar datos antes del render | Baja | §9 catalog/resolvers |
| B-10 | **Sección "Perfil" del comprador sin detalle de componentes** — HU-04 exige formulario de actualización de perfil | Media | HU-04, RF-04 |
| B-11 | **Sección "Verificación de documentos" del productor** — HU-05 exige carga de documentos | Media | HU-05, RF-05 |
| B-12 | **`register.component` usa BrandPanel con inputs deprecados** — `title`/`subtitle` son no-ops desde la reescritura del componente | Media | FASE 5 en curso |
| B-13 | **`register` no usa `StepIndicatorComponent`** — el componente existe en `shared/ui/` pero el flujo de registro usa una barra artesanal | Baja | §9 features/auth |
| B-14 | **`product-detail.component.ts` usa `signal<any>`** — viola TypeScript strict y la regla ESLint `no-explicit-any` | Alta | RNF code quality |
| B-15 | **`product-detail` no muestra reseñas** — `ReviewService` existe pero no se usa en el detalle; el mockup tiene una sección completa de reseñas | Alta | HU-14, RF-16 |
| B-16 | **Propósito académico ADR/RP no documentado en el plan** — el contexto establece que el proyecto investiga el rol de la IA en el SDLC y requiere ADRs + Registros de Prompts para trazabilidad | Media | §1 Contexto Académico |
| B-17 | **`angular.json` sin `fileReplacements`** — los environments existen pero no se activan automáticamente en production build | Media | §9 environments |
| B-18 | **ProductService solo tiene 9 productos semilla** — el plan especifica 12-16 | Baja | §4.1 |

---

## Contexto

**World Coffee Marketplace** (UNAB — Maestría) es un e-commerce B2C/B2B para café colombiano sostenible. El repositorio es una app **Angular 19 standalone con SSR (Express)**.

**Propósito académico:** Investigación sobre el rol de la IA en decisiones arquitectónicas de software (SDLC). Cada decisión significativa debe registrarse en un ADR usando `ADR_Plantilla.docx`. Las interacciones de asistencia IA con impacto arquitectónico deben documentarse como Registros de Prompts (RP).

**Regla transversal obligatoria — Fidelidad visual contra mockups:**
> Toda pantalla nueva o revisada en Angular **debe ser verificada contra su archivo HTML de referencia** en `md/`. La verificación cubre: layout, jerarquía de componentes, estilos, clases CSS, tipografías, espaciados, grid, responsive y organización del contenido. Cada fase incluye una actividad formal de verificación y ajuste antes de cerrar. Esto es consecuencia directa de las desviaciones detectadas en las pantallas de login y landing.

---

## Decisiones Arquitectónicas Mantenidas

1. **Standalone components** — sin NgModules, Angular 19.
2. **Estado reactivo con Angular Signals** — sin NgRx (no instalado; contexto lo recomendaba pero el proyecto real no lo usa — ADR existente).
3. **Lazy loading por feature** vía `loadChildren` con arrays de rutas.
4. **Mock en memoria** para todos los servicios de datos.
5. **Reactive Forms** estrictos con validadores reutilizables.
6. **Path aliases** `@core/*`, `@shared/*`, `@features/*`, `@env/*`.
7. **SCSS tokens** centralizados.
8. **Smart/Dumb pattern**: pages smart, components presentacionales.

---

## Estructura de Carpetas Objetivo (Revisada)

```
src/app/
├── core/
│   ├── auth/
│   │   ├── guards/            ✅ auth, role, public, producer-approved
│   │   ├── interceptors/      ✅ auth.interceptor
│   │   ├── services/          ✅ auth.service, token-storage.service
│   │   └── models/            ✅ user, auth-response, role.enum, producer-status.enum
│   ├── http/
│   │   └── interceptors/      ✅ base-url, error-handler
│   ├── services/              ✅ notification, loading
│   ├── models/                ✅ api-response, pagination, error
│   └── tokens/                ✅ injection-tokens.ts
│
├── shared/
│   ├── layout/                ✅ navbar, sidebar, footer, page-header, panel-layout, brand-panel
│   │   └── breadcrumb/        ← AÑADIR (B-06)
│   ├── ui/                    ✅ 22 componentes completos
│   ├── directives/            ✅ click-outside, auto-focus, number-only, drag-drop
│   │   ├── scroll-spy/        ← AÑADIR (B-07)
│   │   └── intersection-observer/ ← AÑADIR (B-07)
│   ├── pipes/                 ✅ 5 pipes
│   ├── utils/
│   │   ├── validators/        ✅ 6 validadores
│   │   ├── form.utils.ts      ← AÑADIR (B-08)
│   │   ├── date.utils.ts      ← AÑADIR (B-08)
│   │   └── string.utils.ts    ← AÑADIR (B-08)
│   └── models/                ✅ address, certification, filter-chip
│
└── features/
    ├── auth/                  ✅ + correcciones pendientes
    ├── catalog/               ✅ + completar product-detail
    │   └── components/        + product-options/, product-cta/, product-detail-tabs/,
    │                            flavor-notes/, product-suggestions/ (B-04)
    ├── buyer/                 ← IMPLEMENTAR (FASE 6)
    ├── producer/              ← IMPLEMENTAR (FASE 7)
    └── admin/                 ← IMPLEMENTAR (FASE 8)
```

---

# Estado Actual de las Fases

## ✅ FASE 0 — Preparación del terreno (85%)

Completada con dos observaciones pendientes a resolver en correcciones técnicas:

- ⚠️ `angular.json` sin `fileReplacements` para environments production (B-17)
- ⚠️ Skip-link global no está en `src/index.html` — cada página lo implementa individualmente

**No bloquea el avance. Resolver en FASE 9.**

---

## ✅ FASE 1 — Core (100%)

Guards, interceptors, servicios, modelos y tokens completamente implementados. Usuarios semilla: `buyer@wcm.co`, `producer@wcm.co`, `admin@wcm.co` / contraseña: `Cafe#2025`.

---

## ✅ FASE 2 — Shared UI Library (97%)

22 componentes UI, 4 directivas, 5 pipes, 6 validadores implementados. Pendiente menor: eliminar duplicado `src/app/shared/utils/directives/drag-drop.directive.ts` (archivo en ubicación antigua que no fue eliminado).

---

## ✅ FASE 3 — Shell / Layout (100%)

`BrandPanelComponent` reescrito con SVG copa animada, pilares y textura. Footer, navbar, sidebar, page-header, panel-layout completos.

---

## ⚠️ FASE 4 — Feature: Catalog — Home (88%)

Landing page alineada con mockup. Pendiente:

1. `product-detail.component.ts` usa `signal<any>` — debe ser `signal<IProduct | undefined>` (B-14)
2. Suscripción manual en constructor — reemplazar con `toSignal` + `takeUntilDestroyed` (B-14)
3. ReviewService no usado en product-detail (B-15)
4. Solo 9 productos semilla en lugar de 12-16 (B-18)

**Estas correcciones se realizan en FASE 4B.**

---

## ⚠️ FASE 5 — Feature: Auth (78%)

Login alineado con mockup. Registro funcional pero con brechas:

1. `register.component.ts` pasa `title`/`subtitle` (deprecated no-ops) al BrandPanel (B-12)
2. Flujo de registro no usa `StepIndicatorComponent` (B-13)
3. Rutas post-login navegan a `/buyer`, `/producer`, `/admin` que redirigen a `/` — correcto como placeholder hasta FASE 9, pero las rutas definitivas deben ser `/panel/comprador`, `/panel/productor`, `/panel/admin` (B-03)

**Correcciones de registro en FASE 5B. Rutas en FASE 9.**

---

# Fases Pendientes

---

## FASE 4B — Correcciones Catalog + Pantalla Detalle de Producto

**Referencia visual:** `md/detalle_producto_cafe.html`
**Objetivo:** completar el product-detail con fidelidad exacta al mockup y resolver deudas técnicas de Phase 4.

### 4B.1 Correcciones técnicas (deuda FASE 4)

- Corregir `product-detail.component.ts`:
  - `signal<any>` → `signal<IProduct | undefined>` + tipado estricto
  - Reemplazar suscripción manual con `toSignal(this.product$, { requireSync: false })`
  - Agregar `takeUntilDestroyed` en caso de mantener Observable
- Ampliar `IProduct` con campos requeridos por el mockup:
  ```typescript
  originalPrice?:    number;
  discountPercent?:  number;
  presentationTypes: string[];      // ['Grano entero', 'Molido fino', 'Molido grueso']
  roastLevels:       IRoastLevel[]; // { id, name, icon, sub, selected? }
  flavorNotes:       IFlavorNote[]; // { icon, name, intensity }  0-100
  cuppingScore:      number;        // 0-100
  cuppingAttributes: ICuppingAttr[]; // { label, value } aroma/flavor/body/finish
  soldCount?:        number;
  ```
- Ampliar `ProductService` seed a 12 productos (incluir campos nuevos con datos realistas)
- Crear `product-detail.resolver.ts` que pre-carga el producto por ID antes de activar la ruta

### 4B.2 Componentes nuevos del product-detail

Todos en `features/catalog/components/`:

**`product-gallery/` (refactor)**
- Imagen principal (440px) con emoji flotante animado (`@keyframes floatProd`)
- Badge overlay de certificaciones top-left
- Botón wishlist top-right (toggle active / inactive)
- Thumbs row (4 miniaturas clicables, activa con borde `--espresso`)
- `@Input() images: IProductImage[]`, `@Input() productName: string`
- `@Output() wishlistToggle = new EventEmitter<void>()`

**`product-options/` (nuevo)**
- Sección de opciones de presentación: chips (`opt-chip`) con estados normal/selected/disabled
- Sección de nivel de tostado: chips estilo tarjeta con icono + nombre + sub (`roast-chip`)
- `@Input() presentationTypes: string[]`, `@Input() roastLevels: IRoastLevel[]`
- `@Output() presentationChange`, `@Output() roastChange`

**`product-cta/` (nuevo)**
- Bloque de precio: precio principal (Playfair Display 2.25rem), precio tachado, badge descuento
- Indicador de stock: dot animado (ok/warn/out) + barra visual + texto
- Control de cantidad: `- [n] +` con disable en límites (reutiliza `QuantityControlComponent`)
- Botones CTA: `btn-buy-now` (comprar ahora, scaleX hover) + `btn-add-cart` (agregar al carrito, state `added`) + `btn-wishlist-full`
- Grid de garantías: 3 cards (Envío 24-48h / Devolución 30 días / Pago Seguro)
- Mini-card del productor: avatar + nombre + región + arrow (navega al perfil)
- `@Input() product: IProduct`, `@Input() loading: boolean`
- `@Output() buyNow`, `@Output() addToCart`, `@Output() wishlistToggle`

**`product-detail-tabs/` (nuevo)**
- Tabs: Descripción | Notas de Sabor | Información de Finca
- Cada tab usa clase `d-tab` / `d-tab.active` con indicador `::after`
- Panel activo con `@keyframes fadeUp`
- `@Input() description: string`, `@Input() flavorNotes: IFlavorNote[]`, `@Input() cuppingScore: number`, `@Input() cuppingAttributes: ICuppingAttr[]`, `@Input() farm: IFarmInfo`

**`flavor-notes/` (nuevo)**
- Grid responsive de `flavor-card` (icono 40px circular + nombre + barra de intensidad amber)
- Cupping wheel section: score numérico Playfair 3rem + grid de atributos con barras
- `@Input() notes: IFlavorNote[]`, `@Input() score: number`, `@Input() attributes: ICuppingAttr[]`

**`product-suggestions/` (nuevo)**
- Sección "También te puede interesar"
- Grid horizontal scroll en mobile, 4 columnas en desktop
- Reutiliza `ProductCardComponent`
- `@Input() products: IProduct[]`

### 4B.3 Sección de reseñas en product-detail

- Resumen de calificaciones: grid 200px + 1fr
  - Score grande Playfair (4rem), stars, total reseñas
  - Distribución por estrella (5 barras `bar-fill` proporcionales)
- Lista de `review-card`: avatar iniciales + nombre + fecha + stars + badge "Compra verificada" + texto + botón "¿Fue útil?"
- `ReviewService.getByProduct(productId)` → retorna 3-5 reseñas mock
- Actualizar modelo `IReview`: `userName`, `userInitials`, `isVerifiedPurchase`, `helpfulCount`, `date`

### 4B.4 Actualizar `product-detail.component.ts` (smart page)

```
Layout:
- Breadcrumb (Inicio > Catálogo > [nombre])  ← usa BreadcrumbComponent
- product-section: grid 1fr / 480px
  ├─ Columna izquierda: app-product-gallery (sticky)
  └─ Columna derecha: app-info-top + app-product-options + app-product-cta

- detail-section: full-width bajo el grid
  └─ app-product-detail-tabs

- reviews-section: full-width
  └─ Resumen + lista reviews

- app-product-suggestions
```

### 4B.5 Shared: BreadcrumbComponent

- `shared/layout/breadcrumb/breadcrumb.component.ts`
- `@Input() items: IBreadcrumbItem[]` — `{ label, route? }`
- Último ítem sin enlace (`.bc-current`), anteriores con `.bc-link`
- Barra separadora `.bc-sep` con `›`

### 4B.6 Routing catalog

- `catalog.routes.ts`: ruta `/productos/:id` usa `product-detail.resolver.ts` para pre-cargar
- Navegación desde `ProductCardComponent` al hacer clic en la card (routerLink o output)

### 4B.7 Verificación de fidelidad — OBLIGATORIA

> Comparar implementación Angular contra `md/detalle_producto_cafe.html`:
> - Layout: grid `1fr 480px`, sticky gallery, breadcrumb
> - Tipografías: Playfair Display en título, precio, cupping score
> - Badges de certificación con colores semánticos correctos (verde/amber/azul)
> - Animación `floatProd` en emoji del producto
> - Tabs con indicador `::after` activo
> - Responsive: colapso a 1 columna en ≤ 900px, thumbs scroll horizontal en mobile
> - Botones CTA con `::before scaleX` hover
> - Stock dot con animación `blink` en estado warn

### 4B.8 Corrección punto de compilación

- `npm run build && npm run lint` sin errores nuevos

---

## FASE 5B — Correcciones Feature Auth

**Objetivo:** cerrar las brechas detectadas en FASE 5.

### 5B.1 Corregir `register.component.ts`

- Reemplazar `title="..."` y `subtitle="..."` (deprecated no-ops) por `headlineHtml` y `description`:
  ```html
  <app-brand-panel
    headlineHtml="Únete a la<br>comunidad <em>cafetera.</em>"
    description="Crea tu cuenta y conecta con productores de café sostenible colombiano."
  ></app-brand-panel>
  ```
- Integrar `StepIndicatorComponent` de `shared/ui/step-indicator/` en lugar de la barra artesanal actual
- Validar que `register.component.scss` usa el mismo layout que el reescrito `login.component.scss` (`.layout` + `.panel-form`)

### 5B.2 Verificación de fidelidad — OBLIGATORIA

> Comparar `register.component` + sub-componentes contra `md/registro_marketplace_cafe.html`:
> - Layout split 1fr/1fr con BrandPanel izquierdo idéntico al login
> - Step indicator con círculos numerados y conectores
> - Paso 1: role-selector con 3 cards (Comprador / Productor / Administrador) con iconos y descripciones
> - Paso 2a: personal-data-step con todos los campos + password strength meter
> - Paso 2b: role-specific-step con campos diferenciados por rol
> - Mobile: mobile-brand-bar fija + formulario full-width
> - Validaciones en tiempo real visibles

### 5B.3 Verificación punto de compilación

- `npm run build` sin errores

---

## FASE 6 — Feature: Buyer (panel comprador)

**Referencia visual:** `md/panel_comprador_cafe.html`
**Ruta definitiva:** `/panel/comprador`

### 6.1 Modelos

```
features/buyer/models/
├── cart.model.ts        (ICart, ICartItem con precio congelado)
├── order.model.ts       (IOrder, IOrderItem, OrderStatus enum)
├── shipping.model.ts    (IShippingOption)
└── checkout.model.ts    (ICheckoutPayload)
```

### 6.2 Servicios

- `cart.service.ts` — signal-based:
  - `items = signal<ICartItem[]>([])`
  - `subtotal`, `tax`, `discount`, `total` como `computed`
  - `add(product, qty)` — respeta stock máximo
  - `remove(itemId)`, `updateQty(itemId, qty)`, `applyCoupon(code)`, `clear()`
  - Persistencia en `localStorage` via `TokenStorageService` (SSR-safe)

- `order.service.ts` — 4 pedidos semilla (estados variados). `list()`, `getById()`, `cancel(id)` (solo si confirmed), `submitReview(orderId, productId, rating, comment)`

- `address.service.ts` — CRUD local. 2 direcciones semilla. `list()`, `create()`, `setDefault(id)`

### 6.3 Componentes

```
features/buyer/components/
├── cart-item-row/       (imagen-emoji, nombre, precio unitario, qty-control, subtotal, eliminar)
├── cart-summary/        (subtotal, envío, descuento, total, btn-checkout)
├── shipping-selector/   (lista opciones con radio estilizado)
├── coupon-input/        (input + btn "Aplicar", estado error/éxito inline)
├── address-card/        (label, dirección, badge "Predeterminada", acciones editar/eliminar)
├── order-card/          (número pedido, fecha, total, estado pill, expandible con items)
├── order-stepper/       (progress stepper: confirmed/preparing/shipped/delivered)
└── review-modal/        (rating-stars + textarea, dentro de ModalComponent)
```

### 6.4 Página

- `pages/buyer-dashboard/buyer-dashboard.component.ts`
  - Usa `PanelLayoutComponent` con `SidebarItem[]`: Carrito (badge=cartCount) | Pedidos | Favoritos | Perfil
  - Tab activo controlado por signal o sub-rutas (preferir tabs internas para replicar mockup)
  - StatCards: total gastado, pedidos realizados, favoritos guardados, reseñas escritas

### 6.5 Pestaña Perfil (HU-04 — B-10)

- Formulario de actualización: nombre, teléfono, email (readonly), foto avatar
- Sección de contraseña: contraseña actual + nueva + confirmar
- Gestión de direcciones (lista + formulario inline)
- Consentimiento de privacidad visible (RNF-PRI-01/02)

### 6.6 Routing y guards

```typescript
// buyer.routes.ts
export const BUYER_ROUTES: Routes = [
  { path: '', component: BuyerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: Role.BUYER } }
];
```

Actualizar `app.routes.ts`:
```typescript
{ path: 'panel/comprador',
  loadChildren: () => import('@features/buyer/buyer.routes').then(m => m.BUYER_ROUTES) }
```

### 6.7 Verificación de fidelidad — OBLIGATORIA

> Comparar implementación contra `md/panel_comprador_cafe.html`:
> - PanelLayout: sidebar con logo WCM + nav items + badge de carrito
> - StatCards en la cabecera del dashboard
> - Vista Carrito: cart-item-rows + cart-summary sticky
> - Coupon input con feedback visual
> - Vista Pedidos: order-cards expandibles + order-stepper
> - Empty states para carrito vacío y sin pedidos
> - Responsive: sidebar colapsado en mobile (menú hamburguesa)

### 6.8 Verificación punto de compilación

- `npm run build && npm run lint` ✅

---

## FASE 7 — Feature: Producer (panel productor)

**Referencia visual:** `md/panel_productor_cafe.html`
**Ruta definitiva:** `/panel/productor`

### 7.1 Refactor feature existente

Mover `features/product-management/` → `features/producer/`:
- `components/product-form/` → `features/producer/components/product-form/` (sin cambios funcionales)
- `containers/product-dashboard/` → `features/producer/pages/my-products/`
- `constants/product.constants.ts` → `features/producer/constants/`
- Actualizar todos los imports rotos

### 7.2 Modelos nuevos

```
features/producer/models/
├── managed-product.model.ts   (IProductManaged: extiende IProduct con status, sales, revenue)
├── received-order.model.ts    (IReceivedOrder: orderId, buyerName, items, status, date)
└── farm.model.ts              (IFarm: name, municipality, department, altitude, area, description)
```

### 7.3 Servicios

- `producer-product.service.ts` — CRUD sobre lista mock. `list()`, `create()`, `update()`, `toggleStatus()`, `remove()`. 5 productos semilla del productor `u2`.
- `producer-order.service.ts` — `list()`, `updateStatus(orderId, newStatus)`. Flujo unidireccional; bloquear retrocesos.
- `farm.service.ts` — `get()`, `update()`. 1 finca semilla para `u2`.

### 7.4 Componentes nuevos

```
features/producer/components/
├── product-table-row/     (fila tabla: imagen-emoji, nombre, estado pill, precio, stock, acciones)
├── received-order-row/    (número pedido, comprador, items count, total, status-select)
├── farm-info-card/        (datos de finca: municipio, departamento, altitud, área)
├── farm-map/              (SVG estilizado con pin animado — decorativo)
├── certification-list/    (lista de certificaciones con iconos y fechas)
├── sales-mini-chart/      (SVG de barras simples para ingresos por mes — 6 barras)
└── status-select/         (dropdown con opciones colored; deshabilita estados anteriores al actual)
```

### 7.5 Página

- `pages/producer-dashboard/producer-dashboard.component.ts`
  - Usa `PanelLayoutComponent` con sidebar: Mis Productos | Mi Finca | Pedidos Recibidos | Rendimiento
  - StatCards: ingresos este mes, ventas totales, rating promedio, productos activos
  - "Mis Productos": tabla con paginación mock + botón "Nuevo Producto" abre modal con ProductFormComponent
  - "Mi Finca": farm-info-card + certification-list + farm-map
  - "Pedidos Recibidos": tabla de received-order-row con status-select
  - "Rendimiento": sales-mini-chart + stats secundarias

### 7.6 Verificación de documentos del productor (HU-05 — B-11)

- Sección en perfil del productor: lista de documentos con tipo y estado (`pending/approved/rejected`)
- `UploadZoneComponent` para cargar cedula/RUT/cámara y comercio
- `ProducerStatus` visible en la cabecera del panel: badge `APROBADO / PENDIENTE / RECHAZADO`

### 7.7 Routing y guards

```typescript
// producer.routes.ts
export const PRODUCER_ROUTES: Routes = [
  { path: '', component: ProducerDashboardComponent,
    canActivate: [authGuard, roleGuard, producerApprovedGuard],
    data: { role: Role.PRODUCER } }
];
```

Actualizar `app.routes.ts`:
```typescript
{ path: 'panel/productor',
  loadChildren: () => import('@features/producer/producer.routes').then(m => m.PRODUCER_ROUTES) }
```

### 7.8 Verificación de fidelidad — OBLIGATORIA

> Comparar contra `md/panel_productor_cafe.html`:
> - Layout sidebar + main idéntico al del mockup
> - Tabla de productos con columnas exactas del mockup (imagen/nombre/estado/precio/stock/acciones)
> - Status-select con colores semánticos (confirmed=azul, preparing=amber, shipped=verde-fresco, delivered=verde-selva)
> - Flujo unidireccional verificado: estados anteriores deshabilitados en el select
> - Farm-map con el pin SVG animado
> - Sales chart con datos mock coherentes

### 7.9 Verificación de specs existentes

- Los `.spec.ts` de `ProductFormComponent`, `ProductDashboardComponent` y `ModalComponent` deben seguir pasando tras el refactor de rutas.

### 7.10 Verificación punto de compilación

- `npm run build && npm run lint` ✅

---

## FASE 8 — Feature: Admin (panel administrador)

**Referencia visual:** `md/panel_admin_cafe.html`
**Ruta definitiva:** `/panel/admin`

### 8.1 Modelos

```
features/admin/models/
├── producer-approval.model.ts   (IProducerApproval: id, producerName, email, submittedAt, status, docs[])
├── admin-category.model.ts      (IAdminCategory: id, name, parentId?, isActive, productCount)
├── admin-user.model.ts          (IAdminUser: id, fullName, email, roles[], status, createdAt)
└── activity.model.ts            (IActivity: id, action, entityType, entityId, userName, timestamp)
```

### 8.2 Servicios

- `producer-approval.service.ts` — `listPending()` (3 registros semilla), `listAll()`, `approve(id)`, `reject(id, reason)`.
- `admin-category.service.ts` — CRUD completo. `list()`, `create()`, `update()`, `delete(id)` — bloquear si `productCount > 0` (RN-5).
- `admin-user.service.ts` — `list()`, `suspend(id)`, `reactivate(id)`, `delete(id)`. 5 usuarios semilla.
- `admin-activity.service.ts` — `getFeed()` — 10 eventos mock (login, order_created, producer_approved, etc.)

### 8.3 Componentes

```
features/admin/components/
├── pending-producer-card/     (card con datos del productor + docs + btns aprobar/rechazar)
├── producer-detail-modal/     (modal con perfil completo, documentos y acciones — usa ModalComponent)
├── producer-table-row/        (fila: avatar, nombre, email, estado pill, fecha, acciones)
├── category-table-row/        (nombre, productos activos, badge activo/inactivo, editar/eliminar)
├── category-form/             (nombre, padre opcional — inline o modal)
├── user-table-row/            (avatar-iniciales, nombre, email, rol-badge, estado, acciones)
├── rejection-reason-field/    (textarea condicional que aparece al clic en "Rechazar")
└── activity-feed-item/        (icono por tipo de acción + texto + timestamp relativo con RelativeTimePipe)
```

### 8.4 Página

- `pages/admin-dashboard/admin-dashboard.component.ts`
  - `PanelLayoutComponent` con sidebar: Aprobaciones Pendientes (badge=pendingCount) | Productores | Categorías | Usuarios | Actividad
  - StatCards: solicitudes pendientes, productores activos, categorías, usuarios totales
  - "Aprobaciones": lista de `pending-producer-card` — clic abre `producer-detail-modal`
  - "Productores": tabla con `producer-table-row` + filtro por estado
  - "Categorías": tabla con `category-table-row` + botón "Nueva Categoría" abre `category-form`
  - "Usuarios": tabla con `user-table-row` + acciones de suspensión
  - "Actividad": feed cronológico de `activity-feed-item`

### 8.5 Routing y guards

```typescript
// admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN } }
];
```

Actualizar `app.routes.ts`:
```typescript
{ path: 'panel/admin',
  loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES) }
```

### 8.6 Verificación de fidelidad — OBLIGATORIA

> Comparar contra `md/panel_admin_cafe.html`:
> - Panel de aprobaciones con cards idénticas al mockup (documentos, fechas, botones)
> - `producer-detail-modal` con overlay, trap de foco y cierre con Escape
> - Tabla de categorías con bloqueo visual del botón eliminar cuando `productCount > 0`
> - User-table con badge de rol coloreado (buyer=azul, producer=amber, admin=púrpura)
> - Activity feed con iconos por tipo y timestamps relativos

### 8.7 Verificación punto de compilación

- `npm run build && npm run lint` ✅

---

## FASE 9 — Integración global, routing correcto y navegación por rol

**Objetivo:** cablear todas las features, corregir rutas definitivas y completar la navegación end-to-end.

### 9.1 Corrección de rutas (B-03)

Reescribir `src/app/app.routes.ts` con rutas definitivas:

```typescript
export const routes: Routes = [
  { path: '',
    loadChildren: () => import('@features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES) },
  { path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [publicGuard] },
  { path: 'panel/comprador',
    loadChildren: () => import('@features/buyer/buyer.routes').then(m => m.BUYER_ROUTES),
    canActivate: [authGuard, roleGuard], data: { role: Role.BUYER } },
  { path: 'panel/productor',
    loadChildren: () => import('@features/producer/producer.routes').then(m => m.PRODUCER_ROUTES),
    canActivate: [authGuard, roleGuard, producerApprovedGuard], data: { role: Role.PRODUCER } },
  { path: 'panel/admin',
    loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, roleGuard], data: { role: Role.ADMIN } },
  { path: '**', redirectTo: '' }
];
```

Actualizar `AuthService.navigateByRole()`:
```typescript
private readonly roleRoutes: Record<Role, string> = {
  [Role.BUYER]:    '/panel/comprador',
  [Role.PRODUCER]: '/panel/productor',
  [Role.ADMIN]:    '/panel/admin',
};
```

### 9.2 Navbar pública con menú de usuario

- `LandingNavbarComponent`: cuando `authService.isAuthenticated()` es true, reemplazar btns login/registro por:
  - Avatar con iniciales + nombre corto
  - Dropdown: "Mi Panel" (navega por rol) + "Cerrar sesión" → `auth.logout()`

### 9.3 Corrección `angular.json` — fileReplacements (B-17)

Añadir bloque `fileReplacements` en la configuración `production` del `architect.build`:
```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

### 9.4 SSR — `app.routes.server.ts`

Revisar `src/app/app.routes.server.ts`:
- Rutas públicas (`/`, `/productos/:id`, `/auth/*`): `RenderMode.Prerender` o `RenderMode.Client`
- Rutas privadas (`/panel/*`): `RenderMode.Server` (no pre-renderizar datos de usuario)

### 9.5 Registros de Decisión Arquitectónica (ADR) — Propósito académico

Completar un ADR por cada decisión significativa no documentada aún, usando `ADR_Plantilla.docx`:
- ADR sobre uso de Signals vs NgRx
- ADR sobre mock-in-memory vs API real
- ADR sobre rutas path con `/panel/` prefix
- ADR sobre `publicGuard` vs interceptor para protección de rutas auth

### 9.6 Verificación end-to-end

- Flujo: landing → producto-detalle → login (buyer) → panel comprador → logout
- Flujo: login (producer) → panel productor → nueva producto → logout
- Flujo: login (admin) → panel admin → aprobar productor → logout
- Guards: comprador no entra a `/panel/productor` ni `/panel/admin` (redirige a su panel)
- `publicGuard`: usuario autenticado que accede a `/auth/login` redirige a su panel

---

## FASE 10 — Accesibilidad, Responsive Final y Pulido Visual

**Objetivo:** auditoría WCAG AA + responsive completo en todos los breakpoints del contexto.

### 10.1 Breakpoints del contexto a validar en todas las pantallas

Según `PROYECTO_CONTEXT.md §12` (RNF-USA-01):
- 380px (móvil pequeño)
- 500px (móvil estándar)
- 768px (tablet portrait)
- 900px (tablet landscape / punto crítico auth + paneles)
- 1024px (laptop)
- 1280px (desktop)

### 10.2 Accesibilidad

- Auditoría WCAG AA: contraste 4.5:1 en texto normal, 3:1 en texto grande y UI
- `aria-required`, `aria-invalid`, `aria-describedby` verificados en todos los inputs
- `aria-live="polite"` en toasts, mensajes de error y actualizaciones dinámicas
- `role="dialog"` + `aria-modal="true"` + trap de foco en todos los modales
- Navegación por teclado completa: Tab, Shift+Tab, Enter, Escape, flechas en dropdowns
- Skip-link funcional en todas las páginas (verificar en `index.html` y por componente)
- Imágenes decorativas con `aria-hidden="true"` (SVGs, emojis)

### 10.3 Pulido visual transversal

- Verificar animaciones `fadeSlideUp` y `vapor` funcionan correctamente (no hay reduce-motion override)
- Grain/texture overlay sutil en secciones oscuras (espresso background)
- Skeleton loaders en estados de carga (ProductGrid, OrdersList, AdminTable)
- Empty states en: carrito vacío, sin pedidos, sin productos, sin usuarios filtrados
- Focus visible uniforme: `outline: 3px solid var(--espresso); outline-offset: 2px` en todos los interactivos

---

## FASE 11 — Validación Final de Compilación y Calidad

**Objetivo crítico:** el proyecto compila sin errores, lint sin errores, SSR funciona.

### 11.1 Checklist obligatorio

- [ ] `npx tsc --noEmit` → 0 errores TypeScript (strictTemplates, no-implicit-any)
- [ ] `npm run lint` → 0 errores. Solo warnings pre-existentes y documentados tolerados
- [ ] `npm run build` → build production exitoso, sin errores de budget
- [ ] `npm run build && npm run serve:ssr:marketplace-cafe-front` → SSR renderiza `/` sin errores. Ningún servicio accede `window`/`document`/`localStorage` directamente sin `isPlatformBrowser`
- [ ] Sin `console.log` sobrantes (solo `console.error` intencional en error interceptor)
- [ ] Sin uso de `any` — `signal<any>`, `as any`, tipados genéricos sin parámetro
- [ ] Sin `// eslint-disable` para silenciar errores — solo correcciones reales
- [ ] Sin `TODO:` sin issue asociado (excepto los documentados como mejoras futuras)

### 11.2 Verificación de navegación completa

- [ ] landing → login (buyer) → `/panel/comprador` → logout → `/auth/login`
- [ ] login (producer) → `/panel/productor` → logout
- [ ] login (admin) → `/panel/admin` → aprobar productor → logout
- [ ] Acceso directo a `/panel/admin` sin auth → redirige a `/auth/login`
- [ ] Acceso de buyer a `/panel/productor` → redirige a `/panel/comprador`

### 11.3 Cierre formal

- Commit final con mensaje convencional:
  ```
  feat: convert all HTML mockups to Angular — catalog, auth, buyer, producer, admin panels
  ```
- Actualizar `CLAUDE.md` con la estructura final de features
- Completar los ADRs pendientes identificados en FASE 9

---

## Resumen ejecutivo del plan

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Preparación / Tokens / Config | ✅ 85% |
| 1 | Core — auth, guards, servicios | ✅ 100% |
| 2 | Shared UI Library | ✅ 97% |
| 3 | Shell / Layout | ✅ 100% |
| 4 | Catalog — Home / Landing | ✅ 88% |
| **4B** | **Product Detail (detalle_producto_cafe.html)** | **⏳ PENDIENTE** |
| 5 | Auth — Login / Registro / Forgot Password | ⚠️ 78% |
| **5B** | **Correcciones Registro + Fidelidad Visual** | **⏳ PENDIENTE** |
| 6 | Buyer — Panel Comprador | ❌ 0% |
| 7 | Producer — Panel Productor | ❌ 0% |
| 8 | Admin — Panel Administrador | ❌ 0% |
| 9 | Integración global + rutas definitivas + ADRs | ❌ 0% |
| 10 | Accesibilidad y responsive final | ❌ 0% |
| 11 | Validación final de compilación | ❌ 0% |

**Próxima fase a implementar: FASE 4B — Pantalla de Detalle de Producto**

---

## Archivos críticos a modificar (referencia rápida)

| Archivo | Cambio | Fase |
|---------|--------|------|
| `src/app/app.routes.ts` | Rutas definitivas `/panel/comprador|productor|admin` | 9 |
| `src/app/core/auth/services/auth.service.ts` | `navigateByRole` con rutas correctas | 9 |
| `angular.json` | `fileReplacements` production | 9 |
| `src/app/app.routes.server.ts` | `RenderMode` por ruta | 9 |
| `features/catalog/models/product.model.ts` | Campos de detalle: flavorNotes, cuppingScore, etc. | 4B |
| `features/catalog/services/product.service.ts` | Ampliar semilla a 12 productos con datos completos | 4B |
| `features/auth/pages/register/register.component.ts` | `headlineHtml`/`description` + StepIndicator | 5B |

---

## Componentes de referencia para cada pantalla (mockup → implementación)

| Mockup HTML | Pantalla Angular | Verificado |
|-------------|-----------------|-----------|
| `landing_marketplace_cafe.html` | `features/catalog/pages/home/` | ✅ |
| `login_ux_marketplace_cafe.html` | `features/auth/pages/login/` | ✅ |
| `registro_marketplace_cafe.html` | `features/auth/pages/register/` | ⚠️ Parcial |
| `detalle_producto_cafe.html` | `features/catalog/pages/product-detail/` | ❌ Pendiente |
| `panel_comprador_cafe.html` | `features/buyer/pages/buyer-dashboard/` | ❌ Pendiente |
| `panel_productor_cafe.html` | `features/producer/pages/producer-dashboard/` | ❌ Pendiente |
| `panel_admin_cafe.html` | `features/admin/pages/admin-dashboard/` | ❌ Pendiente |

---

*Plan v2.0 — World Coffee Marketplace · UNAB 2026-04-20*
*Generado con base en análisis comparativo entre PROYECTO_CONTEXT.md y PLAN.md v1.0*
