# PROJECT_PROGRESS_CONTEXT.md
## World Coffee Marketplace — Memoria Técnica Acumulativa
**Última actualización:** 2026-04-21 (correctivos globales: carrito desconectado + navbar auth state) | **Fuente de verdad:** este archivo + `PLAN.md`

> ⚠️ **Divergencia con PLAN.md:** La tabla resumen al final de `PLAN.md` aún muestra Fases 6, 7, 8 como ❌ 0%. Eso es incorrecto — `PLAN.md` no se actualizó tras la implementación. El estado real es el que documenta **este archivo**. No usar la tabla final de `PLAN.md` como referencia de progreso.

---

## 🔑 Regla de uso

Antes de implementar cualquier fase, consultar este archivo para:
- Conocer el estado real del proyecto (no el del PLAN.md, que puede diferir)
- Respetar las decisiones arquitectónicas ya tomadas
- Evitar reescribir lo que ya existe
- Identificar deuda técnica acumulada

---

## 1. Stack y Configuración

| Ítem | Valor |
|------|-------|
| Framework | Angular 19, standalone, SSR (Express) |
| Gestión de estado | Angular Signals (`signal`, `computed`, `effect`) — sin NgRx |
| Estilos | SCSS con design tokens centralizados en `src/styles/_tokens.scss` |
| Formularios | Reactive Forms estrictos |
| I/O de componentes | `input()` / `output()` signal-based (NO `@Input()/@Output()`) |
| DI | `inject()` en campo (NO constructor injection) |
| Change detection | `ChangeDetectionStrategy.OnPush` en todos los componentes |
| Lazy loading | `loadChildren` con arrays de rutas por feature |
| Path aliases | `@core/*`, `@shared/*`, `@features/*`, `@env/*` |
| Tests | Karma/Jasmine (no modificar specs existentes sin causa) |
| Build CI | `npm run build` — solo warnings tolerados: `darken()` SCSS deprecation en `product-form` y `cart-summary`, `NgClass`/`RouterLink` unused en `button.component`, `cart-summary`, `buyer-dashboard`, CSS budget >8KB en `admin` y `producer` dashboards |

---

## 2. Usuarios Semilla (Mock Auth)

| Email | Password | Rol | ID |
|-------|----------|-----|-----|
| `buyer@wcm.co` | `Cafe#2025` | BUYER | u1 |
| `producer@wcm.co` | `Cafe#2025` | PRODUCER (APPROVED) | u2 |
| `admin@wcm.co` | `Cafe#2025` | ADMIN | u3 |

`AuthService` navega post-login según rol a: `/buyer` (actual) → pendiente migrar a `/panel/comprador` en Fase 9.

---

## 3. Design Tokens Clave (`src/styles/_tokens.scss`)

```scss
--espresso: #372617     // color primario, fondo navbar/sidebar
--cafe-oscuro: #3e2919  // hover de espresso
--cafe-medio: #7a5c42   // texto secundario
--marfil: #e4dcd1       // texto sobre fondos oscuros
--marfil-light: #ede6dd // fondo de secciones claras
--blanco: #f7f3ef       // fondo general
--verde-fresco: #4a8c56 // CTA secundario, pills activos
--verde-selva: #1e5e29  // estado "entregado/aprobado"
--verde-light: #d4ead7  // fondo badge verde
--amber: #c07820        // advertencia, calificaciones
--amber-light: #fff0d0  // fondo badge amber
--error: #8b2020        // errores
--error-light: #fee2e2  // fondo badge error
--blue-info: #1a6b8a    // información (no es --blue-rain)
--blue-light: #e0f2f8   // fondo badge azul  (definido en mockups como #E0F2F8, NO en tokens globales — usar inline)
--nav-h: 68px           // altura navbar pública
--font-display: 'Playfair Display', Georgia, serif
--font-body: 'Mulish', 'Segoe UI', sans-serif
--r-sm/md/lg/xl: 6/10/16/24px
--shadow-sm/md/lg/card/xl
```

> ⚠️ `--blue-light` y `--blue-info` NO están en `_tokens.scss` global. Usar `rgba` o definir inline en cada componente que los necesite.
> ⚠️ `--purple: #5B3E8F` y `--purple-light: #EDE8F8` solo en mockups del admin — definir inline.

---

## 4. Estructura de Carpetas Real (estado 2026-04-21)

```
src/app/
├── core/
│   ├── auth/
│   │   ├── guards/          auth.guard, public.guard, role.guard, producer-approved.guard
│   │   ├── interceptors/    auth.interceptor
│   │   ├── services/        auth.service, token-storage.service
│   │   └── models/          user.model, auth-response.model, role.enum, producer-status.enum
│   ├── http/interceptors/   base-url.interceptor, error-handler.interceptor
│   ├── services/            notification.service, loading.service
│   ├── models/              api-response, error, pagination
│   └── tokens/              injection-tokens.ts
│
├── shared/
│   ├── layout/
│   │   ├── navbar/          ← navbar de paneles internos (NOT la pública)
│   │   ├── landing-navbar/  ← navbar pública (catálogo, product-detail) — autocontenida: inyecta AuthService + CartService directamente; NO requiere inputs de parent
│   │   ├── dashboard-nav/   ← navbar fija para paneles buyer/producer/admin ✅ Fase 6
│   │   ├── sidebar/         ← sidebar genérico (PanelLayout)
│   │   ├── footer/
│   │   ├── page-header/
│   │   ├── panel-layout/    ← layout shell: navbar + sidebar + main + footer
│   │   └── brand-panel/     ← panel izquierdo auth (SVG copa, pilares, textura)
│   ├── ui/                  22 componentes: avatar, badge, button, checkbox, confirm-dialog,
│   │                         empty-state, filter-chips, input, loading-spinner, modal,
│   │                         password-strength-meter, quantity-control, rating-stars, select,
│   │                         skeleton, stat-card, status-pill, step-indicator, stock-indicator,
│   │                         tabs, textarea, toast/toast-host, toggle, upload-zone
│   ├── pipes/               certification-label, currency-cop, order-status, relative-time, truncate
│   ├── directives/          click-outside, auto-focus, number-only, drag-drop
│   │                         ⚠️ DUPLICADO: shared/utils/directives/drag-drop.directive.ts
│   ├── models/              address.model, certification.model, filter-chip.model
│   └── utils/validators/    email, password, match-field, array-min-length, positive-number, required-file
│
└── features/
    ├── auth/                ✅ login, register, forgot-password + sub-componentes
    ├── catalog/             ✅ home, product-detail + todos los sub-componentes
    ├── buyer/               ✅ Fase 6 completada
    │   ├── models/          cart.model, order.model, shipping.model, checkout.model
    │   ├── services/        cart.service (signal-based), order.service, address.service
    │   ├── components/      cart-item-row, cart-summary, order-card, order-stepper, review-modal
    │   └── pages/dashboard/ BuyerDashboardComponent (smart, refactorizado)
    ├── producer/            ✅ Fase 7 completada
    │   ├── models/          managed-product.model, received-order.model, farm.model
    │   ├── services/        producer-product.service (signal-based), producer-order.service, farm.service
    │   ├── components/      product-table-row, received-order-row, farm-info-card,
    │   │                     farm-map, certification-list, sales-mini-chart
    │   └── pages/dashboard/ ProducerDashboardComponent (smart, refactorizado)
    ├── admin/               ⚠️ dashboard básico (ver deuda en §6)
    └── product-management/  ← LEGACY: conservado intacto (specs); producer importa ProductFormComponent desde aquí
```

---

## 5. Estado Real de Fases

### FASE 0 — Preparación (85% ✅)
- **Completo:** tokens, reset, tipografías, animaciones, accesibilidad, responsive base
- **Pendiente (Fase 9):** `angular.json` sin `fileReplacements` para production environments

### FASE 1 — Core (100% ✅)
- Guards: `authGuard`, `publicGuard`, `roleGuard`, `producerApprovedGuard`
- Interceptors: `authInterceptor`, `baseUrlInterceptor`, `errorHandlerInterceptor`
- Services: `AuthService` (con mock users), `TokenStorageService`, `NotificationService`, `LoadingService`
- Modelos: `IUser`, `ILoginCredentials`, `IRegisterPayload`, `Role`, `ProducerStatus`

### FASE 2 — Shared UI Library (97% ✅)
- 22 componentes UI completos
- Pendiente menor: eliminar `shared/utils/directives/drag-drop.directive.ts` (duplicado)

### FASE 3 — Shell / Layout (100% ✅)
- `BrandPanelComponent` con SVG copa animada, pilares y textura de fondo
- `PanelLayoutComponent`, `NavbarComponent`, `SidebarComponent`, `FooterComponent`, `PageHeaderComponent`

### FASE 4 + 4B — Catalog (100% ✅)
Completado en sesiones previas. Incluye:
- **`HomeComponent`** (`/`): landing completa con hero, filtros, grid, sostenibilidad, productores, footer
- **`ProductDetailComponent`** (`/productos/:id`): product-gallery, product-options, product-cta, product-detail-tabs, flavor-notes, product-suggestions, sección de reseñas
- **Resolver:** `ProductDetailResolver` pre-carga el producto por ID
- **`IProduct` completo** con: `originalPrice`, `discountPercent`, `presentationTypes`, `roastLevels`, `flavorNotes`, `cuppingScore`, `cuppingAttributes`, `farmInfo`, `soldCount`
- **12 productos semilla** en `ProductService`
- **`LandingNavbarComponent`** movido a `shared/layout/landing-navbar/` (reutilizable); archivo original en `catalog/components/landing-navbar/` es un re-export `@deprecated`
- **Componentes nuevos en `catalog/components/`:** `product-gallery`, `product-options`, `product-cta`, `product-detail-tabs`, `flavor-notes`, `product-suggestions`

> ⚠️ **Correctivo 2026-04-21 — Carrito desconectado:** `HomeComponent` y `ProductDetailComponent` tenían `protected readonly cartCount = signal<number>(0)` como signal local efímero con un `// TODO: conectar con CartService` nunca implementado. `onAddToCart()` solo incrementaba ese signal local; el `CartService` singleton nunca recibía los ítems. **Corregido:** ambos componentes ahora inyectan `CartService` y llaman `cartSvc.add()`. El binding `[cartCount]` y el output `(cartClick)` del `LandingNavbar` fueron eliminados — ya no son responsabilidad del padre.

### CORRECTIVOS TRANSVERSALES — 2026-04-21 (post Fase 7)

Dos bugs estructurales detectados y resueltos tras la revisión de integración entre catálogo y paneles:

**Bug 1 — CartService desconectado del catálogo** *(resuelto)*
- **Causa raíz:** `HomeComponent` y `ProductDetailComponent` tenían signals locales `cartCount = signal(0)` con TODOs nunca implementados. `onAddToCart()` escribía en esos signals efímeros; el `CartService` (singleton en root) nunca se enteraba.
- **Efecto:** ítems "agregados" desde el catálogo no aparecían en el BuyerDashboard.
- **Solución:** ambos componentes inyectan `CartService`; `onAddToCart()` llama `cartSvc.add(item)`. `cartCount` ahora es `this.cartSvc.count` (signal computado del singleton).
- **Archivos modificados:** `catalog/pages/home/home.component.ts`, `catalog/pages/product-detail/product-detail.component.ts`

**Bug 2 — LandingNavbar ciega al estado de autenticación** *(resuelto)*
- **Causa raíz:** `LandingNavbarComponent` no inyectaba `AuthService` ni `CartService`. Los botones "Iniciar sesión" y "Registrarse" eran elementos HTML estáticos sin ningún `@if`. El navbar no tenía conocimiento del estado de sesión.
- **Efectos:**
  - Usuarios autenticados seguían viendo los botones de login/registro.
  - Al hacer clic en "Iniciar sesión" estando autenticado, el `publicGuard` (que sí funcionaba) redirigía al panel — confundiendo al usuario sobre qué había pasado.
  - El botón del carrito emitía `cartClick` como output pero ningún padre lo manejaba realmente.
- **Solución:** `LandingNavbarComponent` refactorizado completamente:
  - Inyecta `AuthService`, `CartService`, `Router`
  - `isLoggedIn = computed(() => this.auth.isAuthenticated())`
  - `userRole = computed(() => this.auth.currentUser()?.role)`
  - `firstName = computed(() => this.auth.currentUser()?.fullName.split(' ')[0])`
  - `cartCount = this.cartSvc.count` (signal del singleton, sin input externo)
  - Template: `@if (!isLoggedIn())` bloque auth / `@if (isLoggedIn())` bloque usuario autenticado con carrito, notificaciones, avatar, nombre y logout
  - `goToCart()` → navega a `/buyer`; `goToDashboard()` → navega por rol; `logout()` → `auth.logout()`
  - Eliminados: input `[cartCount]` y output `(cartClick)` — el navbar es ahora autocontenido
  - Nuevos estilos: `.nav-icon-btn`, `.nav-user-btn`, `.nav-avatar`, `.nav-username`, `.cart-badge`
- **Archivos modificados:** `shared/layout/landing-navbar/landing-navbar.component.ts|html|scss`
- **Archivos limpiados:** bindings `[cartCount]` y `(cartClick)` eliminados de `home.component.ts` y `product-detail.component.ts`

---

### FASE 5 + 5B — Auth (100% ✅)
Completado. Incluye:
- **`LoginComponent`** (`/auth/login`): split layout con BrandPanel, login-form, forgot-password link
- **`RegisterComponent`** (`/auth/register`): flujo 2 pasos — role-selector (Paso 1) → personal-data-step + role-specific-step (Paso 2)
- **`ForgotPasswordComponent`** (`/auth/forgot-password`): form de email, toast info
- **Sub-componentes:** `LoginFormComponent`, `RoleSelectorComponent`, `PersonalDataStepComponent`, `RoleSpecificStepComponent`
- **`RegisterFlowState`**: servicio signal-based de scope local (provider en RegisterComponent)
- **`AuthService.recoverPassword(email)`**: método mock con toast
- **`BrandPanelComponent`** usa `headlineHtml` y `description` (NO los props deprecated `title`/`subtitle`)

### FASE 6 — Feature Buyer (80% ✅)

**Buyer dashboard completado en sesión anterior:**
- ✅ `DashboardNavComponent` (`shared/layout/dashboard-nav/`) — barra superior reutilizable
- ✅ `features/buyer/models/`: `cart.model`, `order.model`, `shipping.model`, `checkout.model`
- ✅ `features/buyer/services/`: `CartService` (signal-based, con computed subtotal/shipping/discount/total), `OrderService`, `AddressService`
- ✅ `features/buyer/components/`: `CartItemRowComponent`, `CartSummaryComponent` (address + shipping + coupon + summary), `OrderCardComponent`, `OrderStepperComponent`, `ReviewModalComponent`
- ✅ `BuyerDashboardComponent` refactorizado como smart page (solo coordinación, sin mock inline)
- ✅ Fidelidad al mockup: dirección de envío, selector de método de envío, input de cupón, botón "Dejar reseña" en delivered, modal de reseña con stars
- ✅ Build pasa sin errores nuevos (solo warnings pre-existentes tolerados)

**Pendiente buyer (Fase 9):** Pestaña Perfil del comprador (HU-04)

### FASE 7 — Feature Producer (80% ✅)

**Producer dashboard completado en esta sesión (2026-04-21):**
- ✅ `features/producer/models/`: `managed-product.model` (IManagedProduct, ManagedProductStatus), `received-order.model` (IReceivedOrder, ORDER_STATUS_FLOW, RECEIVED_ORDER_STATUS_LABELS), `farm.model` (IFarm, IFarmCertification, CertStatus)
- ✅ `features/producer/services/`: `ProducerProductService` (signal-based, 5 productos semilla, toggleStatus/remove, activeCount computed), `ProducerOrderService` (signal-based, 4 órdenes semilla, updateStatus unidireccional, pendingCount computed), `FarmService` (signal-based, finca semilla La Esperanza con 3 certificaciones)
- ✅ `features/producer/components/`: `ProductTableRowComponent` (grid 6 cols, badges cert, status-pill, acciones hover), `ReceivedOrderRowComponent` (grid 6 cols, status-select nativo con flujo unidireccional), `FarmInfoCardComponent` (farm-info-grid 2 cols), `FarmMapComponent` (height 200px, pin animado pinBounce), `CertificationListComponent` (cert-valid/cert-expire badges), `SalesMiniChartComponent` (6 barras, mes activo verde)
- ✅ `ProducerDashboardComponent` refactorizado como smart page: 3 tabs (products/orders/farm), sidebar con secciones Panel/Desempeño/Bottom, filtro+búsqueda de productos, modal nuevo producto via ProductFormComponent de product-management
- ✅ Fidelidad al mockup `panel_productor_cafe.html` verificada
- ✅ Build pasa sin errores nuevos (solo warnings pre-existentes tolerados)

**Pendiente producer (Fase 9):**
- ❌ Migración completa de `features/product-management/` → `features/producer/` (DT-05, DT-06)
- ❌ Verificación de documentos del productor (HU-05)
- ❌ Integración con rutas `/panel/productor`

**Admin sigue en 30% (pendiente Fase 8):**
- ❌ `features/admin/` sin modelos/servicios/sub-componentes
- ❌ Rutas correctas: actualmente `/buyer`, `/producer`, `/admin` — PLAN.md exige `/panel/comprador`, `/panel/productor`, `/panel/admin`

**Rutas actuales en `app.routes.ts` (estado real):**

```typescript
{ path: 'buyer',    loadChildren: BUYER_ROUTES }    // ← debería ser 'panel/comprador'
{ path: 'producer', loadChildren: PRODUCER_ROUTES } // ← debería ser 'panel/productor'
{ path: 'admin',    loadChildren: ADMIN_ROUTES }    // ← debería ser 'panel/admin'
{ path: 'panel',    loadChildren: PRODUCT_MANAGEMENT_ROUTES } // ← legacy, migrar en Fase 7
```

**`AuthService.navigateByRole()`** navega a `/buyer`, `/producer`, `/admin` (debe cambiar a `/panel/comprador` etc. en Fase 9).

---

## 6. Deuda Técnica Acumulada

| ID | Descripción | Fase destino | Severidad | Estado |
|----|-------------|-------------|-----------|--------|
| DT-01 | `angular.json` sin `fileReplacements` para production | Fase 9 | Baja | ⏳ Pendiente |
| DT-02 | `shared/utils/directives/drag-drop.directive.ts` duplicado | Fase 9 | Baja | ⏳ Pendiente |
| ~~DT-Modal~~ | ~~`ModalComponent` duplicado en `shared/components/modal/modal/` (API `[isOpen]`/`(isOpenChange)`) vs `shared/ui/modal/` (API `[open]`/`(closed)`)~~ | — | Alta | ✅ **Resuelto 2026-04-21** — conservado `shared/ui/modal/`; `shared/components/` eliminado; producer-dashboard y product-dashboard migrados a la API canónica (`[open]`, `size="lg"`, `(closed)`) |
| DT-03 | Rutas de paneles: `/buyer|producer|admin` → `/panel/comprador|productor|admin` | Fase 9 | Alta | ⏳ Pendiente |
| DT-04 | `AuthService.navigateByRole()` apunta a rutas antiguas (`/buyer`, etc.) | Fase 9 | Alta | ⏳ Pendiente |
| DT-05 | Ruta `/panel` aún apunta a `product-management` (legacy) | Fase 9 | Alta | ⏳ Pendiente |
| DT-06 | `features/product-management/` debe migrarse completamente a `features/producer/` (ProductFormComponent sigue en product-management) | Fase 9 | Alta | ⏳ Pendiente |
| DT-07 | Dashboard admin usa mock data inline sin servicios propios | Fase 8 | Media | ⏳ Pendiente |
| DT-08 | Falta `BreadcrumbComponent` en `shared/layout/breadcrumb/` (PLAN B-06) | Fase 9 | Baja | ⏳ Pendiente |
| DT-09 | Falta `shared/utils/form.utils.ts`, `date.utils.ts`, `string.utils.ts` (PLAN B-08) | Fase 9 | Baja | ⏳ Pendiente |
| DT-10 | CSS budget warnings en dashboards (>8KB) | Fase 11 | Baja | ⏳ Pendiente |
| DT-11 | ~~`HomeComponent.onAddToCart()` y `ProductDetailComponent.onAddToCart()` tenían TODOs de conexión con CartService nunca implementados~~ | — | Alta | ✅ **Resuelto 2026-04-21** |
| DT-12 | ~~`LandingNavbarComponent` no inyectaba `AuthService` — UI ciega al estado de sesión; botones de login/registro siempre visibles~~ | — | Alta | ✅ **Resuelto 2026-04-21** |
| DT-13 | ~~`LandingNavbar` dependía de input `[cartCount]` del padre en lugar de leer directamente el `CartService` singleton~~ | — | Media | ✅ **Resuelto 2026-04-21** |
| DT-14 | `LandingNavbar.goToCart()` navega a `/buyer` — debe actualizarse a `/panel/comprador` en Fase 9 junto con DT-03 | Fase 9 | Media | ⏳ Pendiente |
| DT-15 | `LandingNavbar` muestra botón carrito solo para `role === 'buyer'` — correcto conceptualmente, pero la ruta destino es provisional | Fase 9 | Baja | ⏳ Pendiente |

---

## 7. Contratos de Datos Importantes

### `IProduct` (catalog/models/product.model.ts)
```typescript
// Campos core (siempre presentes)
id, name, producerName, category, description, price, rating, reviewCount,
stock, images: string[], certifications: Certification[], region, emoji

// Campos opcionales (product-detail page)
originalPrice?, discountPercent?, soldCount?, unit?, maxStock?, bg?
presentationTypes?: string[]
roastLevels?: IRoastLevel[]    // { id, name, icon, sub }
flavorNotes?: IFlavorNote[]    // { icon, name, intensity: 0-100 }
cuppingScore?: number
cuppingAttributes?: ICuppingAttribute[]  // { label, value: 0-10 }
farmInfo?: IFarmInfo           // { name, municipality, department, altitude, area, process }
```

### `IReview` (catalog/models/review.model.ts)
```typescript
id, productId, userId, userName, userInitials, rating: number,
comment: string, date: string, isVerifiedPurchase: boolean, helpfulCount: number
```

### `IUser` (core/auth/models/user.model.ts)
```typescript
id, email, fullName, phone?, roles: Role[], status: 'active'|'inactive'|'suspended',
producerStatus?: ProducerStatus, producerProfileId?: string, createdAt: string
```

### `Role` enum: `BUYER='buyer' | PRODUCER='producer' | ADMIN='admin'`
### `ProducerStatus` enum: `PENDING='pending' | APPROVED='approved' | REJECTED='rejected'`

---

## 8. Contratos de Servicios Clave

### `AuthService` (`@core/auth/services/auth.service`)
```typescript
currentUser   = signal<IUser | null>()  // leer con currentUser()
isAuthenticated = computed<boolean>()
currentRole     = computed<Role | null>()
isProducerApproved = computed<boolean>()

login(creds: ILoginCredentials): Promise<void>   // navega por rol
register(payload: IRegisterPayload): Promise<void>
recoverPassword(email: string): Promise<void>    // mock toast
logout(): void                                   // navega a /auth/login
hasRole(role: Role): boolean
```

### `NotificationService` (`@core/services/notification.service`)
```typescript
info(message: string): void
success(message: string): void
error(message: string): void
warning(message: string): void
```

### `ProductService` (`@features/catalog/services/product.service`)
```typescript
list(filter?: CatalogFilter): IProduct[]   // síncrono, mock
getById(id: string): IProduct | undefined
```

### `ReviewService` (`@features/catalog/services/review.service`)
```typescript
listByProductId(productId: string): Observable<IReview[]>
```

---

## 9. Decisiones Arquitectónicas Relevantes

| # | Decisión | Justificación |
|---|----------|---------------|
| DA-01 | Sin NgRx — solo Signals | Scope del proyecto no justifica NgRx; ADR documentado |
| DA-02 | Mock-in-memory para todos los datos | No hay backend; permite desarrollo independiente |
| DA-03 | Smart/Dumb pattern estricto | Pages = smart (inyectan servicios); components = presentacionales (solo inputs/outputs) |
| DA-04 | `input()`/`output()` signal-based | Angular 17+ modern API; evita `@Input()/@Output()` decoradores legacy |
| DA-05 | `DashboardNavComponent` compartido | Los 3 paneles usan la misma barra superior espresso con avatar dinámico por rol |
| DA-06 | Sidebars inline por dashboard | Evita sobre-abstracción; cada panel tiene necesidades diferentes |
| DA-07 | `LandingNavbarComponent` en `shared/layout/` | Reutilizable entre catálogo y product-detail; el archivo en `catalog/components/` es re-export deprecated |
| DA-08 | `RegisterFlowState` con scope local | `providers: [RegisterFlowState]` solo en RegisterComponent; evita contaminación global |
| DA-09 | Resolvers para product-detail | Pre-carga `IProduct` antes de activar la ruta; evita flash de loading |
| DA-10 | `LandingNavbarComponent` es autocontenido en autenticación | El navbar inyecta `AuthService` y `CartService` directamente. No acepta inputs de parent para estado de sesión ni contador de carrito. Esto elimina duplicación de estado y garantiza coherencia con el singleton. *Emergió como corrección 2026-04-21.* |
| DA-11 | Componentes de catálogo escriben directamente en el `CartService` singleton | `HomeComponent` y `ProductDetailComponent` no delegan el estado del carrito hacia arriba (event bubbling) ni lo almacenan localmente. Llaman `cartSvc.add()` directamente, confiando en que `CartService` (`providedIn: 'root'`) es el único punto de verdad. *Emergió como corrección 2026-04-21.* |

---

## 10. Guía de Patrones para Nuevos Componentes

```typescript
// Plantilla para componente presentacional (dumb)
@Component({
  selector: 'app-nombre',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* solo lo necesario */],
  template: `...`,
  styleUrl: './nombre.component.scss',
})
export class NombreComponent {
  // Inputs signal-based
  readonly dato = input.required<TipoDato>();
  readonly opcional = input<string>('default');
  // Outputs signal-based
  readonly accion = output<void>();
  // Estado interno
  protected readonly local = signal(false);
  // Computed
  protected readonly derivado = computed(() => this.dato() + '-extra');
  // DI
  private readonly servicio = inject(Servicio);
}
```

**Reglas de template:**
- Control flow: `@if`, `@for`, `@switch` (Angular 17+ — NO `*ngIf`, `*ngFor`)
- NO arrow functions en templates: extraer a método `protected`
- `| number:'1.0-0'` para monedas sin decimales
- `[ngClass]` para clases dinámicas (requiere importar `NgClass`)
- `[class.nombre]="condicion"` para clase única dinámica

---

## 11. Estructura de Rutas Actual vs Objetivo

| Feature | Ruta Actual (real) | Ruta Objetivo (PLAN.md §9) | Estado |
|---------|-------------------|---------------------------|--------|
| Catalog | `/` y `/productos/:id` | igual | ✅ |
| Auth | `/auth/login\|register\|forgot-password` | igual | ✅ |
| Buyer | `/buyer` | `/panel/comprador` | ⚠️ Fase 9 |
| Producer | `/producer` | `/panel/productor` | ⚠️ Fase 9 |
| Admin | `/admin` | `/panel/admin` | ⚠️ Fase 9 |
| Prod.Mgmt | `/panel` | Migrar a `/panel/productor` | ⚠️ Fase 7 |

---

## 12. Archivos de Mockup HTML de Referencia

| Mockup | Pantalla Angular | Estado fidelidad |
|--------|-----------------|-----------------|
| `md/landing_marketplace_cafe.html` | `catalog/pages/home/` | ✅ Verificado |
| `md/login_ux_marketplace_cafe.html` | `auth/pages/login/` | ✅ Verificado |
| `md/registro_marketplace_cafe.html` | `auth/pages/register/` | ✅ Verificado |
| `md/detalle_producto_cafe.html` | `catalog/pages/product-detail/` | ✅ Verificado |
| `md/panel_comprador_cafe.html` | `buyer/pages/dashboard/` | ⚠️ Implementación básica, no verificada formalmente |
| `md/panel_productor_cafe.html` | `producer/pages/dashboard/` | ✅ Fase 7 completada — fidelidad verificada |
| `md/panel_admin_cafe.html` | `admin/pages/dashboard/` | ⚠️ Implementación básica, no verificada formalmente |

---

## 13. Próximas Fases (en orden de ejecución)

> **Estado actual real (2026-04-21):** Fases 0→7 implementadas. Correctivos transversales de carrito y navbar aplicados. **Siguiente paso: Fase 8.**

### ✅ FASES 0–7 — COMPLETADAS
Ver §5 para detalle de cada fase. Puntos pendientes menores documentados en §6 Deuda Técnica.

### FASE 8 — Feature Admin completa ← **PRÓXIMA**
**Referencia visual:** `md/panel_admin_cafe.html`
**Objetivo:** Panel admin con modelos, servicios propios y sub-componentes; eliminar mock inline del `AdminDashboardComponent`.

Estructura a crear (según PLAN.md §8):
- **Modelos:** `producer-approval.model`, `admin-category.model`, `admin-user.model`, `activity.model`
- **Servicios:** `producer-approval.service` (3 aprobaciones semilla), `admin-category.service` (CRUD), `admin-user.service` (5 usuarios semilla), `admin-activity.service` (10 eventos mock)
- **Componentes:** `pending-producer-card`, `producer-detail-modal`, `producer-table-row`, `category-table-row`, `category-form`, `user-table-row`, `rejection-reason-field`, `activity-feed-item`
- **Página:** `AdminDashboardComponent` refactorizado como smart page con 5 tabs (overview | users | products | producers | categories)
- **Verificación fidelidad** contra `md/panel_admin_cafe.html` — OBLIGATORIA
- **Build:** `npm run build` sin errores nuevos

### FASE 9 — Integración Global
- Corregir rutas a `/panel/comprador|productor|admin` (DT-03)
- Actualizar `AuthService.navigateByRole()` (DT-04)
- `LandingNavbar.goToCart()` → `/panel/comprador` (DT-14)
- Eliminar ruta `/panel` legacy de `app.routes.ts` (DT-05)
- Migrar `features/product-management/` → `features/producer/` (DT-06)
- Configurar `angular.json` fileReplacements production (DT-01)
- Revisar `app.routes.server.ts` para `RenderMode` por ruta (pública vs privada)
- Completar ADRs académicos (Signals vs NgRx, mock-in-memory, rutas `/panel/`, publicGuard)

### FASES 10–11 — Accesibilidad, Responsive, Validación Final
- Auditoría WCAG AA en todas las pantallas (contraste, aria, foco, roles semánticos)
- Breakpoints: 380 / 500 / 768 / 900 / 1024 / 1280px en todas las features
- `npx tsc --noEmit` + `npm run lint` sin errores
- `npm run build && serve:ssr` sin errores de hydration

---

## 14. Registro de Sesiones de Trabajo

| Fecha | Alcance | Resultado |
|-------|---------|-----------|
| 2026-04-20 | Fases 0–5 + 4B + 5B | Auth, Catalog, Shell completados |
| 2026-04-21 (mañana) | Fase 6 Buyer + Fase 7 Producer | Dashboards buyer y producer completados |
| 2026-04-21 (tarde) | Correctivos transversales | Bug carrito desconectado + LandingNavbar auth state resueltos |

---

*Última actualización: 2026-04-21 — Correctivos post-Fase 7. Próxima acción: Fase 8 Admin. Actualizar este archivo al completar cada fase o correctivo significativo.*
