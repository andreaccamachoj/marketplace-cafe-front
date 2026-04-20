# Plan de Trabajo — Conversión de Mockups HTML a Angular
## World Coffee Marketplace

---

## Contexto

El proyecto **World Coffee Marketplace** (UNAB — Maestría) es un e-commerce B2C/B2B que conecta productores de café colombiano sostenible con compradores. El repositorio actual es una app **Angular 19 standalone con SSR (Express)** que contiene apenas una feature inicial (`product-management` con su modal), dejando pendiente convertir los 6 mockups HTML entregados en [md/](md/) a código Angular real.

**Problema que resuelve este plan:** los mockups HTML ([md/login_ux_marketplace_cafe.html](md/login_ux_marketplace_cafe.html), [md/registro_marketplace_cafe.html](md/registro_marketplace_cafe.html), [md/landing_marketplace_cafe.html](md/landing_marketplace_cafe.html), [md/panel_comprador_cafe.html](md/panel_comprador_cafe.html), [md/panel_productor_cafe.html](md/panel_productor_cafe.html), [md/panel_admin_cafe.html](md/panel_admin_cafe.html)) son referencia visual validada pero no código Angular ejecutable. Se necesita convertirlos aplicando SOLID, Clean Code, separación de responsabilidades, Smart/Dumb pattern, Reactive Forms, lazy loading, accesibilidad y tipado estricto.

**Resultado esperado:** al cierre del plan, `npm run build` y `npm run lint` se ejecutan sin errores y las 7 pantallas objetivo son navegables (con datos mock) desde el navegador. Los specs existentes (`.spec.ts` ya presentes) siguen pasando con `npm test`, pero **no se escriben specs nuevos** en esta iteración — se priorizó la entrega funcional.

---

## Decisiones Arquitectónicas Clave del Plan

Estas decisiones se toman para alinearse con el estado **real** del repositorio (no con PROYECTO_CONTEXT.md, que fue escrito asumiendo NgModules + NgRx — tecnología no instalada aquí):

1. **Standalone components** — se mantiene el patrón ya usado por el proyecto ([src/app/app.component.ts](src/app/app.component.ts)). No se introducirán NgModules.
2. **Estado reactivo con Angular Signals + servicios singleton** en lugar de NgRx, para no inflar el bundle ni añadir dependencias nuevas. NgRx queda como posible extensión futura.
3. **Lazy loading por feature** vía `loadChildren` con arrays de rutas, `loadComponent` donde aplique.
4. **Mock en memoria** para todos los servicios de datos en esta etapa. Se estructuran como `XxxService` (interfaz-driven) con implementación `XxxMockService` para facilitar el reemplazo cuando exista backend real. Cumple Dependency Inversion (SOLID-D) vía `InjectionToken`.
5. **Reactive Forms** estrictos con validadores reutilizables en `shared/utils/validators/`.
6. **Path aliases** añadidos en `tsconfig.json`: `@core/*`, `@shared/*`, `@features/*`, `@env/*`.
7. **SCSS tokens** centralizados en `src/styles/` replicando 1:1 la paleta y tipografía del logo.
8. **Se preserva** la feature existente `product-management` — será integrada como parte de la feature `producer` (pantalla "Mis Productos") reutilizando `ProductFormComponent`, `ProductDashboardComponent`, `ModalComponent`, `DragDropDirective` y `arrayMinLengthValidator`.

---

## Stack y Versiones (confirmados en package.json)

- Angular 19.2 standalone, SSR (Express)
- TypeScript 5.7 strict
- RxJS 7.8, zone.js 0.15
- Karma + Jasmine para tests
- ESLint 9 + angular-eslint 21
- **Sin** NgRx, **sin** Angular Material — estilos 100% custom SCSS

---

## Estructura de Carpetas Objetivo

```
src/app/
├── core/
│   ├── auth/
│   │   ├── guards/            (auth, role, public, producer-approved)
│   │   ├── interceptors/      (auth, error-handler)
│   │   ├── services/          (auth.service, token-storage.service)
│   │   └── models/            (user, auth-response, role.enum)
│   ├── http/
│   │   ├── interceptors/      (base-url, loading, error)
│   │   └── services/          (api.service, mock-api.service)
│   ├── services/              (notification, loading)
│   ├── models/                (api-response, pagination, error)
│   └── tokens/                (DI tokens: AUTH_SERVICE, PRODUCT_SERVICE...)
│
├── shared/
│   ├── components/
│   │   ├── layout/            (navbar, sidebar, footer, page-header, panel-layout, brand-panel)
│   │   └── ui/                (button, input, select, textarea, checkbox, toggle,
│   │                           badge, status-pill, rating-stars, quantity-control,
│   │                           stock-indicator, upload-zone, avatar, empty-state,
│   │                           loading-spinner, skeleton, toast, toast-host, modal,
│   │                           confirm-dialog, tabs, filter-chips, stat-card,
│   │                           password-strength-meter, step-indicator)
│   ├── directives/            (click-outside, auto-focus, number-only, drag-drop*)
│   ├── pipes/                 (currency-cop, relative-time, truncate,
│   │                           certification-label, order-status)
│   ├── utils/
│   │   └── validators/        (email, password, positive-number,
│   │                           required-file, array-min-length*, match-field)
│   ├── models/                (certification, address, notification, toast)
│   └── constants/             (ui-tokens, breakpoints)
│
└── features/
    ├── auth/
    │   ├── pages/             (login, register, forgot-password)
    │   ├── components/        (login-form, register-stepper, role-selector,
    │   │                       personal-data-step, role-specific-step, brand-panel)
    │   ├── services/          (auth-facade, register-flow.state)
    │   └── auth.routes.ts
    ├── catalog/
    │   ├── pages/             (home, product-detail)
    │   ├── components/        (hero-section, filters-bar, product-grid, product-card,
    │   │                       product-gallery, sustainability-section)
    │   ├── services/          (product.service, category.service, review.service)
    │   ├── models/            (product, category, review, filter)
    │   └── catalog.routes.ts
    ├── buyer/
    │   ├── pages/             (buyer-dashboard: cart | orders | favorites | profile)
    │   ├── components/        (cart-item-row, cart-summary, shipping-selector,
    │   │                       coupon-input, address-card, order-card,
    │   │                       order-stepper, review-modal)
    │   ├── services/          (cart.service, order.service, address.service)
    │   ├── models/            (cart, order, checkout, shipping)
    │   └── buyer.routes.ts
    ├── producer/
    │   ├── pages/             (producer-dashboard: products | farm | received-orders)
    │   ├── components/        (product-table-row, received-order-row, farm-info-card,
    │   │                       farm-map, certification-list, sales-mini-chart,
    │   │                       status-select)
    │   ├── services/          (producer-product.service, producer-order.service,
    │   │                       farm.service)
    │   ├── models/            (managed-product, received-order, farm)
    │   └── producer.routes.ts
    └── admin/
        ├── pages/             (admin-dashboard: pending | producers | categories |
        │                      users | activity)
        ├── components/        (pending-producer-card, producer-detail-modal,
        │                      producer-table-row, category-table-row, category-form,
        │                      user-table-row, rejection-reason-field,
        │                      activity-feed-item)
        ├── services/          (producer-approval.service, admin-category.service,
        │                      admin-user.service, admin-activity.service)
        ├── models/            (producer-approval, admin-category, admin-user, activity)
        └── admin.routes.ts

src/styles/
├── _tokens.scss               (vars CSS desde la paleta oficial del logo)
├── _typography.scss           (Playfair Display + Mulish)
├── _reset.scss
├── _buttons.scss              (helpers btn-primary, btn-ghost)
├── _forms.scss                (estilos base de inputs, labels, errors)
├── _animations.scss           (fadeUp, vapor, pulse)
├── _accessibility.scss        (focus-visible, sr-only)
├── _responsive.scss           (mixins breakpoints)
└── styles.scss                (importa todo el sistema)
```

*Archivos marcados con `*` ya existen y se **mueven/reutilizan**, no se reescriben.*

---

# Fases de Trabajo

> Cada fase termina con un punto de sincronización: el proyecto debe compilar (`npm run build`) y linter debe pasar (`npm run lint`). **No se escriben specs nuevos en esta iteración** — los `.spec.ts` existentes se mantienen y se actualizan solo si se rompen por el refactor.

---

## FASE 0 — Preparación del terreno

**Objetivo:** configurar aliases, fuentes, tokens de diseño y paleta SCSS antes de tocar código de features.

### 0.1 Configuración base
- Añadir `paths` en [tsconfig.json](tsconfig.json): `@core/*`, `@shared/*`, `@features/*`, `@env/*`.
- Crear `src/environments/environment.ts` y `environment.prod.ts` con `apiUrl`, `useMocks: true`.
- Registrar reemplazo de environment en [angular.json](angular.json) (bloque `fileReplacements`).

### 0.2 Sistema de diseño global
- Crear `src/styles/` con los parciales listados arriba.
- `_tokens.scss`: trasladar 1:1 las variables CSS del bloque `:root` descrito en `PROYECTO_CONTEXT.md §2` (espresso, crema, verde-selva, amber, blue-info, purple, error, tipografías, spacing base 8, radios, sombras).
- Importar Google Fonts (Playfair Display + Mulish) en `src/index.html`.
- Reemplazar contenido actual de [src/styles.scss](src/styles.scss) por `@use './styles/styles' as *;` (o bien mover todo y dejar un único archivo global).
- `_reset.scss`: box-sizing, margen 0, font-family, color base.
- `_accessibility.scss`: skip-link, `.sr-only`, `:focus-visible { outline: 3px solid var(--espresso); }`.

### 0.3 Layout raíz
- Modificar [src/index.html](src/index.html): meta viewport, `<a class="skip-link" href="#main-content">Ir al contenido</a>`, link de Google Fonts.
- Modificar [src/app/app.component.html](src/app/app.component.html) y [.scss](src/app/app.component.scss) para que sea un shell neutro (`<router-outlet />` + `<app-toast-host />` más adelante).

### 0.4 Verificación de Fase 0
- `npm run build` y `npm start` sin errores.
- Tipografías cargan en devtools.

---

## FASE 1 — Core (autenticación, modelos, servicios singleton)

**Objetivo:** construir la capa no visual: modelos, DI tokens, servicios de auth mock, guards, interceptors.

### 1.1 Modelos y tokens
- `core/models/`: `api-response.model.ts`, `pagination.model.ts`, `error.model.ts`.
- `core/auth/models/`: `role.enum.ts` (`BUYER | PRODUCER | ADMIN`), `user.model.ts` (`IUser`), `auth-response.model.ts`, `producer-status.enum.ts`.
- `core/tokens/`: `InjectionToken<IAuthService>`, `IProductService`, `ICartService`, `IOrderService`, etc. (Dependency Inversion).

### 1.2 Servicios
- `core/auth/services/token-storage.service.ts` — abstrae `localStorage` (testeable). Usa `isPlatformBrowser` (SSR-safe).
- `core/auth/services/auth.service.ts` — señala `currentUser = signal<IUser | null>(null)`, `isAuthenticated = computed(...)`, métodos `login`, `register`, `logout`, `recoverPassword`. Implementación mock que reconoce 3 usuarios semilla (`buyer@wcm.co / producer@wcm.co / admin@wcm.co`, password `Cafe#2025`).
- `core/services/notification.service.ts` — signal array de toasts. Métodos `success/error/info/warning`, auto-dismiss 3.2s.
- `core/services/loading.service.ts` — contador global.

### 1.3 Guards e interceptors
- `core/auth/guards/`: `authGuard` (CanActivateFn), `roleGuard` (valida `route.data.role`), `publicGuard` (redirige si ya hay sesión), `producerApprovedGuard`.
- `core/auth/interceptors/auth.interceptor.ts` — añade `Authorization: Bearer <token>` si existe.
- `core/http/interceptors/error-handler.interceptor.ts` — centraliza errores HTTP en `NotificationService`.
- `core/http/interceptors/base-url.interceptor.ts` — prefija `environment.apiUrl`.
- Registrar `withInterceptors([...])` en [src/app/app.config.ts](src/app/app.config.ts) via `provideHttpClient`.

### 1.4 Verificación de Fase 1
- `npm run build && npm run lint` ✅.
- Comprobación manual: inyectar `AuthService` en `AppComponent` temporalmente, llamar `login()` con credenciales semilla y ver `currentUser()` cambiar.

---

## FASE 2 — Shared UI Library (componentes dumb)

**Objetivo:** catálogo reutilizable de componentes presentacionales standalone con `ChangeDetectionStrategy.OnPush`, `@Input()` signals y `@Output()` EventEmitters tipados. **Ningún componente aquí inyecta servicios de dominio** — solo reciben datos y emiten eventos (Single Responsibility).

Cada componente: `.ts` + `.html` + `.scss` (sin `.spec.ts` en esta iteración).

### 2.1 Controles de formulario (ControlValueAccessor)
- `ui/input/` — `InputComponent` con variantes (email/password/tel/text), prefijo-icono opcional, estados error/success, mensaje accesible via `aria-describedby`.
- `ui/select/` — select nativo estilizado.
- `ui/textarea/` — con contador de caracteres.
- `ui/checkbox/` — custom con marca ✓.
- `ui/toggle/` — track on/off.
- `ui/quantity-control/` — `- <n> +` con `min`, `max`, `step`.
- `ui/rating-stars/` — estrella input/display (toggle por `@Input() readonly`).
- `ui/upload-zone/` — reutiliza `DragDropDirective`. Previsualizaciones, tipo/tam validados.
- `ui/password-strength-meter/` — barra + etiqueta weak/fair/good/strong.

### 2.2 Indicadores visuales
- `ui/badge/`, `ui/status-pill/` (variantes: success/info/warning/error/neutral), `ui/stock-indicator/` (barra color-coded high/medium/low), `ui/step-indicator/` (círculos numerados con conectores), `ui/stat-card/` (valor, etiqueta, icono, trend), `ui/filter-chips/` (`FilterChipOption[]`, selección única/múltiple).

### 2.3 Estructurales
- `ui/button/` — variantes primary/secondary/ghost/danger, slot de icono, spinner cuando `loading`.
- `ui/avatar/` — circular, fallback con iniciales.
- `ui/tabs/` — `TabsComponent` + `TabComponent` con `<ng-content>`.
- `ui/modal/` — **mover** el existente [src/app/shared/components/modal/modal/](src/app/shared/components/modal/modal/) a `shared/components/ui/modal/`. Añadir trap de foco, cierre con Escape, overlay click, `role="dialog"`, `aria-modal="true"`.
- `ui/confirm-dialog/` — wrapper sobre `modal` con título, mensaje, botón OK/Cancel.
- `ui/empty-state/` — icono grande, título, descripción, CTA opcional.
- `ui/loading-spinner/`, `ui/skeleton/`.
- `ui/toast/` + `ui/toast-host/` — `ToastHostComponent` consume `NotificationService.toasts()` y renderiza toasts bottom-right con animación.

### 2.4 Pipes, directivas, validadores
- Pipes: `currency-cop`, `relative-time`, `truncate`, `certification-label`, `order-status`.
- Directivas: `click-outside`, `auto-focus`, `number-only` (+ mover `drag-drop` desde ubicación actual).
- Validators reactivos: `emailValidator`, `passwordStrengthValidator` (min 8, may/min/número), `matchFieldValidator` (confirm password), `positiveNumberValidator`, `requiredFileValidator`, + mover `arrayMinLengthValidator`.

### 2.5 Verificación de Fase 2
- `npm run build` sin errores en compilación de templates (strictTemplates detecta inputs mal tipados).
- `npm run lint` sin errores.

---

## FASE 3 — Shell / Layout compartido

**Objetivo:** layouts reutilizables por tipo de página.

- `shared/components/layout/navbar/` — topbar con logo, slot de search, slot de acciones derecha.
- `shared/components/layout/sidebar/` — lista de `SidebarItem` (icon, label, route, badge count), marca item activo por `routerLinkActive`.
- `shared/components/layout/footer/` — footer marca.
- `shared/components/layout/page-header/` — eyebrow, title, subtitle, slot acciones.
- `shared/components/layout/brand-panel/` — panel izquierdo marrón con ilustración de copa de café (SVG) — usado por login y registro.
- `shared/components/layout/panel-layout/` — layout privado con navbar fija + sidebar + `<main>`; acepta `SidebarItem[]` como Input para reutilizarse entre buyer/producer/admin.

Cada layout es 100% presentacional (sin servicios).

### 3.1 Verificación de Fase 3
- Page de prueba (ruta temporal `/demo-layout`) que renderice el `panel-layout` con items mock. Borrar al terminar.
- `npm run build` ✅.

---

## FASE 4 — Feature: Catalog (landing + detalle público)

**Objetivo:** convertir [md/landing_marketplace_cafe.html](md/landing_marketplace_cafe.html) a Angular. Ruta raíz `/` sin autenticación.

### 4.1 Modelos y servicios
- `features/catalog/models/`: `product.model.ts` (IProduct con id, name, producerName, price, rating, reviews, stock, maxStock, certifications[], categoryId, images[]), `category.model.ts`, `review.model.ts`, `filter.model.ts` (CategoryFilter, CertificationFilter, SortBy).
- `features/catalog/services/product.service.ts` — interfaz `IProductService` + implementación mock con 12-16 productos semilla (café colombiano, Huila/Nariño/Sierra Nevada, certs variadas). Métodos `list(filter, sort)`, `getById(id)`, `search(query)`.
- `features/catalog/services/category.service.ts` y `review.service.ts` también mock.

### 4.2 Componentes presentacionales
- `components/hero-section/` — título, subtítulo, CTAs, stats.
- `components/filters-bar/` — sticky, usa `ui/filter-chips` para categorías + certificaciones. Input dropdown de orden.
- `components/product-grid/` — recibe `products[]`, renderiza grid de `product-card`.
- `components/product-card/` — imagen, nombre, productor, rating, stock-indicator, precio, botón "Agregar" (emite `add`), toggle favorito (emite `toggleFavorite`).
- `components/product-gallery/`, `components/sustainability-section/`.

### 4.3 Páginas smart
- `pages/home/home.component.ts` — inyecta `ProductService` + `CategoryService`, mantiene signals `products`, `filter`, `sort`. Maneja eventos `addToCart` (emitir vía `CartService` cuando exista) y `toggleFavorite`.
- `pages/product-detail/product-detail.component.ts` — usa `ActivatedRoute.paramMap` + `toSignal`. Muestra galería, descripción, notas de taza, reseñas.

### 4.4 Routing
- `catalog.routes.ts` con `/` → home, `/productos/:id` → detail. Ambos `loadComponent`.
- Integrar en [src/app/app.routes.ts](src/app/app.routes.ts): `{ path: '', loadChildren: () => import('@features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES) }`.
- Conservar redirect actual `/productos` o decidir si se deprecia (ver pregunta 4 al usuario).

### 4.5 Verificación de Fase 4
- `/` renderiza grid con 12-16 productos mock, filtros funcionan, clic en card navega a detalle.
- `npm run build && npm run lint` ✅.

---

## FASE 5 — Feature: Auth (login + registro multi-paso)

**Objetivo:** convertir [md/login_ux_marketplace_cafe.html](md/login_ux_marketplace_cafe.html) y [md/registro_marketplace_cafe.html](md/registro_marketplace_cafe.html).

### 5.1 Login
- `pages/login/login.component.ts` — usa `<app-brand-panel>` + `<app-login-form>`. Inyecta `AuthService`.
- `components/login-form/` — FormGroup con `email` (Validators.required + emailValidator) y `password` (required + min 6). Toggle visibilidad. Botón con estado `loading`. Emite evento `submit` con credenciales.
- Al login exitoso: toast success + navega al panel correspondiente al rol.

### 5.2 Registro multi-paso
- `services/register-flow.state.ts` — servicio signal-based que mantiene: `step` (1|2), `role` (BUYER|PRODUCER|ADMIN), `personalData`, `roleData`. Métodos `next()`, `prev()`, `selectRole()`, `submit()`.
- `components/role-selector/` — 3 cards clicables (Comprador/Productor/Administrador).
- `components/register-stepper/` — step-indicator + contenedor dinámico.
- `components/personal-data-step/` — FormGroup (nombre, apellido, email, teléfono, password + strength meter, confirm, acepta términos). Validación `matchFieldValidator`.
- `components/role-specific-step/` — renderiza sub-formulario según rol (productor: finca, región, certificaciones, hectáreas, altitud / comprador: empresa, país, industria / admin: código invitación, rol sistema).
- `pages/register/register.component.ts` — orquestador.
- Al submit exitoso: llama `AuthService.register()`, toast success, redirige a login.

### 5.3 Forgot password
- `pages/forgot-password/` — formulario email, llama `AuthService.recoverPassword()`.

### 5.4 Routing + guards
- `auth.routes.ts` con `login | register | forgot-password`. Proteger con `publicGuard`.

### 5.5 Verificación de Fase 5
- Flujo manual: registro → login con las credenciales semilla → redirección a panel correcto según rol.
- Validaciones visibles: email mal formado, password débil, confirmación no coincide, términos no aceptados bloquean submit.
- `npm run build && npm run lint` ✅.

---

## FASE 6 — Feature: Buyer (panel comprador)

**Objetivo:** convertir [md/panel_comprador_cafe.html](md/panel_comprador_cafe.html).

### 6.1 Modelos y servicios
- `features/buyer/models/`: `cart.model.ts` (ICart, ICartItem), `order.model.ts` (IOrder, IOrderItem, OrderStatus enum), `shipping.model.ts` (IShippingOption), `checkout.model.ts`.
- `services/cart.service.ts` — signal-based: `items`, `subtotal`, `tax`, `discount`, `total` computados. Métodos `add(product, qty)`, `remove(itemId)`, `updateQty(itemId, qty)` (respeta stock), `applyCoupon(code)`, `clear()`. Persistencia en localStorage via TokenStorage.
- `services/order.service.ts` — mock con 3-5 pedidos semilla. `list()`, `getById()`, `cancel(id)`, `submitReview(orderId, productId, rating, comment)`.
- `services/address.service.ts` — CRUD local de direcciones.

### 6.2 Componentes
- `components/cart-item-row/`, `components/cart-summary/`, `components/shipping-selector/`, `components/coupon-input/`, `components/address-card/`, `components/order-card/` (expandible, incluye stepper), `components/order-stepper/` (progress stepper por estado), `components/review-modal/` (rating-stars + textarea en `ui/modal`).

### 6.3 Página
- `pages/buyer-dashboard/buyer-dashboard.component.ts` — usa `<app-panel-layout>` con sidebar [Carrito | Pedidos | Favoritos | Perfil], tab routing o `tabs` interna. Inyecta `CartService`, `OrderService`, `AddressService`.
- Sub-pages dentro o tabs según complejidad: **preferencia**: tabs internas dentro del dashboard para replicar el mockup.
- StatCards: total gastado, pedidos, favoritos, reseñas (derivados de señales).

### 6.4 Routing y guards
- `buyer.routes.ts` con `{ path: '', component: BuyerDashboardComponent, canActivate: [authGuard, roleGuard], data: { role: Role.BUYER } }`.

### 6.5 Verificación de Fase 6
- Flujo manual: agregar 2 productos al carrito desde catálogo → ver carrito con total correcto → simular checkout → ver pedido en pestaña Pedidos → dejar reseña.
- `npm run build && npm run lint` ✅.

---

## FASE 7 — Feature: Producer (panel productor)

**Objetivo:** convertir [md/panel_productor_cafe.html](md/panel_productor_cafe.html). **Reutiliza** `ProductFormComponent` y `ProductDashboardComponent` existentes.

### 7.1 Refactor de feature existente
- Mover `src/app/features/product-management/` → `src/app/features/producer/`.
  - `components/product-form/` → `features/producer/components/product-form/` (sin cambios funcionales).
  - `containers/product-dashboard/` → `features/producer/pages/my-products/my-products.page.ts` (renombre).
  - `constants/product.constants.ts` → `features/producer/constants/`.
  - `models/product.model.ts` → se compatibiliza con `ManagedProduct` del nuevo feature (mismos enums `ProductStatus`, `ProductUnit`, `Certification`).
- Actualizar imports rotos.

### 7.2 Nuevos modelos y servicios
- `models/managed-product.model.ts`, `received-order.model.ts`, `farm.model.ts`.
- `services/producer-product.service.ts` — CRUD sobre lista mock. Métodos `list()`, `create()`, `update()`, `toggleStatus()`, `remove()`.
- `services/producer-order.service.ts` — `list()`, `updateStatus(orderId, newStatus)` (flujo unidireccional confirmed→preparing→shipped→delivered, bloquear retrocesos).
- `services/farm.service.ts` — get/update de datos de finca + certificaciones.

### 7.3 Componentes adicionales
- `components/product-table-row/`, `components/received-order-row/`, `components/farm-info-card/`, `components/farm-map/` (SVG con pin animado), `components/certification-list/`, `components/sales-mini-chart/` (SVG/Canvas simple), `components/status-select/` (dropdown con opciones colored respetando flujo unidireccional).

### 7.4 Página
- `pages/producer-dashboard/producer-dashboard.component.ts` — panel-layout con sidebar [Productos | Mi Finca | Pedidos Recibidos | Rendimiento]. Tabs internas.
- Stat cards: ingresos, ventas totales, rating promedio, productos activos.

### 7.5 Routing + guards
- `producer.routes.ts` protegido con `authGuard + roleGuard(PRODUCER) + producerApprovedGuard`.

### 7.6 Verificación de Fase 7
- Flujo manual: abrir "Mis Productos" → crear producto (reutilizando form existente) → aparece en tabla → editar/inactivar → cambiar estado de pedido recibido respetando flujo unidireccional (no debe poder retroceder).
- Verificar que los `.spec.ts` ya existentes de `ProductFormComponent`, `ProductDashboardComponent`, `ModalComponent` siguen pasando tras el refactor de rutas.
- `npm run build && npm run lint` ✅.

---

## FASE 8 — Feature: Admin (panel administrador)

**Objetivo:** convertir [md/panel_admin_cafe.html](md/panel_admin_cafe.html).

### 8.1 Modelos y servicios
- `models/producer-approval.model.ts`, `admin-category.model.ts`, `admin-user.model.ts`, `activity.model.ts`.
- `services/producer-approval.service.ts` — `listPending()`, `listAll()`, `approve(id)`, `reject(id, reason)`.
- `services/admin-category.service.ts` — CRUD. Bloquear delete si hay productos activos (regla de negocio RN-5).
- `services/admin-user.service.ts` — list, suspend, reactivate, delete.
- `services/admin-activity.service.ts` — feed de eventos mock.

### 8.2 Componentes
- `components/pending-producer-card/`, `components/producer-detail-modal/` (reusa `ui/modal`), `components/producer-table-row/`, `components/category-table-row/`, `components/category-form/`, `components/user-table-row/`, `components/rejection-reason-field/` (textarea condicional), `components/activity-feed-item/`.

### 8.3 Página
- `pages/admin-dashboard/admin-dashboard.component.ts` — panel-layout con sidebar [Aprobaciones Pendientes | Productores | Categorías | Usuarios | Actividad].
- Stat cards: pendientes, productores activos, categorías, usuarios totales, ingresos plataforma.

### 8.4 Routing + guards
- `admin.routes.ts` protegido con `authGuard + roleGuard(ADMIN)`.

### 8.5 Verificación de Fase 8
- Flujo manual: ver pendiente → abrir modal → aprobar → productor pasa a activos / rechazar pide motivo → agregar categoría → intentar eliminar categoría con productos (debe bloquearse) → desactivar usuario.
- `npm run build && npm run lint` ✅.

---

## FASE 9 — Integración global, routing, redirecciones por rol

**Objetivo:** cablear todas las features y garantizar la navegación por rol.

- Reescribir [src/app/app.routes.ts](src/app/app.routes.ts):
  ```ts
  export const routes: Routes = [
    { path: '', loadChildren: () => import('@features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES) },
    { path: 'auth', loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES), canActivate: [publicGuard] },
    { path: 'panel/comprador', loadChildren: () => import('@features/buyer/buyer.routes').then(m => m.BUYER_ROUTES), canActivate: [authGuard, roleGuard], data: { role: Role.BUYER } },
    { path: 'panel/productor', loadChildren: () => import('@features/producer/producer.routes').then(m => m.PRODUCER_ROUTES), canActivate: [authGuard, roleGuard, producerApprovedGuard], data: { role: Role.PRODUCER } },
    { path: 'panel/admin', loadChildren: () => import('@features/admin/admin.routes').then(m => m.ADMIN_ROUTES), canActivate: [authGuard, roleGuard], data: { role: Role.ADMIN } },
    { path: '**', redirectTo: '' }
  ];
  ```
- Navbar: menú usuario con "Cerrar sesión" (invoca `AuthService.logout()`) y enlace "Ir a mi panel" según rol.
- Revisar [src/app/app.routes.server.ts](src/app/app.routes.server.ts) para SSR (marcar rutas públicas como `RenderMode.Prerender` y privadas como `RenderMode.Server`).
- Integrar `<app-toast-host />` en `AppComponent`.

### 9.1 Verificación de Fase 9
- Navegación completa manual: landing → login (comprador) → panel → logout → login (productor) → panel → logout → login (admin) → panel.
- Guards bloquean rutas cruzadas (comprador no entra a `/panel/admin`).

---

## FASE 10 — Accesibilidad y responsive final

- Auditoría WCAG AA manual: contraste, foco visible, navegación teclado, `aria-*` en modales/forms.
- Probar breakpoints 375 / 768 / 1024 / 1280 — corregir desbordes.
- `aria-live="polite"` en toasts y mensajes de error.
- Verificar skip-link funcional.

---

## FASE 11 — Validación final de compilación y calidad

**Objetivo crítico:** el proyecto compila, no tiene errores de lint, tests pasan, SSR funciona.

### 11.1 Checklist obligatorio
- [ ] `npm run lint` → 0 errores, 0 warnings tolerados (salvo los pre-existentes documentados).
- [ ] `npm run build` → build production exitoso, sin warnings de budget (si hay, ajustar imports o budget razonable).
- [ ] `npm test -- --watch=false --browsers=ChromeHeadless` → los specs **pre-existentes** siguen verdes (no se añaden specs nuevos en esta iteración).
- [ ] `npm run watch` y `npm start` — sin errores de compilación en desarrollo, HMR funciona.
- [ ] `npm run build && npm run serve:ssr:marketplace-cafe-front` — SSR renderiza `/` sin errores. Verificar que ningún servicio accede `window`, `document` o `localStorage` directamente sin `isPlatformBrowser(PLATFORM_ID)`.
- [ ] `npx tsc --noEmit` → sin errores TypeScript (strictTemplates, noPropertyAccessFromIndexSignature activados).
- [ ] Todas las rutas del plan navegables con al menos un usuario de cada rol (buyer@wcm.co, producer@wcm.co, admin@wcm.co).
- [ ] Sin `console.log` sobrantes (excepto `console.error` intencional en error interceptor).
- [ ] Sin uso de `any` (regla ESLint `@typescript-eslint/no-explicit-any`).
- [ ] Sin `// eslint-disable` ni `as any` para silenciar errores — solo correcciones reales.
- [ ] Todos los inputs de formularios con `aria-required`, `aria-invalid`, `aria-describedby` cuando corresponda.

### 11.2 Resolución sistemática de errores
Si algún check falla:
1. Leer el error completo, no adivinar.
2. Arreglar la causa raíz (nunca `// eslint-disable` ni `as any` para silenciar).
3. Volver a ejecutar el check.

### 11.3 Cierre
- Commit final con mensaje convencional: `feat: convert HTML mockups to Angular feature modules (buyer, producer, admin, catalog, auth)`.
- Actualizar [CLAUDE.md](CLAUDE.md) con la nueva estructura de features.

---

## Archivos críticos a modificar (referencia rápida)

| Archivo | Cambio |
|---------|--------|
| [tsconfig.json](tsconfig.json) | Añadir `paths` aliases |
| [angular.json](angular.json) | `fileReplacements` de environment |
| [src/app/app.config.ts](src/app/app.config.ts) | `provideHttpClient(withInterceptors([...]))` |
| [src/app/app.routes.ts](src/app/app.routes.ts) | Reescribir con lazy loading por feature |
| [src/app/app.routes.server.ts](src/app/app.routes.server.ts) | Definir render mode por ruta |
| [src/app/app.component.html](src/app/app.component.html) | Shell con `<router-outlet>` y `<app-toast-host>` |
| [src/styles.scss](src/styles.scss) | `@use './styles/styles'` |
| [src/index.html](src/index.html) | Google Fonts, skip-link, meta viewport |

## Artefactos reutilizados (sin reescribir)

- [src/app/shared/components/modal/modal/](src/app/shared/components/modal/modal/) → se mueve a `shared/components/ui/modal/`.
- [src/app/shared/utils/directives/drag-drop.directive.ts](src/app/shared/utils/directives/drag-drop.directive.ts) → se mueve a `shared/directives/`.
- [src/app/shared/utils/validators/array-min-length.validator.ts](src/app/shared/utils/validators/array-min-length.validator.ts) → se mueve a `shared/utils/validators/`.
- [src/app/features/product-management/components/product-form/](src/app/features/product-management/components/product-form/) → se integra en `features/producer/components/product-form/`.
- [src/app/features/product-management/containers/product-dashboard/](src/app/features/product-management/containers/product-dashboard/) → se integra en `features/producer/pages/my-products/`.

---

*Plan generado para World Coffee Marketplace — UNAB 2026-04-19.*