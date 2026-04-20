# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (ng serve)
npm run build      # Production build
npm run watch      # Watch mode build (development)
npm test           # Run unit tests with Karma/Jasmine
npm run lint       # ESLint
npm run serve:ssr:marketplace-cafe-front  # Run SSR server after build
```

To run a single test file: `npx ng test --include='**/path/to/file.spec.ts'`

## Architecture

**Angular 19** standalone app with **SSR enabled** (Express). No NgModules — all components use `standalone: true`.

### Structure

- `src/app/features/` — feature modules (lazy-loaded). Currently: `product-management/` and `login/` (stub).
- `src/app/shared/` — reusable components (`modal/`) and utilities (`directives/`, `validators/`).
- `src/app/core/` — intended for singleton services (currently empty).

### Routing

Defined in [app.routes.ts](src/app/app.routes.ts) — all routes redirect to `/productos`, which lazy-loads `ProductDashboardComponent`. SSR routing is in [app.routes.server.ts](src/app/app.routes.server.ts).

### Feature: Product Management

`ProductDashboardComponent` (container) opens a modal with `ProductFormComponent` (dumb component). The form uses Angular Reactive Forms with strict validation. Models are in `features/product-management/models/product.model.ts` (`ProductPayload`, `ProductStatus`, `ProductUnit`, `Certification`).

API integration is **not yet implemented** — `handleSaveProduct()` in the dashboard logs to console as a placeholder.

### Authentication

The `login/` feature directory exists but is empty — auth is not yet implemented.

### TypeScript

`tsconfig.json` enforces `strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, and `strictTemplates`. All new code must satisfy these.
