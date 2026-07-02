# PLAN DE TESTING FRONTEND — World Coffee Marketplace

> **Cobertura objetivo:** ≥ 90%
> **Framework:** Jasmine + Karma (configuración existente)
> **Angular:** 19 — Standalone, Signals, OnPush, `inject()`
> **Estado actual:** 0 archivos `.spec.ts` existentes — todo está pendiente

---

## Instrucciones para cada sesión de Claude Code

1. Lee este archivo para saber qué fase ejecutar.
2. Lee `CLAUDE.md` de la raíz para recordar convenciones del proyecto.
3. Ejecuta **solo la fase indicada** — no leas archivos de otras fases.
4. Al terminar la fase, ejecuta el comando de verificación indicado.
5. Marca la fase como `[x]` en este archivo al completarla.
6. **No modifiques archivos de producción.** Solo crea archivos `.spec.ts`.

---

## Convenciones de testing

- `TestBed.configureTestingModule({ imports: [ComponenteStandalone] })` para componentes standalone.
- Mockear dependencias con `jasmine.createSpyObj()`.
- Para servicios con `HttpClient`: `provideHttpClientTesting` + `HttpTestingController`.
- Para `signal()` inputs: `componentRef.setInput('name', value)` + `fixture.detectChanges()`.
- Para guards funcionales: invocar directamente la función pasando mocks de `ActivatedRouteSnapshot` y `RouterStateSnapshot`.
- Para pipes: testear `transform()` directamente sin `TestBed`.
- Para validators: testear la función pura con `new FormControl(value)`.
- No usar `@SpringBootTest` ni levantar contextos pesados — tests unitarios ligeros.

---

## Fase 1 — Validators y directivas utilitarias

- [x] Completada

**Alcance:** `src/app/shared/utils/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `shared/utils/validators/email.validator.ts` | Validator | `email.validator.spec.ts` |
| `shared/utils/validators/password.validator.ts` | Validator | `password.validator.spec.ts` |
| `shared/utils/validators/match-field.validator.ts` | Validator | `match-field.validator.spec.ts` |
| `shared/utils/validators/positive-number.validator.ts` | Validator | `positive-number.validator.spec.ts` |
| `shared/utils/validators/required-file.validator.ts` | Validator | `required-file.validator.spec.ts` |
| `shared/utils/validators/array-min-length.validator.ts` | Validator | `array-min-length.validator.spec.ts` |
| `shared/utils/directives/drag-drop.directive.ts` | Directive | `drag-drop.directive.spec.ts` |

**Dependencias a mockear:** Ninguna — funciones puras.

**Escenarios mínimos:**
- `email.validator`: Email válido → null · Email sin @ → error · Email vacío → error · Email con dominios edge case
- `password.validator`: Contraseña fuerte → null · Sin mayúscula → error · Sin número → error · Muy corta → error · `evaluatePasswordStrength()` retorna niveles correctos
- `match-field.validator`: Campos iguales → null · Campos diferentes → error · Campo objetivo no existe → error
- `positive-number.validator`: Número positivo → null · Cero → error · Negativo → error · No numérico → error
- `required-file.validator`: Con archivo → null · Sin archivo → error
- `array-min-length.validator`: Array con mínimo → null · Array vacío → error · Array insuficiente → error
- `drag-drop.directive`: Emite evento al drop · Previene default en dragover · Toggle clase CSS al dragenter/dragleave

**Comando de verificación:**
```bash
npx ng test --include='**/shared/utils/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `shared/utils/` ≥ 85%

---

## Fase 2 — Pipes

- [x] Completada

**Alcance:** `src/app/shared/pipes/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `shared/pipes/relative-time.pipe.ts` | Pipe | `relative-time.pipe.spec.ts` |
| `shared/pipes/currency-cop.pipe.ts` | Pipe | `currency-cop.pipe.spec.ts` |
| `shared/pipes/truncate.pipe.ts` | Pipe | `truncate.pipe.spec.ts` |
| `shared/pipes/certification-label.pipe.ts` | Pipe | `certification-label.pipe.spec.ts` |
| `shared/pipes/order-status.pipe.ts` | Pipe | `order-status.pipe.spec.ts` |

**Dependencias a mockear:** Ninguna — funciones de transformación puras.

**Escenarios mínimos:**
- `relative-time.pipe`: Hace segundos · Hace minutos · Hace horas · Hace días · Input null/undefined
- `currency-cop.pipe`: Número positivo → formato COP · Cero · Negativo · null/undefined
- `truncate.pipe`: Texto corto no se trunca · Texto largo se trunca con "..." · Límite personalizado · null/undefined
- `certification-label.pipe`: Cada tipo de certificación → label correcto · Tipo desconocido · null
- `order-status.pipe`: Cada estado de orden → label correcto · Estado desconocido · null

**Comando de verificación:**
```bash
npx ng test --include='**/shared/pipes/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `shared/pipes/` ≥ 90%

---

## Fase 3 — Servicios core

- [x] Completada

**Alcance:** `src/app/core/services/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `core/services/notification.service.ts` | Servicio | `notification.service.spec.ts` |
| `core/services/loading.service.ts` | Servicio | `loading.service.spec.ts` |

**Dependencias a mockear:** Ninguna directa (servicios basados en Signals).

**Escenarios mínimos:**
- `notification.service`: Muestra toast success · Muestra toast error · Muestra toast info · Toast desaparece tras timeout · Múltiples toasts simultáneos
- `loading.service`: `show()` activa loading signal · `hide()` desactiva · Estado inicial es false · Llamadas anidadas (show-show-hide mantiene activo, hide-hide desactiva)

**Comando de verificación:**
```bash
npx ng test --include='**/core/services/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `core/services/` ≥ 90%

---

## Fase 4 — Auth services, guards e interceptor

- [x] Completada

**Alcance:** `src/app/core/auth/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `core/auth/services/auth.service.ts` | Servicio | `auth.service.spec.ts` |
| `core/auth/services/token-storage.service.ts` | Servicio | `token-storage.service.spec.ts` |
| `core/auth/guards/auth.guard.ts` | Guard | `auth.guard.spec.ts` |
| `core/auth/guards/public.guard.ts` | Guard | `public.guard.spec.ts` |
| `core/auth/guards/role.guard.ts` | Guard | `role.guard.spec.ts` |
| `core/auth/guards/producer-approved.guard.ts` | Guard | `producer-approved.guard.spec.ts` |
| `core/auth/interceptors/auth.interceptor.ts` | Interceptor | `auth.interceptor.spec.ts` |

**Nota:** Los archivos de `core/auth/models/` (role.enum.ts, user.model.ts, auth-response.model.ts, producer-status.enum.ts) son interfaces/enums sin lógica — no requieren tests.

**Dependencias a mockear:** `Router`, `HttpClient`, `TokenStorageService`, `NotificationService`.

**Escenarios mínimos:**
- `auth.service`: Login exitoso → almacena token + navega por rol · Login fallido → error · Register exitoso · Logout limpia estado · `isAuthenticated()` · `currentUser()` · `hasRole()` · `recoverPassword()` muestra toast
- `token-storage.service`: Guardar token · Recuperar token · Eliminar token · Token expirado
- `auth.guard`: Usuario autenticado → permite · No autenticado → redirige a login · Rol incorrecto → redirige
- `public.guard`: No autenticado → permite · Autenticado → redirige a panel por rol
- `role.guard`: Rol correcto → permite · Rol incorrecto → redirige · Sin rol → redirige
- `producer-approved.guard`: Productor aprobado → permite · Productor pendiente → redirige · No productor → redirige
- `auth.interceptor`: Agrega header Authorization si hay token · No agrega si no hay token · Maneja 401 → logout

**Comando de verificación:**
```bash
npx ng test --include='**/core/auth/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `core/auth/` ≥ 85%

---

## Fase 5a — Componentes UI compartidos (parte 1: simples)

- [x] Completada

**Alcance:** `src/app/shared/ui/` — componentes sin formulario

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `shared/ui/button/button.component.ts` | Dumb | `button.component.spec.ts` |
| `shared/ui/badge/badge.component.ts` | Dumb | `badge.component.spec.ts` |
| `shared/ui/avatar/avatar.component.ts` | Dumb | `avatar.component.spec.ts` |
| `shared/ui/loading-spinner/loading-spinner.component.ts` | Dumb | `loading-spinner.component.spec.ts` |
| `shared/ui/skeleton/skeleton.component.ts` | Dumb | `skeleton.component.spec.ts` |
| `shared/ui/empty-state/empty-state.component.ts` | Dumb | `empty-state.component.spec.ts` |
| `shared/ui/status-pill/status-pill.component.ts` | Dumb | `status-pill.component.spec.ts` |
| `shared/ui/stat-card/stat-card.component.ts` | Dumb | `stat-card.component.spec.ts` |

**Dependencias a mockear:** Ninguna.

**Escenarios mínimos (por cada uno):**
- Renderiza con inputs por defecto
- Renderiza con inputs personalizados
- Emite output al interactuar (si aplica)
- Condicionales del template (ej. mostrar/ocultar elementos según input)

**Comando de verificación:**
```bash
npx ng test --include='**/shared/ui/button/**/*.spec.ts,**/shared/ui/badge/**/*.spec.ts,**/shared/ui/avatar/**/*.spec.ts,**/shared/ui/loading-spinner/**/*.spec.ts,**/shared/ui/skeleton/**/*.spec.ts,**/shared/ui/empty-state/**/*.spec.ts,**/shared/ui/status-pill/**/*.spec.ts,**/shared/ui/stat-card/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan

---

## Fase 5b — Componentes UI compartidos (parte 2: interactivos)

- [x] Completada

**Alcance:** `src/app/shared/ui/` — componentes con formulario o interacción compleja

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `shared/ui/input/input.component.ts` | Dumb | `input.component.spec.ts` |
| `shared/ui/select/select.component.ts` | Dumb | `select.component.spec.ts` |
| `shared/ui/textarea/textarea.component.ts` | Dumb | `textarea.component.spec.ts` |
| `shared/ui/checkbox/checkbox.component.ts` | Dumb | `checkbox.component.spec.ts` |
| `shared/ui/toggle/toggle.component.ts` | Dumb | `toggle.component.spec.ts` |
| `shared/ui/quantity-control/quantity-control.component.ts` | Dumb | `quantity-control.component.spec.ts` |
| `shared/ui/rating-stars/rating-stars.component.ts` | Dumb | `rating-stars.component.spec.ts` |
| `shared/ui/stock-indicator/stock-indicator.component.ts` | Dumb | `stock-indicator.component.spec.ts` |

**Dependencias a mockear:** Ninguna.

**Escenarios mínimos:**
- `input`: Renderiza label · Muestra error · Emite valor · Disabled state
- `select`: Renderiza opciones · Selección emite valor · Placeholder visible
- `textarea`: Renderiza · Emite valor · Muestra caracteres restantes si aplica
- `checkbox`: Checked/unchecked · Emite cambio · Disabled
- `toggle`: On/off · Emite cambio · Disabled
- `quantity-control`: Incrementar · Decrementar · No baja de mínimo · No sube de máximo · Emite cambio
- `rating-stars`: Renderiza N estrellas · Click emite rating · Modo readonly no emite
- `stock-indicator`: Stock alto → verde · Stock bajo → amarillo · Sin stock → rojo

**Comando de verificación:**
```bash
npx ng test --include='**/shared/ui/input/**/*.spec.ts,**/shared/ui/select/**/*.spec.ts,**/shared/ui/textarea/**/*.spec.ts,**/shared/ui/checkbox/**/*.spec.ts,**/shared/ui/toggle/**/*.spec.ts,**/shared/ui/quantity-control/**/*.spec.ts,**/shared/ui/rating-stars/**/*.spec.ts,**/shared/ui/stock-indicator/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan

---

## Fase 5c — Componentes UI compartidos (parte 3: overlay y navegación)

- [x] Completada

**Alcance:** `src/app/shared/ui/` — modales, toasts, steps, filtros, upload

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `shared/ui/modal/modal.component.ts` | Dumb | `modal.component.spec.ts` |
| `shared/ui/confirm-dialog/confirm-dialog.component.ts` | Dumb | `confirm-dialog.component.spec.ts` |
| `shared/ui/toast/toast.component.ts` | Dumb | `toast.component.spec.ts` |
| `shared/ui/toast-host/toast-host.component.ts` | Dumb | `toast-host.component.spec.ts` |
| `shared/ui/step-indicator/step-indicator.component.ts` | Dumb | `step-indicator.component.spec.ts` |
| `shared/ui/tabs/tabs.component.ts` | Dumb | `tabs.component.spec.ts` |
| `shared/ui/filter-chips/filter-chips.component.ts` | Dumb | `filter-chips.component.spec.ts` |
| `shared/ui/password-strength-meter/password-strength-meter.component.ts` | Dumb | `password-strength-meter.component.spec.ts` |
| `shared/ui/upload-zone/upload-zone.component.ts` | Dumb | `upload-zone.component.spec.ts` |

**Dependencias a mockear:** `NotificationService` (para toast-host).

**Escenarios mínimos:**
- `modal`: Abre/cierra · Emite close · Focus trap · Backdrop click cierra
- `confirm-dialog`: Muestra mensaje · Confirmar emite · Cancelar emite
- `toast`: Renderiza tipo (success/error/info) · Muestra mensaje · Emite dismiss
- `toast-host`: Renderiza lista de toasts · Toasts desaparecen
- `step-indicator`: Renderiza pasos · Paso activo resaltado · Pasos completados marcados
- `tabs`: Renderiza tabs · Click cambia tab activo · Emite cambio
- `filter-chips`: Renderiza chips · Click selecciona/deselecciona · Emite filtros activos
- `password-strength-meter`: Débil → rojo · Media → amarillo · Fuerte → verde
- `upload-zone`: Acepta drop · Rechaza tipo inválido · Muestra preview · Emite archivo

**Comando de verificación:**
```bash
npx ng test --include='**/shared/ui/modal/**/*.spec.ts,**/shared/ui/confirm-dialog/**/*.spec.ts,**/shared/ui/toast/**/*.spec.ts,**/shared/ui/toast-host/**/*.spec.ts,**/shared/ui/step-indicator/**/*.spec.ts,**/shared/ui/tabs/**/*.spec.ts,**/shared/ui/filter-chips/**/*.spec.ts,**/shared/ui/password-strength-meter/**/*.spec.ts,**/shared/ui/upload-zone/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `shared/ui/` ≥ 85%

---

## Fase 6 — Componentes de layout

- [x] Completada

**Alcance:** `src/app/shared/layout/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `shared/layout/brand-panel/brand-panel.component.ts` | Dumb | `brand-panel.component.spec.ts` |
| `shared/layout/navbar/navbar.component.ts` | Dumb | `navbar.component.spec.ts` |
| `shared/layout/landing-navbar/landing-navbar.component.ts` | Smart | `landing-navbar.component.spec.ts` |
| `shared/layout/dashboard-nav/dashboard-nav.component.ts` | Smart | `dashboard-nav.component.spec.ts` |
| `shared/layout/sidebar/sidebar.component.ts` | Dumb | `sidebar.component.spec.ts` |
| `shared/layout/panel-layout/panel-layout.component.ts` | Dumb | `panel-layout.component.spec.ts` |
| `shared/layout/page-header/page-header.component.ts` | Dumb | `page-header.component.spec.ts` |
| `shared/layout/footer/footer.component.ts` | Dumb | `footer.component.spec.ts` |

**Nota:** `shared/layout/index.ts` es un barrel file — no requiere test.

**Dependencias a mockear:** `Router`, `AuthService`, `CartService` (para navbar con badge de carrito).

**Escenarios mínimos:**
- `brand-panel`: Renderiza logo y nombre
- `navbar`: Renderiza links · Muestra/oculta según autenticación
- `landing-navbar`: Renderiza links públicos · Carrito badge muestra cantidad · Link a login visible
- `dashboard-nav`: Renderiza según rol · Logout funciona · Indica ruta activa
- `sidebar`: Renderiza items de navegación · Item activo resaltado · Toggle collapse
- `panel-layout`: Renderiza sidebar + content area · Responsive
- `page-header`: Renderiza título · Renderiza breadcrumb si aplica
- `footer`: Renderiza links y copyright

**Comando de verificación:**
```bash
npx ng test --include='**/shared/layout/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `shared/layout/` ≥ 85%

---

## Fase 7 — Feature Auth (login, registro, forgot-password)

- [x] Completada

**Alcance:** `src/app/features/auth/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/auth/services/register-flow.state.ts` | Servicio (state) | `register-flow.state.spec.ts` |
| `features/auth/components/login-form/login-form.component.ts` | Dumb | `login-form.component.spec.ts` |
| `features/auth/components/role-selector/role-selector.component.ts` | Dumb | `role-selector.component.spec.ts` |
| `features/auth/components/personal-data-step/personal-data-step.component.ts` | Dumb | `personal-data-step.component.spec.ts` |
| `features/auth/components/role-specific-step/role-specific-step.component.ts` | Dumb | `role-specific-step.component.spec.ts` |
| `features/auth/pages/login/login.component.ts` | Smart | `login.component.spec.ts` |
| `features/auth/pages/register/register.component.ts` | Smart | `register.component.spec.ts` |
| `features/auth/pages/forgot-password/forgot-password.component.ts` | Smart | `forgot-password.component.spec.ts` |

**Nota:** `features/auth/auth.routes.ts` es configuración de rutas — no requiere test unitario.

**Dependencias a mockear:** `AuthService`, `Router`, `RegisterFlowState`, `NotificationService`.

**Escenarios mínimos:**
- `register-flow.state`: `next()`/`prev()` cambian step · `selectRole()` actualiza signal · `reset()` limpia estado
- `login-form`: Emite credenciales al submit · Validación de email · Validación de password requerido · Toggle visibilidad password · Link forgot-password emite evento
- `role-selector`: Emite rol seleccionado · Renderiza cards · Card seleccionada resaltada
- `personal-data-step`: Validación de todos los campos · Emite datos al submit · Password strength meter visible · Términos requeridos
- `role-specific-step`: Campos de productor visibles si rol=producer · Campos de buyer visibles si rol=buyer · Emite datos
- `login.component`: Submit llama AuthService.login · Loading state · Error state · Enlace a registro
- `register.component`: Paso 1 → Paso 2 · Submit llama AuthService.register · Loading · Error
- `forgot-password.component`: Submit llama recoverPassword · Toast visible · Enlace a login

**Comando de verificación:**
```bash
npx ng test --include='**/features/auth/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `features/auth/` ≥ 85%

---

## Fase 8a — Feature Catalog: servicios y resolver

- [x] Completada

**Alcance:** `src/app/features/catalog/services/` + `resolvers/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/catalog/services/product.service.ts` | Servicio | `product.service.spec.ts` |
| `features/catalog/services/category.service.ts` | Servicio | `category.service.spec.ts` |
| `features/catalog/services/review.service.ts` | Servicio | `review.service.spec.ts` |
| `features/catalog/services/certification.service.ts` | Servicio | `certification.service.spec.ts` |
| `features/catalog/resolvers/product-detail.resolver.ts` | Resolver | `product-detail.resolver.spec.ts` |

**Nota:** Los archivos en `models/` (product.model.ts, category.model.ts, review.model.ts) son interfaces — no requieren tests.

**Dependencias a mockear:** `HttpClient` (HttpTestingController), `Router`.

**Escenarios mínimos:**
- `product.service`: getAll → lista · getById → producto · getById inexistente → error · Filtrar por categoría · Buscar por texto
- `category.service`: getAll → lista · getById → categoría
- `review.service`: getByProductId → lista · Crear reseña · Promedio de rating
- `certification.service`: getByCriteria → lista
- `product-detail.resolver`: ID válido → producto · ID inexistente → redirige

**Comando de verificación:**
```bash
npx ng test --include='**/features/catalog/services/**/*.spec.ts,**/features/catalog/resolvers/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura ≥ 85%

---

## Fase 8b — Feature Catalog: componentes y páginas

- [x] Completada

**Alcance:** `src/app/features/catalog/components/` + `pages/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/catalog/components/hero-section/hero-section.component.ts` | Dumb | `hero-section.component.spec.ts` |
| `features/catalog/components/product-card/product-card.component.ts` | Dumb | `product-card.component.spec.ts` |
| `features/catalog/components/product-grid/product-grid.component.ts` | Dumb | `product-grid.component.spec.ts` |
| `features/catalog/components/filters-bar/filters-bar.component.ts` | Dumb | `filters-bar.component.spec.ts` |
| `features/catalog/components/product-gallery/product-gallery.component.ts` | Dumb | `product-gallery.component.spec.ts` |
| `features/catalog/components/product-options/product-options.component.ts` | Dumb | `product-options.component.spec.ts` |
| `features/catalog/components/product-cta/product-cta.component.ts` | Dumb | `product-cta.component.spec.ts` |
| `features/catalog/components/product-detail-tabs/product-detail-tabs.component.ts` | Dumb | `product-detail-tabs.component.spec.ts` |
| `features/catalog/components/product-suggestions/product-suggestions.component.ts` | Dumb | `product-suggestions.component.spec.ts` |
| `features/catalog/components/flavor-notes/flavor-notes.component.ts` | Dumb | `flavor-notes.component.spec.ts` |
| `features/catalog/components/producers-section/producers-section.component.ts` | Dumb | `producers-section.component.spec.ts` |
| `features/catalog/components/sustainability-section/sustainability-section.component.ts` | Dumb | `sustainability-section.component.spec.ts` |
| `features/catalog/components/landing-navbar/landing-navbar.component.ts` | Smart | `landing-navbar.component.spec.ts` |
| `features/catalog/pages/home/home.component.ts` | Smart | `home.component.spec.ts` |
| `features/catalog/pages/product-detail/product-detail.component.ts` | Smart | `product-detail.component.spec.ts` |

**Dependencias a mockear:** `ProductService`, `CategoryService`, `ReviewService`, `CartService`, `FavoritesService`, `AuthService`, `Router`, `ActivatedRoute`.

**Escenarios mínimos:**
- Componentes dumb: Renderiza inputs · Emite outputs · Condicionales del template
- `home.component`: Carga productos · Filtra · Busca · Loading state
- `product-detail.component`: Carga producto por ruta · Muestra galería/tabs/sugerencias · Agregar al carrito · Agregar a favoritos

**Comando de verificación:**
```bash
npx ng test --include='**/features/catalog/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `features/catalog/` ≥ 85%

---

## Fase 9a — Feature Buyer: servicios

- [x] Completada

**Alcance:** `src/app/features/buyer/services/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/buyer/services/cart.service.ts` | Servicio | `cart.service.spec.ts` |
| `features/buyer/services/order.service.ts` | Servicio | `order.service.spec.ts` |
| `features/buyer/services/favorites.service.ts` | Servicio | `favorites.service.spec.ts` |
| `features/buyer/services/address.service.ts` | Servicio | `address.service.spec.ts` |
| `features/buyer/services/review.service.ts` | Servicio | `review.service.spec.ts` |
| `features/buyer/services/payment-method.service.ts` | Servicio | `payment-method.service.spec.ts` |
| `features/buyer/services/buyer-profile.service.ts` | Servicio | `buyer-profile.service.spec.ts` |

**Nota:** Archivos en `models/` son interfaces — no requieren tests.

**Dependencias a mockear:** `HttpClient` (HttpTestingController), `AuthService`.

**Escenarios mínimos:**
- `cart.service`: addItem · removeItem · updateQuantity · getCart · clearCart · Total calculado correctamente
- `order.service`: createOrder · getOrders · getOrderById · cancelOrder
- `favorites.service`: addFavorite · removeFavorite · getFavorites · isFavorite
- `address.service`: getAddresses · addAddress · updateAddress · deleteAddress · setDefault
- `review.service`: createReview · getMyReviews
- `payment-method.service`: getMethods · getMethodById
- `buyer-profile.service`: getProfile · updateProfile

**Comando de verificación:**
```bash
npx ng test --include='**/features/buyer/services/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura ≥ 85%

---

## Fase 9b — Feature Buyer: componentes

- [x] Completada

**Alcance:** `src/app/features/buyer/components/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/buyer/components/cart-item-row/cart-item-row.component.ts` | Dumb | `cart-item-row.component.spec.ts` |
| `features/buyer/components/cart-summary/cart-summary.component.ts` | Dumb | `cart-summary.component.spec.ts` |
| `features/buyer/components/checkout-overlay/checkout-overlay.component.ts` | Dumb | `checkout-overlay.component.spec.ts` |
| `features/buyer/components/order-card/order-card.component.ts` | Dumb | `order-card.component.spec.ts` |
| `features/buyer/components/order-stepper/order-stepper.component.ts` | Dumb | `order-stepper.component.spec.ts` |
| `features/buyer/components/address-card/address-card.component.ts` | Dumb | `address-card.component.spec.ts` |
| `features/buyer/components/address-form/address-form.component.ts` | Dumb | `address-form.component.spec.ts` |
| `features/buyer/components/favorite-product-card/favorite-product-card.component.ts` | Dumb | `favorite-product-card.component.spec.ts` |
| `features/buyer/components/review-card/review-card.component.ts` | Dumb | `review-card.component.spec.ts` |
| `features/buyer/components/review-modal/review-modal.component.ts` | Dumb | `review-modal.component.spec.ts` |
| `features/buyer/components/review-form-modal/review-form-modal.component.ts` | Dumb | `review-form-modal.component.spec.ts` |
| `features/buyer/components/shipping-selector/shipping-selector.component.ts` | Dumb | `shipping-selector.component.spec.ts` |
| `features/buyer/components/coupon-input/coupon-input.component.ts` | Dumb | `coupon-input.component.spec.ts` |
| `features/buyer/components/buyer-profile-form/buyer-profile-form.component.ts` | Dumb | `buyer-profile-form.component.spec.ts` |

**Dependencias a mockear:** Ninguna (componentes dumb reciben inputs y emiten outputs).

**Escenarios mínimos (por cada uno):**
- Renderiza con inputs válidos
- Emite output al interactuar (click, submit, etc.)
- Condicionales del template (ej. botón deshabilitado si form inválido)
- Validación de formularios (en address-form, buyer-profile-form, review-form-modal)

**Comando de verificación:**
```bash
npx ng test --include='**/features/buyer/components/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan

---

## Fase 9c — Feature Buyer: dashboard page

- [x] Completada

**Alcance:** `src/app/features/buyer/pages/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/buyer/pages/dashboard/buyer-dashboard.component.ts` | Smart | `buyer-dashboard.component.spec.ts` |

**Dependencias a mockear:** `CartService`, `OrderService`, `FavoritesService`, `AddressService`, `ReviewService`, `BuyerProfileService`, `PaymentMethodService`, `AuthService`, `Router`, `NotificationService`.

**Escenarios mínimos:**
- Inicialización carga datos · Tabs cambian vista · Tab carrito muestra items · Tab órdenes muestra lista · Tab favoritos muestra lista · Tab perfil muestra formulario · Checkout flow · Loading/error states

**Comando de verificación:**
```bash
npx ng test --include='**/features/buyer/pages/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura total de `features/buyer/` ≥ 85%

---

## Fase 10a — Feature Producer: servicios

- [x] Completada

**Alcance:** `src/app/features/producer/services/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/producer/services/producer-product.service.ts` | Servicio | `producer-product.service.spec.ts` |
| `features/producer/services/producer-order.service.ts` | Servicio | `producer-order.service.spec.ts` |
| `features/producer/services/producer-review.service.ts` | Servicio | `producer-review.service.spec.ts` |
| `features/producer/services/producer-profile.service.ts` | Servicio | `producer-profile.service.spec.ts` |
| `features/producer/services/farm.service.ts` | Servicio | `farm.service.spec.ts` |

**Nota:** Archivos en `models/` son interfaces — no requieren tests.

**Dependencias a mockear:** `HttpClient` (HttpTestingController), `AuthService`.

**Escenarios mínimos:**
- `producer-product.service`: getMyProducts · createProduct · updateProduct · deleteProduct
- `producer-order.service`: getReceivedOrders · updateOrderStatus · getOrderDetail
- `producer-review.service`: getProductReviews · replyToReview
- `producer-profile.service`: getProfile · updateProfile
- `farm.service`: getFarm · updateFarm · getCertifications · addCertification · deleteCertification

**Comando de verificación:**
```bash
npx ng test --include='**/features/producer/services/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura ≥ 85%

---

## Fase 10b — Feature Producer: componentes y dashboard

- [x] Completada

**Alcance:** `src/app/features/producer/components/` + `pages/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/producer/components/product-table-row/product-table-row.component.ts` | Dumb | `product-table-row.component.spec.ts` |
| `features/producer/components/product-form-modal/product-form-modal.component.ts` | Dumb | `product-form-modal.component.spec.ts` |
| `features/producer/components/received-order-row/received-order-row.component.ts` | Dumb | `received-order-row.component.spec.ts` |
| `features/producer/components/producer-review-card/producer-review-card.component.ts` | Dumb | `producer-review-card.component.spec.ts` |
| `features/producer/components/producer-profile-form/producer-profile-form.component.ts` | Dumb | `producer-profile-form.component.spec.ts` |
| `features/producer/components/farm-info-card/farm-info-card.component.ts` | Dumb | `farm-info-card.component.spec.ts` |
| `features/producer/components/farm-edit-modal/farm-edit-modal.component.ts` | Dumb | `farm-edit-modal.component.spec.ts` |
| `features/producer/components/farm-map/farm-map.component.ts` | Dumb | `farm-map.component.spec.ts` |
| `features/producer/components/certification-list/certification-list.component.ts` | Dumb | `certification-list.component.spec.ts` |
| `features/producer/components/certification-form-modal/certification-form-modal.component.ts` | Dumb | `certification-form-modal.component.spec.ts` |
| `features/producer/components/sales-mini-chart/sales-mini-chart.component.ts` | Dumb | `sales-mini-chart.component.spec.ts` |
| `features/producer/pages/dashboard/producer-dashboard.component.ts` | Smart | `producer-dashboard.component.spec.ts` |

**Dependencias a mockear:** `ProducerProductService`, `ProducerOrderService`, `ProducerReviewService`, `ProducerProfileService`, `FarmService`, `AuthService`, `Router`, `NotificationService`.

**Escenarios mínimos:**
- Componentes dumb: Renderiza inputs · Emite outputs · Formularios validan
- `product-form-modal`: Modo creación vs edición · Validación de campos · Submit emite payload
- `producer-dashboard`: Inicialización · Tabs · CRUD productos funciona · Órdenes se listan · Reseñas se responden

**Comando de verificación:**
```bash
npx ng test --include='**/features/producer/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `features/producer/` ≥ 85%

---

## Fase 11a — Feature Admin: servicios

- [x] Completada

**Alcance:** `src/app/features/admin/services/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/admin/services/admin-user.service.ts` | Servicio | `admin-user.service.spec.ts` |
| `features/admin/services/admin-product.service.ts` | Servicio | `admin-product.service.spec.ts` |
| `features/admin/services/admin-category.service.ts` | Servicio | `admin-category.service.spec.ts` |
| `features/admin/services/producer-approval.service.ts` | Servicio | `producer-approval.service.spec.ts` |
| `features/admin/services/admin-activity.service.ts` | Servicio | `admin-activity.service.spec.ts` |

**Nota:** Archivos en `models/` son interfaces — no requieren tests.

**Dependencias a mockear:** `HttpClient` (HttpTestingController).

**Escenarios mínimos:**
- `admin-user.service`: getUsers · getUserById · updateUserStatus · Filtros
- `admin-product.service`: getProducts · approveProduct · rejectProduct · Filtros
- `admin-category.service`: getCategories · createCategory · updateCategory · deleteCategory
- `producer-approval.service`: getPendingProducers · approveProducer · rejectProducer
- `admin-activity.service`: getRecentActivity

**Comando de verificación:**
```bash
npx ng test --include='**/features/admin/services/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura ≥ 85%

---

## Fase 11b — Feature Admin: componentes y dashboard

- [x] Completada

**Alcance:** `src/app/features/admin/components/` + `pages/`

**Archivos a testear:**

| Archivo | Tipo | Crear |
|---------|------|-------|
| `features/admin/components/user-table-row/user-table-row.component.ts` | Dumb | `user-table-row.component.spec.ts` |
| `features/admin/components/producer-table-row/producer-table-row.component.ts` | Dumb | `producer-table-row.component.spec.ts` |
| `features/admin/components/pending-producer-card/pending-producer-card.component.ts` | Dumb | `pending-producer-card.component.spec.ts` |
| `features/admin/components/producer-detail-modal/producer-detail-modal.component.ts` | Dumb | `producer-detail-modal.component.spec.ts` |
| `features/admin/components/rejection-reason-modal/rejection-reason-modal.component.ts` | Dumb | `rejection-reason-modal.component.spec.ts` |
| `features/admin/components/category-table-row/category-table-row.component.ts` | Dumb | `category-table-row.component.spec.ts` |
| `features/admin/components/category-form-modal/category-form-modal.component.ts` | Dumb | `category-form-modal.component.spec.ts` |
| `features/admin/components/activity-feed-item/activity-feed-item.component.ts` | Dumb | `activity-feed-item.component.spec.ts` |
| `features/admin/pages/dashboard/admin-dashboard.component.ts` | Smart | `admin-dashboard.component.spec.ts` |

**Dependencias a mockear:** `AdminUserService`, `AdminProductService`, `AdminCategoryService`, `ProducerApprovalService`, `AdminActivityService`, `AuthService`, `Router`, `NotificationService`.

**Escenarios mínimos:**
- Componentes dumb: Renderiza inputs · Emite outputs
- `rejection-reason-modal`: Valida razón requerida · Emite razón al confirmar
- `category-form-modal`: Modo crear vs editar · Validación · Submit
- `admin-dashboard`: Inicialización · Tabs · Aprobación productores · Aprobación productos · CRUD categorías · Lista usuarios

**Comando de verificación:**
```bash
npx ng test --include='**/features/admin/**/*.spec.ts' --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:** Todos los tests pasan + cobertura de `features/admin/` ≥ 85%

---

## Validación final

Ejecutar tras completar todas las fases:

```bash
npx ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

**Criterio de éxito:**
- Todos los tests pasan (0 failures)
- Cobertura global ≥ 90%
- `npm run build` sin errores

---

## Resumen de fases

| Fase | Alcance | Archivos | Estado |
|------|---------|----------|--------|
| 1 | Validators + directivas | 7 | ✅ |
| 2 | Pipes | 5 | ✅ |
| 3 | Core services | 2 | ✅ |
| 4 | Auth services, guards, interceptor | 7 | ✅ |
| 5a | UI simples | 8 | ✅ |
| 5b | UI interactivos | 8 | ☐ |
| 5c | UI overlay/nav | 9 | ☐ |
| 6 | Layout | 8 | ☐ |
| 7 | Feature Auth | 8 | ☐ |
| 8a | Catalog servicios/resolver | 5 | ☐ |
| 8b | Catalog componentes/páginas | 15 | ☐ |
| 9a | Buyer servicios | 7 | ✅ |
| 9b | Buyer componentes | 14 | ✅ |
| 9c | Buyer dashboard | 1 | ✅ |
| 10a | Producer servicios | 5 | ☐ |
| 10b | Producer componentes/dashboard | 12 | ☐ |
| 11a | Admin servicios | 5 | ☐ |
| 11b | Admin componentes/dashboard | 9 | ☐ |
| **TOTAL** | | **135** | |
