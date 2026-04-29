# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (ng serve)
npm run build      # Production build
npm run watch      # Watch mode build (development)
npm test           # Run unit tests with Karma/Jasmine
npm run lint       # ESLint (must pass with 0 errors)
npm run serve:ssr:marketplace-cafe-front  # Run SSR server after build
```

To run a single test file: `npx ng test --include='**/path/to/file.spec.ts'`

## Architecture

**Angular 19** standalone app with **SSR enabled** (Express). No NgModules — all components use `standalone: true`. Change detection is `OnPush` everywhere.

### Key patterns

- **Signals**: `signal()`, `computed()`, `effect()` for all reactive state. Use `input()` / `output()` signal-based I/O — avoid `@Input()` / `@Output()` decorators in new components.
- **DI**: Always use `inject()` function, never constructor injection.
- **Smart / Dumb**: Pages (in `pages/`) inject services. Components (in `components/`) receive `input()` and emit `output()` only.
- **Attribute selectors**: Table-row components use `selector: '[app-xxx-row]'` for valid HTML structure (see ADR-004). Suppress with `// eslint-disable-next-line @angular-eslint/component-selector`.

### Structure

```
src/app/
├── core/
│   ├── auth/          # AuthService, guards (authGuard, publicGuard), models, Role enum
│   └── services/      # NotificationService
├── features/
│   ├── auth/          # Login, Register, ForgotPassword pages + components
│   ├── buyer/         # BuyerDashboard — cart, orders, favorites, profile tabs
│   ├── catalog/       # Landing page, ProductDetail, ProductService, ReviewService
│   ├── producer/      # ProducerDashboard — product CRUD, orders, farm profile
│   └── admin/         # AdminDashboard — users, products, producers approval, categories
└── shared/
    ├── layout/        # LandingNavbarComponent, DashboardNavComponent, BrandPanelComponent
    ├── pipes/         # RelativeTimePipe
    └── ui/            # ButtonComponent, InputComponent, ModalComponent, ToastComponent,
                       # StepIndicatorComponent, PasswordStrengthMeterComponent,
                       # CheckboxComponent, ToggleComponent, LoadingSpinnerComponent
```

### Routing

```
/                     → Catalog landing (LandingPageComponent)
/producto/:id         → ProductDetailComponent
/auth/login           → LoginComponent          [publicGuard]
/auth/register        → RegisterComponent       [publicGuard]
/auth/forgot-password → ForgotPasswordComponent [publicGuard]
/panel/comprador      → BuyerDashboardComponent [authGuard(BUYER)]
/panel/productor      → ProducerDashboardComponent [authGuard(PRODUCER)]
/panel/admin          → AdminDashboardComponent  [authGuard(ADMIN)]
```

SSR render modes: `RenderMode.Prerender` for public routes; `RenderMode.Server` for panels and auth.

### Authentication

`AuthService` (in `core/auth/services/`) manages session via signals. Mock users seeded in-memory:
- `buyer@wcm.co / Cafe#2025` → Role.BUYER
- `producer@wcm.co / Cafe#2025` → Role.PRODUCER
- `admin@wcm.co / Cafe#2025` → Role.ADMIN

`navigateByRole()` redirects to the correct `/panel/*` route after login.

### Data layer

All data is **in-memory mock** (no real API). Services use `signal<T[]>` for state. `ProductService` seeds 12 products; `CartService`, `FavoritesService`, `OrderService` are in-memory. `ReviewService` seeds reviews per product.

### TypeScript

`tsconfig.json` enforces `strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, and `strictTemplates`. All new code must satisfy these. Run `npx tsc --noEmit` to verify.

### Accessibility

- WCAG 2.1 AA: `focus-visible` 3 px outline, skip-link, `aria-live` on toasts, focus trap in modals.
- Breakpoints: 380 / 500 / 768 / 900 / 1024 / 1280 px (see `_responsive.scss` mixins).
- See `src/styles/_accessibility.scss` for global rules.

### ADRs

Architecture Decision Records are in `md/ADR/`:
- ADR-001: Standalone Components (no NgModules)
- ADR-002: Signals for state management
- ADR-003: In-memory mock data
- ADR-004: Smart/Dumb component pattern + attribute selectors
