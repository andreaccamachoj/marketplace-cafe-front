# Plan Real Retrospectivo — World Coffee Marketplace
## Documento generado por auditoría comparativa post-implementación

> **Fecha de auditoría:** 2026-04-29
> **Estado del código auditado:** commit `e0ec655` (rama `feature/login`)
> **Comparado contra:** `md/PLAN.md` (v2.0, 2026-04-20), `md/PROYECTO_CONTEXT.md` (Junio 2025), `md/PROJECT_PROGRESS_CONTEXT.md` (2026-04-21)
> **Universidad:** UNAB — Maestría en Gestión, Aplicación y Desarrollo de Software

---

## Convenciones del documento

- ✅ Implementado tal cual estaba planeado
- 🆕 Funcionalidad / componente / decisión que **no estaba** en el plan original
- ⚠️ Cambio de plan, refactor sobre la marcha, corrección de bug
- 🐛 Corrección de bug específico identificada en commits
- 📐 Decisión arquitectónica emergente

---

## Resumen ejecutivo

### Objetivo del proyecto

**World Coffee Marketplace** (WCM) es una plataforma e-commerce B2C/B2B de café especial colombiano sostenible, que conecta productores certificados (Orgánico, Fairtrade, Rainforest Alliance) con compradores nacionales/internacionales. El proyecto sirve como **prototipo funcional de alta fidelidad** para una tesis de maestría que investiga el rol de la IA en decisiones arquitectónicas del SDLC; por tanto, **toda la capa de datos es mock en memoria** (sin backend real) y el énfasis está en la arquitectura frontend, los flujos de usuario, la trazabilidad de decisiones (ADR/RP) y la fidelidad visual contra mockups HTML pre-aprobados.

### Stack tecnológico final (estado real, no el del PROYECTO_CONTEXT.md)

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | **Angular 19** | NO Angular 17, NO NgModules |
| Componentes | **Standalone (`standalone: true`)** | Sin un solo NgModule en todo el código |
| Estado | **Angular Signals** (`signal`, `computed`, `effect`) | NO NgRx (planificado en PROYECTO_CONTEXT.md, descartado — ADR-002) |
| I/O componentes | **`input()` / `output()` signal-based** | NO `@Input()` / `@Output()` decoradores |
| DI | **`inject()` en campo** | NO constructor injection |
| Change detection | **`OnPush` en todos los componentes** | Habilitado por el patrón Signals + `input()` |
| Render | **SSR con Express** (`@angular/ssr`) | `RenderMode.Prerender` para públicas, `RenderMode.Server` para privadas |
| Hidratación | `provideClientHydration(withEventReplay())` | Configurado en `app.config.ts` |
| Routing | **Lazy `loadChildren` por feature**, signals como `withComponentInputBinding()` | View transitions habilitadas |
| Estilos | **SCSS con design tokens** centralizados (`_tokens.scss`) | NO Angular Material, todo custom |
| Formularios | **Reactive Forms** estrictos | Validadores reutilizables en `shared/utils/validators/` |
| HTTP | `provideHttpClient(withFetch())` + 3 interceptores (auth, base-url, error-handler) | Listos para futura migración a backend real |
| Datos | **Mock in-memory** en cada `*.service.ts` con `signal<T[]>(SEED_*)` | ADR-003 |
| Tests | Karma + Jasmine | Pre-existentes mantenidos sin modificación destructiva |
| TypeScript | **`strict: true`** + `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `strictTemplates` | Sin `any` en código nuevo |
| Lint | ESLint con 0 errores (validación final fase 11) | |
| Path aliases | `@core/*`, `@shared/*`, `@features/*`, `@env/*` | Configurados en `tsconfig.json` |

### Decisiones arquitectónicas clave (ADRs aplicados)

| ADR | Decisión | Justificación corta | Emergente / Planeada |
|-----|----------|---------------------|----------------------|
| **ADR-001** | Standalone components, sin NgModules | Tree-shaking superior, dependencias explícitas, alineación Angular 17+ | ⚠️ Cambio vs PROYECTO_CONTEXT (que asumía NgModules + lazy `loadChildren` con módulos) |
| **ADR-002** | Signals en lugar de NgRx | Sobre-ingeniería para la escala del proyecto académico | ⚠️ Cambio explícito vs PROYECTO_CONTEXT.md §10 (que recomendaba NgRx + Effects + Selectors) |
| **ADR-003** | Mock in-memory con `providedIn: 'root'` | No hay backend; objetivo académico es la arquitectura, no la infraestructura | ✅ Coherente con propósito académico |
| **ADR-004** | Smart/Dumb + `inject()` + `input()`/`output()` + selector de atributo `[app-xxx-row]` para filas de tabla | HTML semánticamente válido en `<table>`, dumb components testeables sin TestBed | 🆕📐 Emergente (el patrón de selector atributo no estaba en ningún plan) |

### Métricas globales (estado al commit `e0ec655`)

| Categoría | Cantidad | Notas |
|-----------|----------|-------|
| Rutas raíz | 7 | `auth`, `''`, `panel/comprador`, `panel/productor`, `panel/admin`, 3 alias legacy redirect, fallback `**` |
| Features | 5 | `auth`, `catalog`, `buyer`, `producer`, `admin` |
| Páginas (smart) | 8 | login, register, forgot-password, home, product-detail, buyer-dashboard, producer-dashboard, admin-dashboard |
| Componentes UI shared | 25 | button, input, modal, toast, toast-host, step-indicator, password-strength-meter, checkbox, toggle, loading-spinner, avatar, badge, status-pill, stat-card, stock-indicator, rating-stars, quantity-control, select, textarea, tabs, filter-chips, empty-state, skeleton, confirm-dialog, upload-zone |
| Componentes layout | 8 | navbar (panel), landing-navbar, dashboard-nav, sidebar, footer, page-header, panel-layout, brand-panel |
| Pipes | 5 | currency-cop, relative-time, truncate, certification-label, order-status |
| Directivas | 4 | click-outside, auto-focus, number-only, drag-drop |
| Validators | 6 | email, password, match-field, array-min-length, positive-number, required-file |
| Guards | 4 | auth, role, public, producer-approved |
| Interceptors | 3 | auth, base-url, error-handler |
| Servicios mock (datos) | 17 | ProductService, ReviewService (catalog), CartService, OrderService, AddressService, FavoritesService, ReviewService (buyer), BuyerProfileService, ProducerProductService, ProducerOrderService, FarmService, ProducerProfileService, ProducerReviewService, ProducerApprovalService, AdminCategoryService, AdminUserService, AdminActivityService |
| Tabs Buyer dashboard | 5 | cart, orders, favorites, reviews, profile |
| Tabs Producer dashboard | 5 | products, orders, farm, reviews, profile |
| Tabs Admin dashboard | 5 | overview, users, products, producers, categories |
| ADRs documentados | 4 | (PROYECTO_CONTEXT.md §11 listaba 8 ADRs incluyendo backend; los 4 reales son frontend) |
| Mockups HTML de referencia | 7 | landing, login, registro, detalle producto, panel comprador, panel productor, panel admin |
| Productos semilla (catálogo público) | 12 | (planeado: 9; ampliado a 12 en fase 4B) |
| Productos semilla (productor) | 6 | |
| Pedidos semilla (comprador) | 4 | |
| Pedidos semilla (productor) | 4 | |
| Aprobaciones semilla (admin) | 6 | (3 pendientes + 2 aprobadas + 1 rechazada) |
| Usuarios semilla (admin) | 6 | |
| Actividad semilla (admin) | 10 | |
| Reseñas comprador semilla | 4 | |
| Reseñas productor semilla | 5 | |
| Favoritos semilla | 3 | |

---

## Diferencias principales vs plan original

Tabla resumen de los cambios más importantes frente a `md/PLAN.md` v2.0 y `md/PROYECTO_CONTEXT.md`:

| # | Cambio / Emergente | Severidad | Origen | Estado |
|---|--------------------|-----------|--------|--------|
| D-01 | **NgRx descartado en favor de Signals** — PROYECTO_CONTEXT.md y ADR original (PROYECTO_CONTEXT §11 ADR-005) recomendaban NgRx con Store + Effects + Selectors. El proyecto real usa Signals nativos en todos los servicios y componentes. | Alta | ⚠️ Decisión arquitectónica explícita post-arranque | ✅ Documentado en ADR-002 |
| D-02 | **Sin NgModules** — el plan original (PROYECTO_CONTEXT §9) describía `auth.module.ts`, `catalog.module.ts`, `buyer.module.ts`, `producer.module.ts`, `admin.module.ts`, `core.module.ts`, `shared.module.ts`. El proyecto real **no contiene un solo NgModule**: todo es standalone con arrays de rutas (`AUTH_ROUTES`, etc.). | Alta | ⚠️ Cambio arquitectónico de gran impacto | ✅ Documentado en ADR-001 |
| D-03 | **Pestaña "Reseñas" en buyer-dashboard** — PLAN.md §6 enumera tabs: Carrito, Pedidos, Favoritos, Perfil (4 tabs). La implementación final tiene **5 tabs**: cart, orders, favorites, **reviews**, profile. La pestaña Reseñas permite ver, editar y eliminar reseñas escritas por el comprador. | Media | 🆕 Emergente fase 6 final | Implementado |
| D-04 | **Pestaña "Mis Reseñas" + "Mi Perfil" en producer-dashboard** — PLAN.md §7 enumera 4 tabs: Mis Productos, Mi Finca, Pedidos Recibidos, Rendimiento. La implementación final tiene **5 tabs**: products, orders, farm, **reviews**, **profile**. El productor puede responder reseñas de sus productos y editar su perfil con cambio de contraseña. | Alta | 🆕 Emergente (commit `6a4cca3 feat(producer): Perfil del productor y Mis Reseñas`) | Implementado |
| D-05 | **Cambio de contraseña en perfil del comprador** — PLAN.md §6.5 menciona "Sección de contraseña: contraseña actual + nueva + confirmar" pero como sub-sección genérica. El refactor final del perfil del comprador (commit `e0ec655 feat(buyer): refactoriza perfil del comprador con sección de cambio de contraseña`) consolidó **dos formularios separados** con validación independiente. | Media | ⚠️ Refactor explícito post-fase 11 | Implementado |
| D-06 | **Autocomplete de búsqueda con debounce + share()** en `LandingNavbarComponent` — el plan original no menciona autocomplete; solo búsqueda básica. El commit `8c1aeb6 feat(catalog): autocomplete de búsqueda con debounce en navbar` introdujo `Subject<string>` + `debounce(timer(280))` + `share()` para multicast del flujo, con dropdown de sugerencias visible solo si `searchValue.length >= 3 && suggestions.length > 0`. | Alta | 🆕 Emergente post-fase 11 | Implementado |
| D-07 | **Control de compra por rol** — el plan original no aborda qué pasa cuando un PRODUCER o ADMIN navega al catálogo. El commit `5454447 feat(catalog): control de compra por rol — ocultar acciones de buyer para PRODUCER/ADMIN` añadió `canPurchase = computed(() => !auth.isAuthenticated() \|\| auth.isBuyer())` y propagó `[canPurchase]` a `ProductGridComponent` y `ProductCardComponent` para esconder los botones "Agregar al carrito" y "Comprar" cuando el usuario es productor o admin. | Media | 🆕 Emergente | Implementado |
| D-08 | **`LandingNavbarComponent` ubicado en `shared/layout/`** y autocontenido en autenticación — el plan original lo pondría en `catalog/components/`. El refactor 2026-04-21 lo movió a `shared/layout/landing-navbar/` y eliminó los inputs `[cartCount]` y output `(cartClick)`, haciéndolo inyectar `AuthService` y `CartService` directamente. El archivo viejo en `catalog/components/landing-navbar/` quedó como **re-export `@deprecated`**. | Alta | ⚠️📐 Refactor + decisión emergente DA-10/DA-11 | Implementado |
| D-09 | **Selector de atributo `[app-xxx-row]` para filas de tabla** — patrón no documentado en plan original. Adoptado para mantener HTML semántico válido en `<table>` (un `<tr>` directo que es a su vez un componente). Comentario eslint disable de `@angular-eslint/component-selector` aplicado por archivo. Documentado en ADR-004. | Media | 🆕📐 Emergente | Implementado |
| D-10 | **`product-management/` legacy eliminado** — el plan §7.1 contemplaba migración de `features/product-management/` → `features/producer/`. La fase 9 final (commit `0ed8df8 feat(fase-9): integración global — rutas definitivas, SSR modes, ADRs, cleanup legacy`) ejecutó la migración y eliminó la carpeta legacy. La ruta `/panel` (legacy) fue eliminada del `app.routes.ts` y se añadieron alias `/buyer`, `/producer`, `/admin` que **redirigen** a `/panel/comprador|productor|admin`. | Media | ⚠️ Cleanup planificado pero no detallado | Implementado |
| D-11 | **Edición y eliminación de reseñas del comprador** — la HU-29 sólo exige *crear* reseña ("una reseña por comprador por producto"). La implementación final permite también `update(id, changes)` y `remove(id, buyerId)` desde la pestaña "Reseñas" del buyer-dashboard. | Baja | 🆕 Emergente fase 6 final | Implementado |
| D-12 | **`ReviewService.canReview(buyerId, productId, orders)`** — método de validación de elegibilidad: el comprador sólo puede reseñar productos de pedidos `delivered \| completed` y nunca puede reseñar dos veces el mismo producto. Lógica no detallada en plan original. | Media | 🆕 Emergente | Implementado |
| D-13 | **Componente `ProducerProfileFormComponent` con perfil + cambio de contraseña + sincronización con `AuthService`** — `ProducerProfileService.update()` además de actualizar su signal interno llama `this.auth.updateProfile({ fullName, phone })` para mantener sincronizado el avatar/nombre del navbar superior. Lógica de sincronización inter-servicio no contemplada. | Media | 🆕📐 Emergente | Implementado |
| D-14 | **`AuthService.updateProfile(patch)`** — método público adicional usado por los servicios de perfil para reflejar cambios de nombre/teléfono en la sesión activa y persistir en `TokenStorageService`. No estaba en el contrato original. | Baja | 🆕 Emergente | Implementado |
| D-15 | **`AuthService.isBuyer` (computed)** — además de `currentRole`, se añadió un computed específico para distinguir rápidamente buyers de no-buyers, usado por el catálogo para gating de botones de compra. | Baja | 🆕 Emergente | Implementado |
| D-16 | **`SHIPPING_OPTIONS` constante en `shipping.model.ts`** — modelo + datos en el mismo archivo (anti-patrón menor pero deliberado). El plan original separaba modelos de seeds. | Baja | ⚠️ Pragmatismo | Implementado |
| D-17 | **`CartService` con `couponCode`, `couponDiscount`, `shippingOptionId` como signals** — el plan menciona "applyCoupon" pero la implementación elevó `shipping`, `discount` y `total` a `computed` de primer nivel. El cupón válido es `CAFE10` (10% de descuento) — string literal hardcoded. | Baja | 🆕 Detalle emergente | Implementado |
| D-18 | **`producerApprovedGuard` redirige a `/producer/pending`** (ruta no implementada todavía) en lugar de a `/auth/login` — esto deja una pantalla pendiente de fase futura. La fase 9 corrigió la cadena de guards pero el placeholder permanece. | Baja | ⚠️ Deuda controlada | Pendiente |
| D-19 | **`provideClientHydration(withEventReplay())` + `withComponentInputBinding()` + `withViewTransitions()`** en `app.config.ts` — el plan no profundizaba en estas APIs específicas de hidratación / event replay / view transitions. | Baja | 🆕 Emergente fase 0 | Implementado |
| D-20 | **PRODUCT_MANAGEMENT eliminado** y `darken()` SCSS deprecation warnings limpiados durante fase 11 (commit `eac1c98 chore(fase-11): validación final — 0 errores lint y build limpio`). | Baja | ⚠️ Cleanup final | Implementado |
| D-21 | **Modal duplicado consolidado** — bug histórico: existían `shared/components/modal/modal/` (API `[isOpen]`/`(isOpenChange)`) y `shared/ui/modal/` (API `[open]`/`(closed)`). El commit `afe2077 fix+chore: consolidate modal, fix cart/navbar, add commit reminder hook` mantuvo solo `shared/ui/modal/`. | Alta | 🐛 Corrección post-fase 7 | Resuelto |
| D-22 | **CartService desconectado del catálogo (bug)** — `HomeComponent` y `ProductDetailComponent` tenían `cartCount = signal(0)` local con TODO. Resuelto en `afe2077` inyectando `CartService` directamente. | Alta | 🐛 Bug encontrado y corregido | Resuelto |
| D-23 | **`producerApprovedGuard` añadido a producer routes (BC-02)** — commit `4a2ed1f fix(producer): add producerApprovedGuard to producer routes (BC-02)` corrigió un bypass de control. | Media | 🐛 Corrección | Resuelto |
| D-24 | **`AdminDashboardComponent` con datos `PRODUCTS_DATA` inline** — la pestaña "products" del admin no tiene servicio propio aún (mock inline en el componente). PLAN §8 lo planeaba como servicio `admin-product.service`. | Baja | ⚠️ Deuda técnica controlada | Parcial |
| D-25 | **`producer-status.enum.ts`** — enum `ProducerStatus` (PENDING/APPROVED/REJECTED) en `core/auth/models/`. Aunque el plan lo menciona en `producer_profiles.status`, su ubicación en el dominio core de auth (no en producer feature) es una decisión de proximidad a la sesión de usuario. | Baja | 📐 Emergente | Implementado |
| D-26 | **`SortBy` y `CatalogFilter` en `product.model.ts`** — tipo unión literal con 5 modos (`'relevance' \| 'price-asc' \| 'price-desc' \| 'rating' \| 'newest'`). | Baja | 🆕 Emergente fase 4 | Implementado |
| D-27 | **`tsconfig.json` con `strictTemplates`** — además del `strict` clásico, el proyecto activa `strictTemplates`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`. Plan original no exigía explícitamente estos flags. | Baja | 📐 Endurecimiento de tipos emergente | Implementado |
| D-28 | **Acceso WCAG-AA + breakpoints 380/500/768/900/1024/1280** — fase 10 final con focus visible 3px, skip-link, `aria-live` en toasts, focus trap en modales, `_responsive.scss` con mixins. | Media | ✅ Planeado en PLAN §10 | Implementado |
| D-29 | **CRUD completo de direcciones** — saldado en Fase 18. `AddressService` expandido con `add/update/remove`; `IAddress` ampliado con `line2?`, `department`, `zipCode?`; `IAddressPayload` añadida; `AddressCardComponent` con outputs `setDefault/edit/delete`; `AddressFormComponent` (nuevo, dumb) con 6 campos validados; sección "Mis Direcciones" integrada en el tab Perfil del buyer-dashboard. | Media | ✅ Implementado (Fase 18) | Completado |
| D-30 | **HU-05 verificación de documentos del productor — NO implementada visualmente.** PLAN §7.6 (`UploadZoneComponent` + lista de docs `pending/approved/rejected`) no se concretó: existe `UploadZoneComponent` y `producerStatus` se ve en el header del producer-dashboard, pero **no hay UI de carga de documentos para el productor**. | Media | ⚠️ Reducción de alcance silenciosa | Pendiente |

---

## Fases cronológicas reales

> **Nota:** El orden cronológico que sigue se derivó de `git log --oneline -100` y de las marcas de fase en commits / `PROJECT_PROGRESS_CONTEXT.md`. Las fechas ADR (2026-04-20) y los commits sugieren un desarrollo en ráfagas concentradas, no en un calendario lineal de semanas. La numeración de fases del PLAN.md original se conserva donde es posible para facilitar trazabilidad, pero se han añadido fases reales emergentes (4B, 5B, 7.5, 8.5, 11.5, 12-15) que **no aparecían** en PLAN.md.

---

### Fase 0 — Bootstrap del proyecto

**Commit guía:** `3d40256 first commit` → `be6f2a4 feat: complete phases 0-3 (setup, core, ui library, layout)`
**Estado:** ✅ Implementado

#### Objetivo
Configurar el esqueleto Angular 19 standalone con SSR, path aliases, lint y SCSS base.

#### Entregables (rutas relativas a `src/`)
- `app/app.config.ts` — providers globales: `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`, `provideClientHydration(withEventReplay())`, `provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor, authInterceptor, errorHandlerInterceptor]))`, `provideZoneChangeDetection({ eventCoalescing: true })`
- `app/app.config.server.ts` — config SSR
- `app/app.routes.ts` — array de rutas raíz
- `app/app.routes.server.ts` — `serverRoutes: ServerRoute[]` con `RenderMode` por ruta (introducido en fase 9)
- `app/app.component.ts` / `.html` / `.scss` / `.spec.ts`
- `main.ts`, `main.server.ts`, `server.ts`
- `tsconfig.json` con `strict: true`, `strictTemplates`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` y path aliases `@core/*`, `@shared/*`, `@features/*`, `@env/*`
- `angular.json`, `package.json`, `karma.conf.js`, `.eslintrc` / `eslint.config.js`
- `environments/environment.ts`, `environments/environment.prod.ts`
- `index.html`, `styles.scss`

#### Decisiones arquitectónicas
- 📐 Standalone components desde el inicio (ADR-001)
- 📐 SSR con Express habilitado desde el día 0
- 📐 `inject()` siempre, nunca constructor injection
- 📐 OnPush por default en todos los componentes
- ⚠️ Sin NgModules (cambio explícito vs PROYECTO_CONTEXT.md §9)

#### Dependencias previas
Ninguna.

#### Resultado esperado
`npm start` levanta dev server en `http://localhost:4200`; `npm run build` produce build production válida; `npm run serve:ssr:marketplace-cafe-front` ejecuta SSR.

---

### Fase 1 — Sistema de diseño y tokens SCSS

**Commit guía:** `be6f2a4 feat: complete phases 0-3 (setup, core, ui library, layout)`
**Estado:** ✅ Implementado

#### Objetivo
Centralizar todos los colores, tipografías, espaciados, sombras y radios en variables CSS para consumo desde cualquier componente; preparar el sistema responsive y de accesibilidad.

#### Entregables (rutas relativas a `src/`)
- `styles/_tokens.scss` — paleta completa (espresso, cafe-oscuro/medio/claro, crema, marfil, marfil-light, blanco, verde-selva/fresco/light, amber, amber-light, blue-info, error/error-light, purple inline solo en admin), tipografías Playfair Display + Mulish, espaciados `--sp-1..--sp-16`, radios `--r-sm/md/lg/xl`, sombras `--shadow-sm/md/lg/card/xl`, `--nav-h: 68px`
- `styles/_typography.scss` — escala tipográfica con Playfair en títulos/precios y Mulish en cuerpo
- `styles/_reset.scss` — reset CSS moderno
- `styles/_buttons.scss` — patrones de botones primarios/secundarios reutilizables
- `styles/_forms.scss` — estilos base de inputs/labels
- `styles/_animations.scss` — `@keyframes fadeUp`, `floatProd`, `vapor`, `pinBounce`, `blink`
- `styles/_accessibility.scss` — focus-visible 3px outline, skip-link, aria-live styles
- `styles/_responsive.scss` — mixins para los 6 breakpoints `380 / 500 / 768 / 900 / 1024 / 1280` (planeado en PLAN §10.1)
- `styles/styles.scss` — entry global que importa todos los parciales y carga Google Fonts

#### Decisiones arquitectónicas
- 📐 Solo variables CSS (`var(--token)`), nunca colores hardcodeados en componentes
- ⚠️ `--blue-light`, `--purple`, `--purple-light` no entraron al token global; se definen inline donde se necesitan (decisión documentada en `PROJECT_PROGRESS_CONTEXT.md §3`)

#### Dependencias previas
Fase 0.

#### Resultado esperado
Cualquier componente puede consumir `var(--espresso)`, `var(--font-display)`, `var(--r-md)` con autocompletado IDE.

---

### Fase 2 — Core: auth, guards, interceptors, servicios base

**Commit guía:** `be6f2a4 feat: complete phases 0-3`
**Estado:** ✅ Implementado al 100%

#### Objetivo
Construir la capa central de autenticación, autorización y servicios transversales que toda la app consume.

#### Entregables (rutas relativas a `src/`)

**Modelos de auth** (`app/core/auth/models/`)
- `user.model.ts` — `IUser { id, email, fullName, phone?, roles: Role[], status: 'active'|'inactive'|'suspended', producerStatus?, producerProfileId?, createdAt }`
- `auth-response.model.ts` — `ILoginCredentials { email, password }`, `IRegisterPayload { fullName, email, password, phone, role, ...campos por rol }`, `IAuthResponse`
- `role.enum.ts` — `enum Role { BUYER='buyer', PRODUCER='producer', ADMIN='admin' }`
- `producer-status.enum.ts` — `enum ProducerStatus { PENDING='pending', APPROVED='approved', REJECTED='rejected' }`

**Servicios** (`app/core/auth/services/`)
- `auth.service.ts` — `signal<IUser \| null>` + computed `isAuthenticated`, `currentRole`, `isProducerApproved`, **`isBuyer` (D-15)**. Métodos `login()`, `register()`, `recoverPassword(email)`, `logout()`, `hasRole(role)`, **`updateProfile(patch)` (D-14)**, `navigateByRole(role)` privado. Constante `SEED_USERS` con 3 usuarios mock (`buyer@wcm.co`, `producer@wcm.co`, `admin@wcm.co`, password `Cafe#2025`).
- `token-storage.service.ts` — wrapper SSR-safe sobre `localStorage` con `setToken`, `getToken`, `setUser`, `getUser<T>`, `clear`. Detecta `isPlatformBrowser` para no romper SSR.

**Guards** (`app/core/auth/guards/`)
- `auth.guard.ts` — bloquea rutas privadas; redirige a `/auth/login` con `createUrlTree`
- `role.guard.ts` — usa `route.data['role']` como `Role` requerido; si no coincide redirige a `/`
- `public.guard.ts` — bloquea rutas auth si ya hay sesión; redirige al panel del rol vigente con `createUrlTree`
- `producer-approved.guard.ts` — verifica `auth.isProducerApproved()`; redirige a `/producer/pending` (ruta placeholder, deuda D-18)

**Interceptors** (`app/core/auth/interceptors/` y `app/core/http/interceptors/`)
- `auth.interceptor.ts` — añade `Authorization: Bearer <token>` si hay token
- `base-url.interceptor.ts` — prepende `environment.apiUrl` a peticiones relativas
- `error-handler.interceptor.ts` — `catchError` global, registra `console.error` y propaga

**Modelos transversales** (`app/core/models/`)
- `api-response.model.ts` — `IApiResponse<T>`
- `pagination.model.ts` — `IPagination`
- `error.model.ts` — `IApiError`

**Servicios transversales** (`app/core/services/`)
- `notification.service.ts` — toasts: `info(msg)`, `success(msg)`, `error(msg)`, `warning(msg)` con `signal<Toast[]>` interno
- `loading.service.ts` — spinner global con `signal<boolean>`

**Tokens DI** (`app/core/tokens/`)
- `injection-tokens.ts` — `INJECTION_TOKEN<T>` para configuración (env, etc.)

**Re-export agregado** (`app/core/shared-exports.ts`)

#### Decisiones arquitectónicas
- 📐 `signal<IUser \| null>` como única fuente de verdad de la sesión
- 📐 `navigateByRole` retorna directamente a `/panel/<rol>` (en fase 9 — al inicio era `/buyer`, `/producer`, `/admin`)
- 📐 Mock con `SEED_USERS` interno en el servicio; los password se almacenan en plano sólo porque es mock académico (decisión consciente, ADR-003)

#### Dependencias previas
Fase 0, Fase 1.

#### Resultado esperado
`auth.login({ email, password })` valida contra `SEED_USERS`, persiste en localStorage, actualiza `currentUser` signal y navega por rol. `auth.logout()` limpia y vuelve a `/auth/login`.

---

### Fase 3 — Shared UI Library

**Commit guía:** `be6f2a4 feat: complete phases 0-3`
**Estado:** ✅ Implementado al ~97% (deuda menor: duplicado `shared/utils/directives/drag-drop.directive.ts` resuelto en fase 11)

#### Objetivo
Crear los componentes presentacionales reutilizables que componen las páginas de todas las features.

#### Entregables (rutas relativas a `src/`)

**Componentes UI** (`app/shared/ui/`) — 25 componentes:

| Componente | Selector | API principal |
|------------|----------|---------------|
| `button` | `app-button` | `[variant]`, `[size]`, `[loading]`, `[disabled]`, content projection |
| `input` | `app-input` | `[label]`, `[type]`, `[placeholder]`, `[error]`, `[helperText]` |
| `select` | `app-select` | `[options]`, `[placeholder]`, `[error]` |
| `textarea` | `app-textarea` | `[label]`, `[rows]`, `[error]` |
| `checkbox` | `app-checkbox` | `[label]`, `[checked]` (signal), `(checkedChange)` |
| `toggle` | `app-toggle` | `[on]`, `(onChange)` |
| `modal` | `app-modal` | `[open]`, `(closed)`, `[size]='sm'\|'md'\|'lg'`, `[title]`, focus trap, Escape, overlay click |
| `confirm-dialog` | `app-confirm-dialog` | `[title]`, `[message]`, `[confirmText]`, `(confirmed)` |
| `toast` | `app-toast` | individual toast item |
| `toast-host` | `app-toast-host` | host con `aria-live="polite"`, lee `NotificationService.toasts()` |
| `step-indicator` | `app-step-indicator` | `[steps: IStep[]]`, `[currentStep: number]` |
| `password-strength-meter` | `app-password-strength-meter` | `[password]`, computed `IPasswordStrength` (score 0-4 + checks) |
| `loading-spinner` | `app-loading-spinner` | `[size]` |
| `skeleton` | `app-skeleton` | `[width]`, `[height]`, `[rounded]` |
| `avatar` | `app-avatar` | `[initials]`, `[size]`, `[color]` |
| `badge` | `app-badge` | `[variant]='success'\|'warning'\|'info'\|'error'\|'neutral'` |
| `status-pill` | `app-status-pill` | `[status]`, `[label]` |
| `stat-card` | `app-stat-card` | `[icon]`, `[label]`, `[value]`, `[trend]` |
| `stock-indicator` | `app-stock-indicator` | `[stock]`, `[max]`, dot blink en warn |
| `rating-stars` | `app-rating-stars` | `[rating]`, `[interactive]`, `(ratingChange)` |
| `quantity-control` | `app-quantity-control` | `[value]`, `[min]`, `[max]`, `(valueChange)` |
| `tabs` | `app-tabs` | `[tabs: ITab[]]`, `[activeId]`, `(tabChange)` |
| `filter-chips` | `app-filter-chips` | `[chips: IFilterChip[]]`, `(chipToggle)` |
| `empty-state` | `app-empty-state` | `[icon]`, `[title]`, `[description]`, content projection para acción |
| `upload-zone` | `app-upload-zone` | `[accept]`, `[maxSize]`, `(filesChange)`, drag & drop |

**Pipes** (`app/shared/pipes/`)
- `currency-cop.pipe.ts` — formato COP sin decimales: `transform(48000)` → `"$48.000"`
- `relative-time.pipe.ts` — "hace 2 días", "hace 1 hora", etc. (impure pipe)
- `truncate.pipe.ts` — `transform(text, max)` con elipsis
- `certification-label.pipe.ts` — `'ORGANIC'` → `'Orgánico'`, `'FAIRTRADE'` → `'Fairtrade'`, `'RAINFOREST'` → `'Rainforest Alliance'`
- `order-status.pipe.ts` — mapeo `OrderStatus` → label español

**Directivas** (`app/shared/directives/`)
- `click-outside.directive.ts` — `(clickOutside)` event
- `auto-focus.directive.ts` — `appAutoFocus` para focus al mount
- `number-only.directive.ts` — bloquea input no numérico
- `drag-drop.directive.ts` — para upload-zone

**Validators** (`app/shared/utils/validators/`)
- `email.validator.ts` — `emailValidator()` con regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, error key `invalidEmail`
- `password.validator.ts` — `evaluatePasswordStrength(password): IPasswordStrength` y `passwordStrengthValidator()` con error key `weakPassword` (score >= 2). Checks: hasMinLength (8+), hasUpperCase, hasNumber, hasSpecial.
- `match-field.validator.ts` — `matchFieldValidator(controlName, matchControlName)` para grupos; error key `mismatch`
- `array-min-length.validator.ts` — `arrayMinLengthValidator(min)`; error key `minLengthArray`
- `positive-number.validator.ts` — error key `negativeNumber`
- `required-file.validator.ts` — error key `requiredFile`

**Modelos compartidos** (`app/shared/models/`)
- `address.model.ts` — `IAddress`
- `certification.model.ts`
- `filter-chip.model.ts` — `IFilterChip { id, label, active, icon? }`

#### Decisiones arquitectónicas
- 📐 Todos los componentes shared son **dumb**: signal-based `input()` / `output()`, ninguno inyecta servicios de dominio
- 📐 ADR-004: selector de atributo `[app-xxx-row]` para filas de tabla (introducido más tarde, pero el patrón nace aquí)
- 📐 `password.validator.ts` exporta tanto `IPasswordStrength` (interface) como `passwordStrengthValidator` y `evaluatePasswordStrength()` para que la UI muestre el meter en tiempo real

#### Dependencias previas
Fase 0, Fase 1.

#### Resultado esperado
Cualquier feature puede importar `<app-button>`, `<app-modal>`, `<app-step-indicator>` y consumirlos sin re-escribir markup ni estilos.

---

### Fase 4 — Layouts compartidos (shells)

**Commit guía:** `be6f2a4 feat: complete phases 0-3`
**Estado:** ✅ Implementado al 100%

#### Objetivo
Construir los contenedores de layout que envuelven las páginas: navbar pública, navbar de paneles, sidebar, footer, page-header, panel-layout y brand-panel.

#### Entregables (rutas relativas a `src/`)

**`app/shared/layout/`** (8 componentes):

| Componente | Uso | API |
|------------|-----|-----|
| `navbar/navbar.component.ts` | navbar interno de paneles (legacy, no se usa hoy) | — |
| `landing-navbar/landing-navbar.component.ts` | navbar pública: catálogo, product-detail. **Autocontenida**: inyecta `AuthService`, `CartService`, `Router`. Inputs: `showSearch`, `showLinks`, `searchSuggestions: INavSearchSuggestion[]`. Outputs: `searchChange`, `suggestionSelected`. (D-08) | Ver detalle abajo |
| `dashboard-nav/dashboard-nav.component.ts` | barra superior reutilizable de los 3 dashboards (buyer, producer, admin). Lee `auth.currentUser()` + `auth.currentRole()` para mostrar avatar+nombre+rol. Inputs: `pageTitle`. Output: `menuToggle` | `pageTitle`, `(menuToggle)` |
| `sidebar/sidebar.component.ts` | sidebar genérico para PanelLayout | `[items: SidebarItem[]]` |
| `footer/footer.component.ts` | footer público | sin props |
| `page-header/page-header.component.ts` | cabecera de páginas | `[title]`, `[subtitle]` |
| `panel-layout/panel-layout.component.ts` | shell completo: navbar + sidebar + main + footer | content projection |
| `brand-panel/brand-panel.component.ts` | panel izquierdo de auth con SVG copa animada (`@keyframes vapor`), pilares y textura | `[headlineHtml]`, `[description]` (NO `title`/`subtitle`, son no-ops deprecated) |
| `index.ts` | barrel export | |

**`LandingNavbarComponent` API completa:**
```typescript
readonly showSearch        = input(true);
readonly showLinks         = input(true);
readonly searchSuggestions = input<INavSearchSuggestion[]>([]);
readonly searchChange       = output<string>();
readonly suggestionSelected = output<string>();

interface INavSearchSuggestion {
  id: string; name: string; producer: string; emoji: string; price: number;
}

protected readonly isLoggedIn  = computed(() => auth.isAuthenticated());
protected readonly userRole    = computed(() => auth.currentUser()?.roles[0] ?? null);
protected readonly firstName   = computed(...);
protected readonly userInitial = computed(...);
protected readonly cartCount   = cartSvc.count;
protected readonly dropdownVisible = computed(
  () => searchFocused() && searchValue().trim().length >= 3 && searchSuggestions().length > 0,
);
protected goToCart()       { router.navigate(['/panel/comprador']); }
protected goToDashboard()  { /* navega por rol */ }
protected logout()         { auth.logout(); }
```

#### Decisiones arquitectónicas
- 📐 `LandingNavbarComponent` autocontenida en estado de sesión y carrito (DA-10/DA-11 emergentes 2026-04-21, después del bug del carrito desconectado D-22)
- 📐 `BrandPanelComponent` deprecó `title`/`subtitle` en favor de `headlineHtml` (HTML embebido para `<em>` cursiva) y `description`
- 📐 `DashboardNavComponent` calcula color de avatar según rol (buyer = `cafe-medio`, producer = `verde-fresco`, admin = `#5B3E8F`)

#### Dependencias previas
Fase 0, Fase 1, Fase 2, Fase 3.

#### Resultado esperado
Las páginas de catálogo y product-detail incluyen `<app-landing-navbar>` como elemento único; los dashboards incluyen `<app-dashboard-nav>`.

---

### Fase 5 — Feature Auth (login, register multi-step, forgot-password)

**Commit guía:** `b3f23d7 feat(auth): implement Phase 5 — login, register, forgot-password pages` → `8148119 feat(catalog+auth): implement phases 4B and 5 — product detail page and auth flows`
**Estado:** ✅ Implementado al 100% (incluye fase 5B fusionada)

#### Objetivo
Implementar las 3 páginas de autenticación con fidelidad pixel-perfect a `md/login_ux_marketplace_cafe.html` y `md/registro_marketplace_cafe.html`.

#### Entregables (rutas relativas a `src/`)

**Rutas** (`app/features/auth/auth.routes.ts`)
```typescript
export const AUTH_ROUTES: Routes = [
  { path: 'login',           component: LoginComponent },
  { path: 'register',        component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '',                redirectTo: 'login', pathMatch: 'full' },
];
```

**Páginas (smart)** (`app/features/auth/pages/`)
- `login/login.component.ts` — split layout: `BrandPanelComponent` (izq) + form (der). Inyecta `AuthService`, `Router`, `NotificationService`. Reactive form con email + password + remember + link "¿Olvidaste tu contraseña?". Submit → `auth.login(creds)` → catch error con toast.
- `register/register.component.ts` — flujo 2 pasos con `StepIndicatorComponent`. Provider local `[RegisterFlowState]` (D-08 emergente). Pasos:
  - **Paso 0** (Role selector): `<app-role-selector>` (3 cards: Comprador / Productor / Administrador*)
  - **Paso 1** (Datos personales): `<app-personal-data-step>` (fullName, email, phone, password con strength meter, confirmPassword, privacy_consent)
  - **Paso 2** (Datos por rol): `<app-role-specific-step>` (campos diferentes según role)
  - El `BrandPanelComponent` recibe `headlineHtml="Únete a la<br>comunidad <em>cafetera.</em>"` y `description="Crea tu cuenta..."`. NO usa `title`/`subtitle` (deprecated, B-12 corregido).
- `forgot-password/forgot-password.component.ts` — form simple de email; `auth.recoverPassword(email)` → toast info.

**Componentes (dumb)** (`app/features/auth/components/`)
- `login-form/login-form.component.ts` — input email + input password + checkbox remember + link forgot
- `role-selector/role-selector.component.ts` — `[selected]` + `(roleSelected)`; 3 cards con icono + descripción
- `personal-data-step/personal-data-step.component.ts` — datos personales + `<app-password-strength-meter>`
- `role-specific-step/role-specific-step.component.ts` — campos diferenciados (productor: nombre finca, hectáreas, variedad principal; comprador: dirección, ciudad)

**Servicio scope local** (`app/features/auth/services/`)
- `register-flow.state.ts` — `RegisterFlowState`: signal-based con scope **provider local** (no `providedIn: 'root'`):
  ```typescript
  selectedRole = signal<'buyer' | 'producer' | null>(null);
  personalData = signal<IPersonalData | null>(null);
  currentStep  = signal<number>(0);
  next()/back()/setRole()/setPersonalData()
  ```

#### Decisiones arquitectónicas
- 📐 **DA-08**: `RegisterFlowState` con `providers: [RegisterFlowState]` solo en `RegisterComponent` (scope local), evita contaminación global del estado de un flujo efímero
- ⚠️ **B-12 corregido (fase 5B fusionada)**: `BrandPanelComponent` con `headlineHtml`/`description`, no `title`/`subtitle`
- ⚠️ **B-13 corregido**: el flujo de registro **sí** usa `StepIndicatorComponent` (no la barra artesanal del pre-fase 5B)
- 🆕 Mobile: `<div class="mobile-brand-bar">` fija arriba en mobile, `<app-brand-panel>` oculto bajo media query

#### Dependencias previas
Fase 0–4. `BrandPanelComponent`, `StepIndicatorComponent`, `PasswordStrengthMeterComponent`, validators de email/password/match-field.

#### Resultado esperado
Login y register completamente funcionales con fidelidad visual al mockup; productor recién registrado obtiene `producerStatus: ProducerStatus.PENDING`.

---

### Fase 6 — Catálogo: landing page

**Commit guía:** `8a8de98 feat: implement phase 4 - catalog feature (landing + product detail)` → `0fab4d6 feat(catalog): alinear landing page con diseño mockup original`
**Estado:** ✅ Implementado

#### Objetivo
Construir la landing pública `/` con fidelidad al mockup `md/landing_marketplace_cafe.html`.

#### Entregables (rutas relativas a `src/`)

**Rutas** (`app/features/catalog/catalog.routes.ts`)
```typescript
export const CATALOG_ROUTES: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Catálogo' } },
  { path: 'productos/:id', component: ProductDetailComponent,
    resolve: { product: productDetailResolver }, data: { title: 'Detalle' } },
];
```

**Modelos** (`app/features/catalog/models/`)
- `product.model.ts` — `IProduct` (ver Fase 6.5 abajo para campos completos), `Certification` (`'ORGANIC' | 'FAIRTRADE' | 'RAINFOREST'`), `IRoastLevel`, `IFlavorNote`, `ICuppingAttribute`, `IFarmInfo`, `ICategory`, `SortBy`, `CatalogFilter`
- `category.model.ts` — `ICategory { id, name }`
- `review.model.ts` — `IReview { id, productId, userId, userName, userInitials, rating, comment, date, isVerifiedPurchase, helpfulCount }`

**Servicios** (`app/features/catalog/services/`)
- `product.service.ts` — `signal<IProduct[]>(SEED_PRODUCTS)` con **9 productos iniciales** (luego ampliados a 12, ver Fase 6.5). Métodos `list(filter?)`, `getById(id): Observable<IProduct>`, `getByIdSync(id)`, `search(query)`, `sortProducts(list, sortBy)`. Filtros encadenables: category, certs[], query, sort.
- `category.service.ts` — categorías mock
- `review.service.ts` — reseñas mock por producto, `listByProductId(productId): Observable<IReview[]>`

**Página (smart)** (`app/features/catalog/pages/home/`)
- `home.component.ts` — inyecta `ProductService`, `CartService`, `FavoritesService`, `AuthService`, `Router`. Composición: `<app-landing-navbar>` + `<app-hero-section>` + `<app-filters-bar>` + `<app-product-grid>` + `<app-sustainability-section>` + `<app-producers-section>` + `<app-footer>`. Skip-link al catálogo.

**Componentes (dumb)** (`app/features/catalog/components/`)
- `hero-section/` — banner con SVG copa animada y CTA "Explorar catálogo"
- `filters-bar/` — categorías chip + certs chips + sort select. Sticky.
- `product-grid/` — grid responsive con `@for` sobre productos
- `product-card/` — card con emoji+bg, nombre, precio, region, ratings, certs badges. **`[canPurchase]`** (D-07) controla visibilidad de "Comprar"
- `sustainability-section/` — bloque de sostenibilidad con 3 pilares
- `producers-section/` — sección de productores destacados
- `landing-navbar/` — re-export `@deprecated` apuntando a `@shared/layout/landing-navbar/`

#### Decisiones arquitectónicas
- 📐 Filtros y orden son **signals** en `HomeComponent`; el grid se computa con `computed`
- 📐 `IProduct.images: string[]` permite vacío (los seed usan `[]` y el card cae en emoji + bg)
- 📐 Productos semilla con `bg: 'rgba(...)'` para color de fondo derivado de la cert principal
- 🆕 Hero con `(exploreCatalog)` event que hace `scrollToCatalog()` con `scrollIntoView`

#### Dependencias previas
Fase 0–5.

#### Resultado esperado
`/` muestra los 12 productos en grid 4-cols (desktop), 3-cols (1024), 2-cols (768), 1-col (mobile). Filtros y orden funcionan. Los productores y la sección de sostenibilidad son visibles.

---

### Fase 6.5 — Catálogo: detalle de producto + ampliación de IProduct (Fase 4B fusionada)

**Commit guía:** `8148119 feat(catalog+auth): implement phases 4B and 5 — product detail page and auth flows`
**Estado:** ✅ Implementado (corresponde a la Fase 4B del PLAN.md original)

#### Objetivo
Construir `/productos/:id` con fidelidad al mockup `md/detalle_producto_cafe.html`, ampliar `IProduct` con todos los campos del detalle y resolver las deudas técnicas B-04, B-05, B-14, B-15, B-18 del PLAN.md.

#### Entregables

**Ampliación `IProduct` (B-05 resuelto)** (`app/features/catalog/models/product.model.ts`)
```typescript
interface IProduct {
  // core (siempre presente)
  id, name, producerName, category, description, price, unit?,
  rating, reviewCount, stock, maxStock?, images: string[],
  certifications: Certification[], region, emoji?, bg?,
  // detail-page (opcional, backwards-compat con card)
  originalPrice?: number;
  discountPercent?: number;
  soldCount?: number;
  presentationTypes?: string[];     // ['Grano entero', 'Molido fino', 'Molido grueso']
  roastLevels?: IRoastLevel[];      // { id, name, icon, sub }
  flavorNotes?: IFlavorNote[];      // { icon, name, intensity: 0-100 }
  cuppingScore?: number;            // 0-100
  cuppingAttributes?: ICuppingAttribute[];  // { label, value: 0-10 }
  farmInfo?: IFarmInfo;             // { name, municipality, department, altitude, area, process }
}
```

**Ampliación seed** (`product.service.ts`)
- 12 productos completos con todos los campos (B-18 resuelto)
- Helper `cupping(score, aroma, flavor, body, finish)` para construir `cuppingScore + cuppingAttributes` consistentes
- Constantes `ROASTS` (3 niveles compartidos) y `PRESENTATIONS` (3 presentaciones) reutilizadas

**Resolver** (`app/features/catalog/resolvers/`)
- `product-detail.resolver.ts` — `productDetailResolver: ResolveFn<IProduct \| undefined>` que invoca `ProductService.getByIdSync(id)` antes de activar la ruta

**Página (smart)** (`app/features/catalog/pages/product-detail/`)
- `product-detail.component.ts` — usa `ActivatedRoute.data` con `toSignal` y `map`/`switchMap`. Inyecta `ProductService`, `ReviewService`, `CartService`, `FavoritesService`, `AuthService`, `Router`. Composición:
  - `<app-landing-navbar [showLinks]="false">`
  - Breadcrumb full-width: Inicio › Catálogo › nombre
  - `.product-section` con grid `1fr 480px`:
    - Galería sticky izquierda con `<app-product-gallery>`
    - Panel info derecha: producer + título + rating + `<app-product-options>` + `<app-product-cta>`
  - `<app-product-detail-tabs>` full-width
  - Sección de reseñas: resumen (score grande Playfair + distribución barras) + lista de `review-card`
  - `<app-product-suggestions>` con productos relacionados

**Componentes nuevos (dumb)** (`app/features/catalog/components/`)
- `product-gallery/` — imagen principal 440px con emoji animado (`@keyframes floatProd`), badge cert top-left, botón wishlist top-right, thumbs row 4 imágenes
- `product-options/` — chips de presentación + tarjetas de tostado (`opt-chip`, `roast-chip`)
- `product-cta/` — bloque precio (Playfair 2.25rem + tachado + badge descuento), stock-indicator, quantity-control, btn-buy-now con `scaleX hover`, btn-add-cart con state `added`, btn-wishlist-full, grid de 3 garantías, mini-card del productor
- `product-detail-tabs/` — tabs Descripción / Notas de Sabor / Información de Finca con indicador `::after` y `@keyframes fadeUp`
- `flavor-notes/` — grid de flavor-cards (icono 40px circular + nombre + barra intensidad amber) + cupping wheel section
- `product-suggestions/` — "También te puede interesar"; reutiliza `ProductCardComponent`

#### Decisiones arquitectónicas
- 📐 **B-14 resuelto**: `signal<IProduct | undefined>` con tipo estricto, NO `signal<any>`
- 📐 **B-15 resuelto**: `ReviewService` se consume en el detalle vía `toSignal(reviewSvc.listByProductId(id))`
- 📐 **B-09 resuelto**: resolver `productDetailResolver` pre-carga el producto
- 📐 Patrón Observable en `getById()` para mantener compatibilidad con futuro HTTP backend, mientras `getByIdSync()` se usa en el resolver

#### Dependencias previas
Fase 6.

#### Resultado esperado
`/productos/1` muestra el detalle completo de "Café Especial Huila"; el navbar pública aparece arriba; la galería, opciones, CTA, tabs y reseñas son funcionales. El usuario no autenticado puede explorar pero los botones de compra son visibles solo si `canPurchase` (gating cargado más tarde, fase 11.5).

---

### Fase 7 — Dashboards básicos por rol (placeholders)

**Commit guía:** `64db19b feat(dashboards): implement Phase 6 — role-based dashboard panels`
**Estado:** ⚠️ Implementación inicial, refactorizada después en Fases 8 y 9

#### Objetivo
Crear los 3 paneles privados como placeholders funcionales con `DashboardNavComponent` + sidebar minimal, navegables vía `navigateByRole`.

#### Entregables iniciales (luego reemplazados en fases 8, 9, 11.5)
- `app/features/buyer/pages/dashboard/buyer-dashboard.component.ts` — placeholder
- `app/features/producer/pages/dashboard/producer-dashboard.component.ts` — placeholder
- `app/features/admin/pages/dashboard/admin-dashboard.component.ts` — placeholder
- Rutas: `/buyer`, `/producer`, `/admin` (provisionales — corregidas a `/panel/*` en Fase 12)

#### Decisiones arquitectónicas
- ⚠️ Rutas provisionales `/buyer`, `/producer`, `/admin` (DT-03, DT-04 documentadas como deuda)
- 📐 Cada dashboard usa `<app-dashboard-nav>` y un sidebar inline (no se abstrae prematuramente — DA-06)

#### Dependencias previas
Fases 0–5.

#### Resultado esperado
Login redirige al panel correspondiente; el panel muestra navbar superior con avatar + rol + logout.

---

### Fase 8 — Buyer dashboard completo (Fase 6 PLAN.md)

**Commit guía:** `423a026 feat(buyer+producer): implement phases 6 and 7 — buyer and producer dashboards` → `733975b feat(buyer): complete Phase 6 — reviews, favorites, profile + 5-tab dashboard`
**Estado:** ✅ Implementado con 5 tabs (D-03)

#### Objetivo
Construir el panel comprador con 5 tabs (cart, orders, favorites, reviews, profile) y todos los servicios de datos asociados.

#### Entregables (rutas relativas a `src/`)

**Modelos** (`app/features/buyer/models/`)
- `cart.model.ts` — `ICartItem { id, productId, name, producer, price (congelado), qty, emoji, organic, fairTrade, maxStock }`, `ICart`
- `order.model.ts` — `OrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'completed' | 'cancelled'`, `IOrderItem`, `IOrderStep`, `IOrder`, `ORDER_STATUS_LABELS`
- `shipping.model.ts` — `IShippingOption { id, name, days, price }` + constante `SHIPPING_OPTIONS` (standard $0 / express $12.000)
- `checkout.model.ts` — `IAddress { id, label, line1, line2?, city, department, zipCode?, isDefault }`, `IAddressPayload`, `ICheckoutPayload`
- `favorite.model.ts` — `IFavorite { id, productId, productName, productOrigin, productPrice, productImageUrl, productRating, productCategory, addedAt }`
- `review.model.ts` — `IReview { id, productId, productName, productImageUrl, orderId, buyerId, buyerName, buyerInitials, rating, title, body, status, isVerifiedPurchase: true, helpfulCount, createdAt, updatedAt? }`, `IReviewPayload`
- `buyer-profile.model.ts` — `IBuyerProfile { id, fullName, email, phone, city, department, preferredPayment: 'card'|'transfer'|'cash_on_delivery', newsletterOptIn, avatarInitials }`, `IBuyerProfilePayload`, `IBuyerPasswordPayload`

**Servicios** (`app/features/buyer/services/`)
- `cart.service.ts` — signal-based con SEED de 3 ítems. Signals: `_items`, `_couponCode`, `_couponDiscount`, `_shippingOptionId`. Computed: `count`, `subtotal`, `shipping`, `discount`, `total`. Métodos: `add(item)`, `remove(id)`, `updateQty(id, qty)` (clamp 1..maxStock), `selectShipping(optionId)`, `applyCoupon(code)` (válido `CAFE10` → 10%, D-17), `clear()`.
- `order.service.ts` — 4 órdenes semilla (`WCM-2025-001..004`) con estados variados (shipped, preparing, delivered x2). Métodos: `list()`, `getById(id)`, `markReviewSubmitted(orderId)`. Cancelación lógica no implementada (deuda D-29).
- `address.service.ts` — 2 direcciones semilla (con `department`). CRUD completo: `add(payload)`, `update(id, payload)`, `remove(id)` (promueve nueva default al eliminar la actual), `setDefault(id)`. Computed `count`. ✅ D-29 saldado en Fase 18.
- `favorites.service.ts` — 3 favoritos semilla. `toggle(product)`, `add(product)`, `remove(productId)`, `isFavorite(productId)`, `count`.
- `review.service.ts` — 4 reseñas semilla del buyer demo. `byBuyer(buyerId)`, `canReview(buyerId, productId, orders)` (D-12: requiere pedido delivered/completed y no haber reseñado ya), `add(payload, buyer, productName, imageUrl)`, `update(id, changes)` (D-11), `remove(id, buyerId)` (D-11), `getByProductId(productId)`, `count`.
- `buyer-profile.service.ts` — perfil mock del buyer demo. `update(payload)` re-calcula `avatarInitials` automáticamente desde `fullName`.

**Componentes (dumb)** (`app/features/buyer/components/`)
- `cart-item-row/` (selector de atributo `[app-cart-item-row]`) — fila tabla: emoji+nombre+producer, precio unitario, quantity-control, subtotal, btn eliminar
- `cart-summary/` — sidebar derecha con dirección + shipping selector + coupon input + totales + CTA checkout
- `shipping-selector/` — radio cards estilizados con `SHIPPING_OPTIONS`
- `coupon-input/` — input + btn aplicar + feedback inline
- `address-card/` — card dirección con badge "Principal" + outputs `setDefault(id)`, `edit(IAddress)`, `delete(id)`. Muestra `line2`, `department`, `zipCode` cuando presentes. ✅ D-29 (Fase 18)
- `order-card/` — card pedido expandible con order-stepper
- `order-stepper/` — progress 4 pasos: confirmed/preparing/shipped/delivered
- `review-card/` — render de una reseña ya escrita
- `review-form-modal/` — modal con `<app-rating-stars [interactive]>` + title + body + textarea (D-12)
- `review-modal/` — modal histórico (legacy, mantenido)
- `favorite-product-card/` — card de un favorito con botón quitar
- `buyer-profile-form/` — **dos formularios separados**: profile-form (fullName, phone, city, department, preferredPayment, newsletterOptIn) y password-form (currentPassword, newPassword, confirmNewPassword) (D-05)
- `address-form/` 🆕 (Fase 18) — formulario dumb de creación/edición. Inputs: `address: IAddress|null` (null = crear), `saving: boolean`. Outputs: `saved: IAddressPayload`, `cancelled: void`. 6 campos: label, line1, line2 (opt.), city, department, zipCode (opt., pattern `\d{0,6}`). `effect()` hidrata el form en modo edición.

**Página (smart)** (`app/features/buyer/pages/dashboard/buyer-dashboard.component.ts`)
- Tabs: `'cart' | 'orders' | 'favorites' | 'reviews' | 'profile'` (D-03 emergente)
- Sidebar inline con 5 items + badges de cartCount, activeOrdersCount, favCount, reviewsCount
- `orderFilters` array para filtro por estado (Todos / En camino / Preparando / Entregados / Cancelados)
- `expandedOrder = signal<string | null>` para acordeón
- StatCards: total gastado, pedidos realizados, favoritos guardados, reseñas escritas
- Inyecta los 7 servicios de la feature
- 🆕 (Fase 18) Address CRUD state: `addressFormOpen = signal(false)`, `editingAddress = signal<IAddress|null>(null)`, `addressSaving = signal(false)`. Handlers: `openAddressForm(addr?)`, `closeAddressForm()`, `handleSaveAddress(payload)`, `handleDeleteAddress(id)`, `handleSetDefaultAddress(id)`. Tab Perfil renderiza sección "Mis Direcciones" con `<app-address-card>` (grid 2 cols) y `<app-address-form>` inline.

**Rutas** (`app/features/buyer/buyer.routes.ts`)
```typescript
export const BUYER_ROUTES: Routes = [
  { path: '', loadComponent: () => import(...buyer-dashboard...),
    canActivate: [authGuard, roleGuard], data: { role: Role.BUYER } },
];
```

#### Decisiones arquitectónicas
- 📐 5 tabs en lugar de 4 (D-03)
- 📐 Reseñas con `update`/`remove` además de `add` (D-11)
- 📐 `canReview` validation centralizada (D-12)
- 📐 Cambio de contraseña en formulario separado (D-05)

#### Dependencias previas
Fases 0–7.

#### Resultado esperado
`/panel/comprador` (después de fase 12) o `/buyer` (en este momento) muestra los 5 tabs funcionales; agregar al carrito desde catálogo se refleja aquí (después del fix D-22 en Fase 9).

---

### Fase 9 — Producer dashboard completo + correcciones transversales (Fase 7 PLAN.md)

**Commit guía:** `423a026 feat(buyer+producer): implement phases 6 and 7` → `27e6dbf fix(producer): align dashboard implementation with panel_productor_cafe.html mockup` → `d40de06 feat(producer): implement product create/edit/view modal, farm edit modal and certification modal` → `4a2ed1f fix(producer): add producerApprovedGuard to producer routes (BC-02)` → `afe2077 fix+chore: consolidate modal, fix cart/navbar, add commit reminder hook` → `6a4cca3 feat(producer): Perfil del productor y Mis Reseñas`
**Estado:** ✅ Implementado al 100% con 5 tabs (D-04)

#### Objetivo
Construir el panel productor con 5 tabs (products, orders, farm, reviews, profile), modales de creación/edición de productos, edición de finca y certificaciones, y resolver bugs transversales de cart/navbar.

#### Entregables (rutas relativas a `src/`)

**Modelos** (`app/features/producer/models/`)
- `managed-product.model.ts` — `IManagedProduct { id, emoji, name, category, unit, status: 'active'|'inactive'|'draft', price, stock, certifications: ('organico'|'fairtrade'|'rainforest')[], rating, reviewCount, salesCount }`, `ManagedProductStatus`
- `received-order.model.ts` — `IReceivedOrder { id, number, buyerName, buyerInitials, buyerCity, date, items: IReceivedOrderItem[], total, shipping, status: ReceivedOrderStatus }`, `ReceivedOrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'delivered'`, `ORDER_STATUS_FLOW: ReceivedOrderStatus[]` (constante con el orden), `RECEIVED_ORDER_STATUS_LABELS`
- `farm.model.ts` — `IFarm { id, name, municipality, department, altitude, area, mainVariety, process, description, certifications: IFarmCertification[], metrics: IFarmMetrics, profileStatus: IFarmProfileStatus }`. `IFarmCertification { id, icon, iconBg, name, body, validUntil, status: 'valid'|'expiring' }`. `IFarmMetrics` con annualProduction, yieldPerHa, process, harvestSeason, treeCount, cuppingScore. `IFarmProfileStatus { status, approvedBy, approvalDate, verifiedDocs }`.
- `certification.model.ts` — `ICertification` con `type: 'organic'|'utz'|'fair-trade'|'rainforest'|'bird-friendly'|'direct-trade'|'shade-grown'|'other'`, `name`, `issuer`, `expiryDate`, `status: 'vigente' | ...`
- `producer-profile.model.ts` — `IProducerProfile { id, fullName, email, phone, city, department, bio, avatarInitials }`, `IProducerProfilePayload`, `IProducerPasswordPayload`
- `producer-review.model.ts` — `IProducerReview { id, productId, productName, productEmoji, buyerName, buyerInitials, rating, comment, date, isVerifiedPurchase, helpfulCount, producerReply?, producerReplyDate? }`, `IProducerReviewGroup`, `IProducerReplyPayload`

**Servicios** (`app/features/producer/services/`)
- `producer-product.service.ts` — signal-based con 6 productos semilla. Computed `activeCount`, `pendingCount` (drafts). Métodos `add(data)`, `update(id, data)`, `toggleStatus(id)` (active↔inactive, draft→active), `remove(id)`.
- `producer-order.service.ts` — 4 órdenes semilla. Computed `pendingCount` (no entregadas). `updateStatus(id, newStatus)` con **flujo unidireccional verificado** (`ORDER_STATUS_FLOW.indexOf(new) > current` o aborta).
- `farm.service.ts` — finca "La Esperanza" semilla con 3 certs (1 valid Orgánico + 1 expiring Fairtrade + 1 valid Rainforest), métricas y profileStatus = approved. Métodos `updateFarm(data)`, `addCertification(cert)`, `removeCertification(id)`. Mappings privados `certTypeToIcon` / `certTypeToIconBg` para emoji y color de fondo por tipo. `formatDate(iso)` privado para mostrar mes-año.
- `producer-profile.service.ts` — perfil semilla. `update(payload)` re-calcula iniciales **y** llama `auth.updateProfile({ fullName, phone })` para sincronizar el navbar (D-13/D-14).
- `producer-review.service.ts` — 5 reseñas semilla agrupadas por producto. Computed `totalReviews`, `globalAvgRating`, `reviewGroups` (agrupado por productId). Método `reply(reviewId, text)`.

**Componentes (dumb)** (`app/features/producer/components/`)
- `product-table-row/` (selector atributo) — fila tabla: emoji+nombre, badges cert, status-pill, precio, stock, acciones hover
- `received-order-row/` (selector atributo) — número+comprador, items count, total, **`<select>` nativo** con flujo unidireccional (estados anteriores deshabilitados)
- `farm-info-card/` — info-grid 2 cols con datos de finca
- `farm-map/` — SVG estilizado con pin animado (`@keyframes pinBounce`)
- `certification-list/` — grid de cert cards con badge `cert-valid` (verde) o `cert-expire` (amber)
- `sales-mini-chart/` — SVG con 6 barras (mes activo verde, demás cafe-claro)
- `product-form-modal/` — modal CRUD de producto con `<app-modal>` + reactive form (name, category, unit, price, stock, status, certifications)
- `farm-edit-modal/` — modal de edición de finca (todos los campos)
- `certification-form-modal/` — modal para añadir certificación con dropdown de type, issuer, expiryDate, status
- `producer-profile-form/` — formulario perfil (fullName, phone, city, department, bio) + formulario cambio de contraseña separado
- `producer-review-card/` — card de reseña con datos del buyer + textarea de respuesta del productor (`producerReply`) (D-04)

**Página (smart)** (`app/features/producer/pages/dashboard/producer-dashboard.component.ts`)
- Inyecta `AuthService`, `NotificationService`, `ProducerProductService`, `ProducerOrderService`, `FarmService`, `ProducerProfileService`, `ProducerReviewService`
- 5 tabs: `'products' | 'orders' | 'farm' | 'reviews' | 'profile'` (D-04)
- Sidebar inline con secciones Panel / Desempeño / Bottom + items + badges (drafts, pendingOrders)
- Modales: `productModalOpen`, `productModalMode: 'create'|'edit'|'view'`, `selectedProduct`, `farmEditOpen`, `certModalOpen` — todos signals
- Filtro y búsqueda de productos (`productFilter`, `productSearch` signals; `filteredProducts` computed)
- StatCards: ingresos mes, ventas totales, rating promedio, productos activos
- Header con `producerStatus` badge

**Rutas** (`app/features/producer/producer.routes.ts`)
```typescript
export const PRODUCER_ROUTES: Routes = [
  { path: '', loadComponent: () => import(...producer-dashboard...),
    canActivate: [authGuard, roleGuard, producerApprovedGuard],
    data: { role: Role.PRODUCER } },
];
```

#### Decisiones arquitectónicas
- 📐 5 tabs (D-04 emergente)
- 📐 Modal API consolidada `[open]`/`(closed)` (D-21 corrección)
- 📐 `producerApprovedGuard` añadido a routes (D-23)
- 📐 Sincronización inter-servicio: `ProducerProfileService.update()` llama `auth.updateProfile()` (D-13)
- 📐 Mappings de tipo cert → icono/color en `farm.service.ts` (no en componente)
- ⚠️ HU-05 verificación de documentos NO implementada visualmente (D-30) — deuda silenciosa

#### Correctivos transversales aplicados en esta fase
- 🐛 D-21 Modal duplicado consolidado a `shared/ui/modal/`
- 🐛 D-22 `CartService` desconectado del catálogo — `HomeComponent` y `ProductDetailComponent` ahora inyectan `CartService` y llaman `cartSvc.add()`
- 🐛 D-08 `LandingNavbarComponent` refactorizado: inyecta `AuthService` + `CartService` directamente; eliminados inputs `[cartCount]` y output `(cartClick)`; añadidos templates `@if (!isLoggedIn())` / `@if (isLoggedIn())` con avatar+nombre+logout
- 🐛 D-23 `producerApprovedGuard` añadido (BC-02)

#### Dependencias previas
Fases 0–8.

#### Resultado esperado
`/panel/productor` (después de fase 12) muestra los 5 tabs funcionales; el productor demo ya está APPROVED por defecto (`producer@wcm.co`), por lo que el guard pasa.

---

### Fase 10 — Admin dashboard completo (Fase 8 PLAN.md)

**Commit guía:** `2087e00 feat(admin): implement Phase 8 — complete admin dashboard with models, services and components`
**Estado:** ✅ Implementado al ~95% (D-24: pestaña products usa data inline)

#### Objetivo
Construir el panel administrador con 5 tabs (overview, users, products, producers, categories) más actividad reciente, modales de aprobación/rechazo de productores, edición de categorías y gestión de usuarios.

#### Entregables (rutas relativas a `src/`)

**Modelos** (`app/features/admin/models/`)
- `producer-approval.model.ts` — `IProducerApproval { id, producerName, farmName, region, department, submittedAt, status: ApprovalStatus, documents: IApprovalDocument[], rejectionReason?, reviewedAt?, reviewedBy?, hectares, mainVariety, email, phone }`. `IApprovalDocument { id, name, type: 'rut'|'predial'|'cedula'|'certificacion'|'otro', url, uploadedAt }`.
- `admin-category.model.ts` — `IAdminCategory { id, name, slug, description, productCount, active, createdAt, iconEmoji }`
- `admin-user.model.ts` — `IAdminUser { id, fullName, email, role: 'buyer'|'producer'|'admin', status: 'active'|'suspended', joinedAt, lastLoginAt, ordersCount?, productsCount?, avatarInitials }`
- `activity.model.ts` — `IActivityItem { id, type, title, description, timestamp, actorName, iconEmoji, severity: 'info'|'success'|'warning'|'danger' }`. Tipos: `'user_registered' | 'producer_approved' | 'order_placed' | 'producer_rejected' | 'category_created' | 'user_suspended' | 'product_flagged'`.

**Servicios** (`app/features/admin/services/`)
- `producer-approval.service.ts` — 6 entradas semilla (3 pending + 2 approved + 1 rejected). Computed `all`, `pending`, `pendingCount`. Métodos `approve(id, reviewedBy)`, `reject(id, reason, reviewedBy)`, `getById(id)`.
- `admin-category.service.ts` — 5 categorías semilla. Métodos `add(data)`, `update(id, data)`, `toggleActive(id)`, `remove(id)`.
- `admin-user.service.ts` — 6 usuarios semilla. Computed `all`, `activeCount`, `suspendedCount`. Métodos `suspend(id)`, `reactivate(id)`, `getByRole(role)`.
- `admin-activity.service.ts` — 10 eventos semilla. Computed `all`, `recent` (slice 5). Método `addItem(item)`.

**Componentes (dumb)** (`app/features/admin/components/`)
- `pending-producer-card/` — card lista para aprobaciones (datos productor + docs + btns aprobar/rechazar)
- `producer-detail-modal/` — modal con `<app-modal>` mostrando perfil completo + lista de documentos
- `rejection-reason-modal/` — modal con textarea de motivo (D-12 admin)
- `producer-table-row/` (selector atributo) — fila de tabla todos los productores
- `category-table-row/` (selector atributo) — fila de tabla categorías
- `category-form-modal/` — modal CRUD categoría
- `user-table-row/` (selector atributo) — fila usuarios con badge de rol coloreado (buyer=cafe-medio, producer=verde-fresco, admin=`#5B3E8F`)
- `activity-feed-item/` — item del feed con icono+severity+`<relative-time>` pipe

**Página (smart)** (`app/features/admin/pages/dashboard/admin-dashboard.component.ts`)
- Inyecta los 4 servicios + `AuthService` + `NotificationService`
- 5 tabs: `'overview' | 'users' | 'products' | 'producers' | 'categories'`
- Computed `stats`: `{ totalUsers, activeUsers, pendingProducers, totalCategories }`
- ⚠️ La pestaña `'products'` usa `PRODUCTS_DATA` constante inline en el componente (5 productos) — D-24, deuda controlada

**Rutas** (`app/features/admin/admin.routes.ts`)
```typescript
export const ADMIN_ROUTES: Routes = [
  { path: '', loadComponent: () => import(...admin-dashboard...),
    canActivate: [authGuard, roleGuard], data: { role: Role.ADMIN } },
];
```

#### Decisiones arquitectónicas
- 📐 Activity service con `recent` computed (top 5)
- 📐 Severity por tipo de evento (info/success/warning/danger) para iconografía
- ⚠️ D-24 pestaña products sin servicio propio (vs PLAN §8.4 que pedía `admin-product.service`)

#### Dependencias previas
Fases 0–9.

#### Resultado esperado
`/panel/admin` muestra dashboard con stats, listado de aprobaciones pendientes, tabla de productores con filtro por estado, tabla de categorías con bloqueo `productCount > 0` (visualmente), tabla de usuarios con badges coloreados, feed de actividad reciente.

---

### Fase 11 — Integración global y rutas definitivas (Fase 9 PLAN.md)

**Commit guía:** `0ed8df8 feat(fase-9): integración global — rutas definitivas, SSR modes, ADRs, cleanup legacy`
**Estado:** ✅ Implementado

#### Objetivo
Cablear todas las features con rutas definitivas, configurar SSR `RenderMode` por ruta, escribir los 4 ADRs académicos y eliminar el módulo legacy.

#### Entregables

**Rutas definitivas** (`app/app.routes.ts`)
```typescript
export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('@features/auth/auth.routes')...,
    canActivate: [publicGuard] },
  { path: '', loadChildren: () => import('./features/catalog/catalog.routes')... },
  { path: 'panel/comprador', loadChildren: () => import('./features/buyer/buyer.routes')... },
  { path: 'panel/productor', loadChildren: () => import('./features/producer/producer.routes')... },
  { path: 'panel/admin', loadChildren: () => import('./features/admin/admin.routes')... },
  // Aliases legacy redirect
  { path: 'buyer',    redirectTo: 'panel/comprador', pathMatch: 'prefix' },
  { path: 'producer', redirectTo: 'panel/productor', pathMatch: 'prefix' },
  { path: 'admin',    redirectTo: 'panel/admin',     pathMatch: 'prefix' },
  { path: '**', redirectTo: '' },
];
```

**`AuthService.navigateByRole()` actualizado**
```typescript
const paths: Record<Role, string> = {
  [Role.BUYER]:    '/panel/comprador',
  [Role.PRODUCER]: '/panel/productor',
  [Role.ADMIN]:    '/panel/admin',
};
```

**`publicGuard` actualizado** redirige a `/panel/comprador|productor|admin` en lugar de las rutas viejas.

**`LandingNavbarComponent.goToCart()`** ahora navega a `/panel/comprador`.

**SSR `app.routes.server.ts`** con render modes:
- `panel/comprador`, `panel/productor`, `panel/admin` → `RenderMode.Server`
- `auth/login`, `auth/register`, `auth/forgot-password` → `RenderMode.Server`
- `productos/:id` → `RenderMode.Server`
- `**` → `RenderMode.Prerender` (catálogo home y otras públicas)

**ADRs documentados** (`md/ADR/`)
- `ADR-001-standalone-components.md` — sin NgModules
- `ADR-002-signals-state-management.md` — Signals en lugar de NgRx
- `ADR-003-mock-in-memory-data.md` — capa de datos mock
- `ADR-004-smart-dumb-component-pattern.md` — Smart/Dumb + signal inputs + selector atributo

**Cleanup legacy**
- `features/product-management/` eliminada
- Ruta `/panel` legacy eliminada de `app.routes.ts`
- `ProductFormComponent` movido a `features/producer/components/product-form-modal/` (refactor)

#### Decisiones arquitectónicas
- 📐 Aliases legacy `/buyer`, `/producer`, `/admin` con `redirectTo` y `pathMatch: 'prefix'` para no romper enlaces antiguos
- 📐 SSR mixto: prerender lo público estable, server lo dinámico/privado
- 📐 ADRs como Markdown (no `ADR_Plantilla.docx` que mencionaba el plan original) — pragmatismo para versionar en git

#### Dependencias previas
Fases 0–10.

#### Resultado esperado
Login (buyer) → `/panel/comprador`. Acceso directo a `/panel/admin` sin auth → redirect a `/auth/login`. Buyer intentando `/panel/productor` → redirect a `/`. SSR funciona en `/`, `/auth/*`, `/productos/:id`, `/panel/*` sin errores de hidratación.

---

### Fase 12 — Accesibilidad WCAG AA + Responsive 380→1280 (Fase 10 PLAN.md)

**Commit guía:** `7d575bf feat(fase-10): accesibilidad WCAG AA + responsive completo (380–1280px)`
**Estado:** ✅ Implementado

#### Objetivo
Auditoría completa WCAG AA + responsive en 6 breakpoints en todas las pantallas.

#### Entregables (modificaciones transversales)
- `styles/_responsive.scss` — mixins para `380px`, `500px`, `768px`, `900px`, `1024px`, `1280px`
- `styles/_accessibility.scss` — focus visible 3px outline + `outline-offset: 2px`, skip-link visible al focus, `aria-live="polite"` en `<app-toast-host>`, focus trap en `<app-modal>`, `role="dialog"` + `aria-modal="true"`
- `index.html` — skip-link global `<a href="#main-content" class="skip-link">Saltar al contenido</a>`
- `aria-required`, `aria-invalid`, `aria-describedby` añadidos a todos los inputs reactivos
- Imágenes decorativas con `aria-hidden="true"` (SVGs, emojis)
- Navegación por teclado completa: Tab/Shift-Tab/Enter/Escape/flechas en dropdowns
- Contraste 4.5:1 verificado en texto normal, 3:1 en texto grande/UI
- Animaciones `floatProd`, `vapor`, `fadeUp`, `pinBounce`, `blink` con respeto a `prefers-reduced-motion` (parcial)

#### Decisiones arquitectónicas
- 📐 6 breakpoints (vs 3 del PROYECTO_CONTEXT.md §5 RNF-USA-01: 375/768/1280) — el plan v2 (PLAN.md §10.1) los amplió y la implementación los consolidó

#### Dependencias previas
Fases 0–11.

#### Resultado esperado
Lighthouse Accessibility ≥ 95; navegación por teclado completa; sin elementos sin alt/aria-label.

---

### Fase 13 — Validación final lint + build (Fase 11 PLAN.md)

**Commit guía:** `eac1c98 chore(fase-11): validación final — 0 errores lint y build limpio`
**Estado:** ✅ Implementado

#### Objetivo
Verificar `npx tsc --noEmit`, `npm run lint`, `npm run build` y `npm run serve:ssr:marketplace-cafe-front` sin errores.

#### Acciones
- Limpieza de `console.log` sobrantes (sólo `console.error` en error interceptor)
- Eliminación de `any`, `as any`, `signal<any>`
- Eliminación de `// eslint-disable` injustificados (sólo se conservan los justificados como `@angular-eslint/component-selector` para selector atributo)
- Resolución de `darken()` SCSS deprecation warnings en `product-form` y `cart-summary`
- CSS budget: warnings restantes en admin/producer dashboards (>8KB) tolerados con justificación
- Eliminación de `shared/utils/directives/drag-drop.directive.ts` duplicado (DT-02)
- TODOs no asociados a issue eliminados o convertidos en deuda documentada

#### Resultado esperado
- `npx tsc --noEmit` → 0 errores
- `npm run lint` → 0 errores, sólo warnings tolerados
- `npm run build` → build production sin errores
- SSR rendering OK

---

### Fase 14 — Catálogo: control de compra por rol

**Commit guía:** `5454447 feat(catalog): control de compra por rol — ocultar acciones de buyer para PRODUCER/ADMIN`
**Estado:** ✅ Implementado (D-07)

#### Objetivo
Cuando un PRODUCER o ADMIN está autenticado y navega al catálogo, los botones "Comprar ahora", "Agregar al carrito" y "Wishlist" deben estar ocultos (no son compradores potenciales).

#### Cambios
- `AuthService.isBuyer = computed(() => currentRole() === Role.BUYER)` (D-15)
- `HomeComponent.canPurchase = computed(() => !auth.isAuthenticated() || auth.isBuyer())` — visitantes pueden ver acciones, autenticados solo si son buyer
- Propagación de `[canPurchase]` por la cadena: `HomeComponent` → `ProductGridComponent` → `ProductCardComponent`
- `ProductDetailComponent` aplica el mismo gating en `<app-product-cta>`
- Tests visuales: login como producer → navegar a `/` → botones de compra invisibles

#### Decisiones arquitectónicas
- 📐 Visitantes no autenticados pueden ver acciones porque la conversión a buyer pasa por intentar comprar
- 📐 Gating en componentes dumb mediante input booleano (no inyectan AuthService)

#### Dependencias previas
Fases 0–13.

---

### Fase 15 — Autocomplete de búsqueda con debounce + share()

**Commit guía:** `8c1aeb6 feat(catalog): autocomplete de búsqueda con debounce en navbar`
**Estado:** ✅ Implementado (D-06)

#### Objetivo
Reemplazar la búsqueda básica del navbar por un autocomplete con dropdown de sugerencias (mostrando emoji + nombre + producer + precio) con debounce de 280ms y multicast del flujo a múltiples consumidores.

#### Cambios
- `LandingNavbarComponent` ya existía con inputs `searchSuggestions`, `searchChange`, `suggestionSelected` (Fase 4)
- `HomeComponent` añade pipeline RxJS:
  ```typescript
  private readonly searchSubject = new Subject<string>();
  private readonly searchStream$ = this.searchSubject.pipe(
    debounce(() => timer(280)),
    distinctUntilChanged(),
    map(q => q.trim().length >= 3 ? this.productService.search(q) : []),
    map(products => products.slice(0, 5).map(p => ({ ... }))),
    share(),
  );
  protected readonly suggestions = toSignal(this.searchStream$, { initialValue: [] });
  ```
- `LandingNavbarComponent.dropdownVisible = computed(() => searchFocused() && searchValue.length >= 3 && searchSuggestions().length > 0)`
- `onDropdownMousedown(event)` previene `blur` antes del click
- En páginas que no son `/`, Enter navega al catálogo con `queryParams: { q }`

#### Decisiones arquitectónicas
- 📐 `share()` para multicast — un solo subscription al stream aunque varios consumers lo lean
- 📐 Limit a 5 sugerencias en el dropdown
- 📐 Threshold `>= 3` caracteres para evitar dropdowns en inputs vacíos

#### Dependencias previas
Fases 0–14.

---

### Fase 16 — Perfil del productor + Mis Reseñas

**Commit guía:** `6a4cca3 feat(producer): Perfil del productor y Mis Reseñas`
**Estado:** ✅ Implementado (D-04, D-13)

#### Objetivo
Añadir las pestañas "Perfil" (con cambio de contraseña) y "Mis Reseñas" (con respuesta a reseñas) al producer-dashboard.

#### Cambios
- Modelos `producer-profile.model.ts` y `producer-review.model.ts` (Fase 9 ya los creó como parte de la finalización)
- Servicios `producer-profile.service.ts` y `producer-review.service.ts`
- Componentes `producer-profile-form/` y `producer-review-card/`
- `producer-dashboard.component.ts` añade tabs `'profile'` y `'reviews'` (5 tabs totales)
- `ProducerProfileService.update()` sincroniza con `AuthService.updateProfile()` (D-13/D-14)
- `ProducerReviewService.reply(reviewId, text)` permite al productor responder reseñas; muestra `producerReply` y `producerReplyDate` en la card

#### Dependencias previas
Fases 0–15.

---

### Fase 17 — Refactor perfil del comprador con cambio de contraseña

**Commit guía:** `e0ec655 feat(buyer): refactoriza perfil del comprador con sección de cambio de contraseña`
**Estado:** ✅ Implementado (D-05) — **commit más reciente, HEAD actual**

#### Objetivo
Refactorizar la pestaña "Perfil" del buyer-dashboard separando perfil personal de cambio de contraseña en formularios independientes con validación independiente.

#### Cambios
- `IBuyerPasswordPayload { currentPassword, newPassword, confirmNewPassword }` añadida a `buyer-profile.model.ts`
- `BuyerProfileFormComponent` ahora expone dos formularios:
  - **profile-form**: fullName, phone, city, department, preferredPayment (`'card'|'transfer'|'cash_on_delivery'`), newsletterOptIn (toggle)
  - **password-form**: currentPassword + newPassword (con `passwordStrengthValidator`) + confirmNewPassword (con `matchFieldValidator`)
- `BuyerDashboardComponent` recibe ambos payloads y enruta a `profileSvc.update()` o emite toast de password
- Validación: ambos formularios independientes; submit deshabilitado hasta validez

#### Decisiones arquitectónicas
- 📐 Separar perfil personal de seguridad (UX clarifica responsabilidad)
- 📐 Reutilizar `passwordStrengthValidator` y `matchFieldValidator` ya existentes

#### Dependencias previas
Fases 0–16.

---

## Apéndice A: Inventario de archivos por feature

### `core/`

```
core/
├── auth/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── role.guard.ts
│   │   ├── public.guard.ts
│   │   └── producer-approved.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── auth-response.model.ts
│   │   ├── role.enum.ts
│   │   └── producer-status.enum.ts
│   └── services/
│       ├── auth.service.ts
│       └── token-storage.service.ts
├── http/interceptors/
│   ├── base-url.interceptor.ts
│   └── error-handler.interceptor.ts
├── models/
│   ├── api-response.model.ts
│   ├── pagination.model.ts
│   └── error.model.ts
├── services/
│   ├── notification.service.ts
│   └── loading.service.ts
├── tokens/
│   └── injection-tokens.ts
└── shared-exports.ts
```

### `shared/`

```
shared/
├── layout/
│   ├── navbar/                navbar.component.{ts,html,scss}
│   ├── landing-navbar/        landing-navbar.component.{ts,html,scss}  (autocontenida)
│   ├── dashboard-nav/         dashboard-nav.component.{ts,html,scss}
│   ├── sidebar/               sidebar.component.{ts,html,scss}
│   ├── footer/                footer.component.{ts,html,scss}
│   ├── page-header/           page-header.component.{ts,html,scss}
│   ├── panel-layout/          panel-layout.component.{ts,html,scss}
│   ├── brand-panel/           brand-panel.component.{ts,html,scss}
│   └── index.ts
├── ui/                        25 componentes (ver Fase 3)
├── pipes/                     5 pipes (ver Fase 3)
├── directives/                4 directivas
├── models/                    address, certification, filter-chip
├── utils/
│   ├── directives/            drag-drop.directive.ts (duplicado, eliminado en fase 13)
│   └── validators/            6 validators
```

### `features/auth/`

```
auth/
├── pages/
│   ├── login/                 login.component.{ts,html,scss}
│   ├── register/              register.component.{ts,html,scss}    (provider local: [RegisterFlowState])
│   └── forgot-password/       forgot-password.component.{ts,html,scss}
├── components/
│   ├── login-form/
│   ├── role-selector/
│   ├── personal-data-step/
│   └── role-specific-step/
├── services/
│   └── register-flow.state.ts (scope local)
└── auth.routes.ts
```

### `features/catalog/`

```
catalog/
├── pages/
│   ├── home/
│   │   └── home.component.{ts,html,scss}                      (smart, autocomplete pipeline)
│   └── product-detail/
│       └── product-detail.component.{ts,html,scss}            (smart, resolver, reviews)
├── components/
│   ├── hero-section/
│   ├── filters-bar/
│   ├── product-grid/
│   ├── product-card/                                           ([canPurchase])
│   ├── product-gallery/
│   ├── product-options/
│   ├── product-cta/                                            (precio + stock + qty + CTAs)
│   ├── product-detail-tabs/
│   ├── flavor-notes/
│   ├── product-suggestions/
│   ├── sustainability-section/
│   ├── producers-section/
│   └── landing-navbar/                                         (re-export @deprecated)
├── models/
│   ├── product.model.ts                                        (IProduct con detail-fields)
│   ├── category.model.ts
│   └── review.model.ts
├── services/
│   ├── product.service.ts                                      (12 productos seed)
│   ├── category.service.ts
│   └── review.service.ts
├── resolvers/
│   └── product-detail.resolver.ts
└── catalog.routes.ts
```

### `features/buyer/`

```
buyer/
├── pages/dashboard/
│   └── buyer-dashboard.component.{ts,html,scss}                (5 tabs, smart)
├── components/
│   ├── cart-item-row/         (selector atributo)
│   ├── cart-summary/
│   ├── shipping-selector/
│   ├── coupon-input/
│   ├── address-card/
│   ├── order-card/
│   ├── order-stepper/
│   ├── review-card/
│   ├── review-form-modal/
│   ├── review-modal/          (legacy)
│   ├── favorite-product-card/
│   └── buyer-profile-form/    (perfil + password)
├── services/
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── address.service.ts
│   ├── favorites.service.ts
│   ├── review.service.ts
│   └── buyer-profile.service.ts
├── models/
│   ├── cart.model.ts
│   ├── order.model.ts
│   ├── shipping.model.ts
│   ├── checkout.model.ts
│   ├── favorite.model.ts
│   ├── review.model.ts
│   └── buyer-profile.model.ts
└── buyer.routes.ts
```

### `features/producer/`

```
producer/
├── pages/dashboard/
│   └── producer-dashboard.component.{ts,html,scss}             (5 tabs, smart)
├── components/
│   ├── product-table-row/     (selector atributo)
│   ├── received-order-row/    (selector atributo, status-select unidireccional)
│   ├── farm-info-card/
│   ├── farm-map/
│   ├── certification-list/
│   ├── sales-mini-chart/
│   ├── product-form-modal/
│   ├── farm-edit-modal/
│   ├── certification-form-modal/
│   ├── producer-profile-form/  (perfil + password)
│   └── producer-review-card/   (con respuesta del productor)
├── services/
│   ├── producer-product.service.ts
│   ├── producer-order.service.ts
│   ├── farm.service.ts
│   ├── producer-profile.service.ts (sync con AuthService)
│   └── producer-review.service.ts
├── models/
│   ├── managed-product.model.ts
│   ├── received-order.model.ts
│   ├── farm.model.ts
│   ├── certification.model.ts
│   ├── producer-profile.model.ts
│   └── producer-review.model.ts
└── producer.routes.ts
```

### `features/admin/`

```
admin/
├── pages/dashboard/
│   └── admin-dashboard.component.{ts,html,scss}                (5 tabs, smart)
├── components/
│   ├── pending-producer-card/
│   ├── producer-detail-modal/
│   ├── rejection-reason-modal/
│   ├── producer-table-row/    (selector atributo)
│   ├── category-table-row/    (selector atributo)
│   ├── category-form-modal/
│   ├── user-table-row/        (selector atributo)
│   └── activity-feed-item/
├── services/
│   ├── producer-approval.service.ts
│   ├── admin-category.service.ts
│   ├── admin-user.service.ts
│   └── admin-activity.service.ts
├── models/
│   ├── producer-approval.model.ts
│   ├── admin-category.model.ts
│   ├── admin-user.model.ts
│   └── activity.model.ts
└── admin.routes.ts
```

### Estilos

```
styles/
├── _tokens.scss          (paleta + tipografías + espaciados + radios + sombras + nav-h)
├── _typography.scss
├── _reset.scss
├── _buttons.scss
├── _forms.scss
├── _animations.scss      (fadeUp, floatProd, vapor, pinBounce, blink)
├── _accessibility.scss   (focus visible 3px, skip-link, aria-live)
├── _responsive.scss      (mixins 380/500/768/900/1024/1280)
└── styles.scss
```

### Configuración raíz

```
src/
├── app/
│   ├── app.component.{ts,html,scss,spec.ts}
│   ├── app.config.ts                  (providers globales)
│   ├── app.config.server.ts
│   ├── app.routes.ts                  (rutas raíz con aliases legacy)
│   └── app.routes.server.ts           (RenderMode por ruta)
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
├── main.server.ts
├── server.ts
└── styles.scss
```

---

## Apéndice B: Decisiones técnicas emergentes

### B.1 ADRs documentados (4)

| ADR | Decisión | Origen |
|-----|----------|--------|
| **ADR-001** | Standalone components, sin NgModules | Cambio explícito vs PROYECTO_CONTEXT.md §9 |
| **ADR-002** | Signals como sistema reactivo principal | Cambio vs PROYECTO_CONTEXT.md §10 (NgRx) |
| **ADR-003** | Mock in-memory con `providedIn: 'root'` | Coherente con propósito académico |
| **ADR-004** | Smart/Dumb + `inject()` + `input()/output()` + selector atributo `[app-xxx-row]` | Patrón emergente (selector atributo no documentado en ningún plan) |

### B.2 Decisiones implícitas no documentadas como ADR pero relevantes

| ID | Decisión | Justificación |
|----|----------|---------------|
| **DA-05** | `DashboardNavComponent` compartido | Los 3 paneles usan misma barra superior con avatar dinámico por rol |
| **DA-06** | Sidebars inline por dashboard | Evita sobre-abstracción; cada panel tiene necesidades diferentes |
| **DA-07** | `LandingNavbarComponent` en `shared/layout/` | Reutilizable entre catálogo y product-detail |
| **DA-08** | `RegisterFlowState` con scope local (provider en `RegisterComponent`) | Evita contaminación global de un flujo efímero |
| **DA-09** | Resolvers para product-detail | Pre-carga `IProduct` antes de activar la ruta; evita flash de loading |
| **DA-10** | `LandingNavbarComponent` autocontenida en autenticación | Emergió como corrección del bug 2026-04-21 (ver D-08) |
| **DA-11** | Componentes de catálogo escriben directamente en `CartService` | Emergió como corrección del bug 2026-04-21 (ver D-22) |
| **DA-12** (nueva) | `AuthService.updateProfile(patch)` para sincronización inter-servicio | Permite a los servicios de perfil mantener navbar en sincronía sin tocar `_currentUser` directamente |
| **DA-13** (nueva) | `ProducerProfileService` y `BuyerProfileService` cargan perfil con datos hardcoded coherentes con `SEED_USERS` | Mock pragmatico, evita backend para perfiles |
| **DA-14** (nueva) | `app.routes.ts` mantiene aliases `/buyer`, `/producer`, `/admin` con `redirectTo` | Compatibilidad con enlaces antiguos sin romper UX |
| **DA-15** (nueva) | `RenderMode.Server` para `/productos/:id` | Datos dinámicos por ID — evita prerenderizar 12 páginas separadas |

### B.3 Patrones emergentes no documentados explícitamente

- **Selector de atributo para filas de tabla**: `selector: '[app-cart-item-row]'` con `// eslint-disable-next-line @angular-eslint/component-selector` — usado en `cart-item-row`, `product-table-row`, `received-order-row`, `producer-table-row`, `category-table-row`, `user-table-row`. Razón: `<tr>` directo válido en HTML.
- **Backwards-compat en `IProduct`**: campos opcionales en `IProduct` para que `ProductCardComponent` (catálogo) y `ProductDetailComponent` (detalle) compartan el mismo modelo sin duplicación. ⚠️ Anti-patrón leve vs Interface Segregation (ADR-006 del PROYECTO_CONTEXT.md), pero pragmático.
- **Sincronización inter-servicio Profile↔Auth**: `ProducerProfileService.update()` invoca `auth.updateProfile()` para mantener el navbar sincronizado. Aplicado solo en producer (no en buyer profile — inconsistencia menor).
- **Helpers privados en seeds**: `cupping(score, aroma, flavor, body, finish)` en `product.service.ts`, `certTypeToIcon` / `certTypeToIconBg` en `farm.service.ts` — separan la complejidad del seed de la lógica del servicio.
- **Constantes compartidas en seeds**: `ROASTS` (3 niveles) y `PRESENTATIONS` (3 presentaciones) reusadas en todos los productos del seed.
- **Mock de auth con campo `password` en SEED_USERS**: aceptado por ADR-003 pero anotado como "no en producción".

---

## Apéndice C: Funcionalidades añadidas fuera del plan original

| # | Feature | Fase real | Comentario |
|---|---------|-----------|------------|
| 1 | 🆕 Pestaña "Reseñas" en buyer-dashboard | Fase 8 | PLAN.md §6 sólo planeaba 4 tabs |
| 2 | 🆕 Pestaña "Perfil" en producer-dashboard con cambio de contraseña | Fase 16 | No estaba en PLAN.md §7 |
| 3 | 🆕 Pestaña "Mis Reseñas" en producer-dashboard con respuesta del productor | Fase 16 | No estaba en PLAN.md §7 |
| 4 | 🆕 Cambio de contraseña separado en perfil del comprador | Fase 17 | PLAN.md lo mencionaba como sub-sección genérica |
| 5 | 🆕 Autocomplete de búsqueda con debounce + share() | Fase 15 | PLAN.md no menciona autocomplete |
| 6 | 🆕 Control de compra por rol (`canPurchase`) | Fase 14 | No abordado en plan |
| 7 | 🆕 `LandingNavbarComponent` autocontenida en auth + carrito | Fase 9 | Emergió por corrección de bug |
| 8 | 🆕 `AuthService.isBuyer` computed | Fase 14 | Helper emergente |
| 9 | 🆕 `AuthService.updateProfile(patch)` | Fase 16 | Permite sincronización inter-servicio |
| 10 | 🆕 Edición y eliminación de reseñas del comprador | Fase 8 | HU-29 sólo exigía crear |
| 11 | 🆕 `ReviewService.canReview()` con validación de orden delivered + no-duplicado | Fase 8 | Lógica no detallada en plan |
| 12 | 🆕 `ProducerReviewService.reply()` para respuesta del productor | Fase 16 | No estaba en plan |
| 13 | 🆕 Selector de atributo `[app-xxx-row]` para 6 componentes de tabla | Transversal | Patrón emergente |
| 14 | 🆕 Helper `cupping()` y constantes `ROASTS`/`PRESENTATIONS` en seed | Fase 6.5 | Refactor de coherencia |
| 15 | 🆕 `share()` operator para multicast en pipeline de search | Fase 15 | Optimización emergente |
| 16 | 🆕 Aliases legacy `/buyer`, `/producer`, `/admin` con redirectTo | Fase 11 | Compatibilidad pragmática |
| 17 | 🆕 6 breakpoints (380/500/768/900/1024/1280) | Fase 12 | PROYECTO_CONTEXT.md sólo pedía 3 (375/768/1280) |
| 18 | 🆕 `withComponentInputBinding()` y `withViewTransitions()` en provideRouter | Fase 0 | Plan no profundizaba |

---

### Fase 18 🆕 — CRUD Completo de Direcciones del Comprador

> **Commit:** `feat(buyer): CRUD completo de direcciones del comprador` · Rama `feature/login`
> **Saldó deuda:** D-29

#### Objetivo
Implementar la gestión completa (crear, listar, editar, eliminar, establecer como predeterminada) de las direcciones de entrega del comprador en el módulo de perfil, usando el patrón Smart/Dumb, Signals, formularios reactivos tipados y el sistema de diseño existente.

#### Entregables técnicos

**Modelos** (ampliados)
- `features/buyer/models/checkout.model.ts`
  - `IAddress` — añadidos `line2?: string`, `department: string`, `zipCode?: string`
  - `IAddressPayload` — interfaz nueva (sin `id` ni `isDefault`, usada en operaciones write)

**Servicio** (CRUD completo)
- `features/buyer/services/address.service.ts`
  - `add(payload: IAddressPayload)` — genera `id = 'a-' + Date.now()`, aplica `isDefault: true` si lista vacía
  - `update(id, payload)` — actualiza campos manteniendo `isDefault`
  - `remove(id)` — filtra y promueve la siguiente como default si se eliminó la actual
  - `count = computed(() => _addresses().length)`
  - Seed actualizado con campo `department` en ambas direcciones

**Componentes (dumb)**
- `features/buyer/components/address-card/` (refactorizado)
  - Eliminado input `isDefault` (lee directamente de `address().isDefault`)
  - Eliminado output `addressSelect` (no necesario en gestión de perfil)
  - Añadidos outputs: `setDefault = output<string>()`, `delete = output<string>()`
  - Template: muestra `line2`, `department`, `zipCode`; botón "★ Principal" solo si `!isDefault`; botón "🗑 Eliminar" con clase `btn-addr--danger`

- `features/buyer/components/address-form/` (nuevo)
  - `address-form.component.ts` — 6 `FormControl<string>` tipados; `effect()` hidrata en edición; `onSubmit()` construye `IAddressPayload` sólo con campos no vacíos
  - `address-form.component.html` — grid 2 cols, campos con validación inline y `role="alert"`
  - `address-form.component.scss` — animación `slide-down`, tokens de diseño, botones Cancel/Save

**Página (smart)**
- `features/buyer/pages/dashboard/buyer-dashboard.component.ts`
  - Importa `AddressCardComponent`, `AddressFormComponent`, `IAddress`, `IAddressPayload`
  - Señales: `addressFormOpen`, `editingAddress`, `addressSaving`
  - Expone `addresses = this.addrSvc.addresses`
  - Handlers: `openAddressForm(addr?)`, `closeAddressForm()`, `handleSaveAddress(payload)`, `handleDeleteAddress(id)`, `handleSetDefaultAddress(id)`

- `features/buyer/pages/dashboard/buyer-dashboard.component.html`
  - Sección "Mis Direcciones" dentro del tab `profile`: header con botón "+ Nueva dirección", `<app-address-form>` inline (condicional), `<div class="addresses-grid">` con `@for`, estado vacío con CTA

- `features/buyer/pages/dashboard/buyer-dashboard.component.scss`
  - Añadidos: `.pf-section`, `.pf-section-header`, `.pf-section-header-text`, `.pf-section-icon`, `.pf-section-title`, `.pf-section-sub`, `.addresses-grid`, `.addresses-empty`, `.btn-add-address`

#### Decisiones arquitectónicas
- **Inline form vs modal**: se eligió formulario inline (no modal) para mayor fluidez en la gestión de múltiples direcciones y consistencia con el patrón de las secciones de perfil existentes.
- **Sin `addressSelect` output**: la selección de dirección de envío durante checkout usa `defaultAddress` del servicio; el CRUD de perfil no necesita ese output.
- **Promoción automática de default**: al eliminar la dirección predeterminada, el servicio promueve automáticamente la primera de la lista como nueva default, evitando estados inconsistentes.
- **`isDefault` desde modelo vs input**: el card lee `address().isDefault` directamente del modelo, eliminando la redundancia del input separado.

#### Dependencias previas
Fases 0–17 (especialmente Fase 8 — buyer dashboard base).

#### Resultado esperado
Tab "Mi Perfil" del buyer-dashboard muestra dos bloques: `<app-buyer-profile-form>` (datos personales + contraseña) seguido de la sección "Mis Direcciones" con tarjetas interactivas para todas las direcciones guardadas y formulario inline de creación/edición.

---

### Funcionalidades del PLAN.md original NO implementadas (deuda silenciosa)

| # | Feature plan original | Estado | ID deuda |
|---|----------------------|--------|----------|
| 1 | HU-05 carga de documentos del productor (`UploadZoneComponent` para cedula/RUT/cámara comercio) | ❌ No implementado | D-30 |
| 2 | CRUD completo de direcciones (PLAN §6.5) | ✅ Implementado en Fase 18 | D-29 |
| 3 | Cancelación de pedido desde buyer-dashboard (PLAN §6.2) | ❌ No implementado | — |
| 4 | `BreadcrumbComponent` shared (PLAN B-06) | ❌ No implementado, breadcrumb inline en product-detail | DT-08 |
| 5 | Directivas `scroll-spy` e `intersection-observer` (PLAN B-07) | ❌ No implementado | DT-… |
| 6 | `shared/utils/form.utils.ts`, `date.utils.ts`, `string.utils.ts` (PLAN B-08) | ❌ No implementado | DT-09 |
| 7 | `angular.json` con `fileReplacements` para production environments | ❌ Pendiente | DT-01 |
| 8 | Pestaña "products" del admin con servicio propio (PLAN §8.4) | ⚠️ Mock inline | D-24 |
| 9 | Verificación de documentos en aprobación productor con UI rica | ⚠️ Solo lista de docs sin preview | Parcial |
| 10 | Persistencia del carrito en `localStorage` vía `TokenStorageService` (PLAN §6.2) | ❌ Solo en memoria | — |
| 11 | NgRx Store + Effects + Selectors (PROYECTO_CONTEXT §9) | ❌ Reemplazado por Signals (ADR-002) | Decisión |
| 12 | NgModules por feature (PROYECTO_CONTEXT §9) | ❌ Reemplazado por standalone (ADR-001) | Decisión |
| 13 | Tests Cypress E2E (PROYECTO_CONTEXT §9) | ❌ Solo Karma/Jasmine | — |

---

## Cierre

Este documento refleja el plan que **debió haberse escrito desde el inicio** para llegar al estado actual del proyecto (inicialmente auditado en commit `e0ec655`; actualizado en Fase 18 con CRUD de direcciones). Las desviaciones más significativas (sin NgModules, sin NgRx, 5 tabs en lugar de 4, autocomplete con debounce, control de compra por rol, sincronización inter-servicio Profile↔Auth, cambio de contraseña separado, edición/eliminación de reseñas, modal consolidado, navbar autocontenida) emergieron de:

1. **Decisiones arquitectónicas tomadas durante la implementación** (Standalone, Signals — formalizadas en ADR-001 y ADR-002 retrospectivamente)
2. **Bugs encontrados y corregidos sobre la marcha** (cart desconectado, navbar ciega al estado de sesión, modal duplicado, producerApprovedGuard ausente)
3. **Refactores de mejora UX** (5 tabs en cada dashboard, perfil dividido en dos formularios, autocomplete con debounce)
4. **Reducciones de alcance silenciosas** (HU-05 documentos, cancelación de pedido — quedan como deuda controlada; CRUD de direcciones saldado en Fase 18)

El proyecto cumple su propósito académico: demostrar la arquitectura frontend completa de un marketplace y trazar las decisiones asistidas por IA en ADRs versionados (4 ADRs principales) y registros de prompts en el repositorio.

---

*Plan Real Retrospectivo — World Coffee Marketplace · UNAB · 2026-04-29*
*Generado por auditoría comparativa contra `md/PLAN.md`, `md/PROYECTO_CONTEXT.md`, `md/PROJECT_PROGRESS_CONTEXT.md`, los 4 ADRs y `git log -100`.*
