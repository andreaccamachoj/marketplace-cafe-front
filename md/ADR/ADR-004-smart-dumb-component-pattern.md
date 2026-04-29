# ADR-004 — Patrón Smart/Dumb Components con inject() y signal inputs

**Estado:** Aceptado  
**Fecha:** 2026-04-20  
**Autores:** Equipo de Desarrollo — World Coffee Marketplace (UNAB)

---

## Contexto

La arquitectura de componentes en Angular ha evolucionado hacia un modelo más funcional. Dos decisiones clave se tomaron en paralelo:

1. **Cómo separar responsabilidades** entre componentes que acceden a servicios y componentes puramente presentacionales.
2. **Cómo declarar inputs/outputs** en los componentes: decoradores `@Input()`/`@Output()` (legado) vs funciones `input()`/`output()` basadas en Signals (moderno).

---

## Decisión

### 1. Patrón Smart / Dumb (Container / Presenter)

**Smart Components (Pages/Containers):**
- Son páginas cargadas por el router (`loadComponent`)
- Inyectan servicios via `inject()`
- Contienen lógica de negocio
- Pasan datos hacia abajo via `input()` y reaccionan a eventos via `output()`
- Ubicación: `features/*/pages/`

**Dumb Components (Presenters):**
- No inyectan servicios de dominio
- Reciben todos los datos que necesitan via `input()`
- Comunican eventos hacia arriba via `output()`
- Son stateless o tienen estado UI local (ej: `isOpen = signal(false)`)
- Ubicación: `features/*/components/` y `shared/ui/`

```typescript
// ✅ Smart (Page)
export class BuyerDashboardComponent {
  private readonly cartSvc = inject(CartService);
  readonly cartItems = this.cartSvc.items;

  onRemoveItem(id: string): void {
    this.cartSvc.remove(id);
  }
}

// ✅ Dumb (Component)
export class CartItemRowComponent {
  readonly item    = input.required<ICartItem>();
  readonly remove  = output<string>();
  readonly qtyChange = output<{ id: string; qty: number }>();

  protected onRemove(): void { this.remove.emit(this.item().id); }
}
```

### 2. Signal-based inputs y outputs (Angular 17+)

Se utilizan las funciones `input()` / `input.required<T>()` y `output<T>()` en lugar de los decoradores `@Input()` / `@Output()`.

```typescript
// ❌ Legado (no se usa en componentes nuevos)
@Input() product!: IProduct;
@Output() addToCart = new EventEmitter<IProduct>();

// ✅ Moderno (signal-based)
readonly product  = input.required<IProduct>();
readonly addToCart = output<IProduct>();
```

---

## Justificación

### Por el patrón Smart/Dumb

| Criterio | Todo en páginas | Smart/Dumb |
|----------|----------------|------------|
| Testabilidad | ❌ Difícil (muchas dependencias) | ✅ Dumb components son pure functions |
| Reutilización | ❌ Baja | ✅ Alta (dumb son reutilizables) |
| Razonamiento | ❌ Mezcla lógica y presentación | ✅ Separación clara |
| Mantenimiento | ❌ Componentes monolíticos | ✅ Componentes pequeños y enfocados |

### Por signal inputs/outputs

| Criterio | `@Input()` / `@Output()` | `input()` / `output()` |
|----------|--------------------------|------------------------|
| Tipo de retorno | `T \| undefined` (requiere `!`) | `Signal<T>` (type-safe) |
| Reactividad | Solo con zone.js | Fine-grained (OnPush nativo) |
| Computed sobre inputs | ❌ Requiere `ngOnChanges` | ✅ `computed(() => myInput())` |
| `required` inputs | ⚠️ No hay garantía en runtime | ✅ `input.required<T>()` |
| Modernidad | Legado | Recomendado en Angular 17+ |

---

## Convenciones adoptadas

### Estructura de carpetas por feature

```
features/buyer/
├── pages/
│   └── dashboard/
│       └── buyer-dashboard.component.ts  ← SMART
├── components/
│   ├── cart-item-row/                    ← DUMB
│   ├── order-card/                       ← DUMB
│   └── review-card/                      ← DUMB
├── services/                             ← Estado y lógica de negocio
└── models/                               ← Interfaces TypeScript
```

### Reglas de dependencia

```
Pages    → Services (inject)
Pages    → Components (input/output)
Components → NO Services de dominio
Components → Shared UI components (import directo)
Services → NO Components
```

### Convención de selector para filas de tabla

Para mantener HTML semántico válido en `<table>`, las filas usan selector de atributo:

```typescript
@Component({
  selector: '[app-cart-item-row]',  // ← Atributo, no elemento
  ...
})
```

```html
<tr app-cart-item-row [item]="item" (remove)="onRemove($event)"></tr>
```

---

## Change Detection

Todos los componentes usan `ChangeDetectionStrategy.OnPush`:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})
```

Con Signals y `OnPush`, Angular detecta cambios únicamente cuando una señal usada en el template cambia su valor. Esto elimina ciclos de detección innecesarios y mejora significativamente el rendimiento.

---

## Consecuencias

**Positivas:**
- Componentes pequeños, enfocados y altamente reutilizables.
- Los dumb components son trivialmente testeables sin TestBed complejo.
- La API de componentes es explícita y auto-documentada.
- Compatibilidad total con Zoneless Angular (preparado para el futuro).

**Negativas:**
- Requiere más archivos (pero más pequeños y cohesivos).
- Propagación de eventos hacia arriba puede requerir múltiples `output()` en cadenas largas.
- Desarrolladores junior pueden resistirse al "prop drilling".

---

## Deuda técnica conocida (DT-17)

Los componentes creados en fases tempranas del proyecto (`catalog/components/`, algunos en `auth/`) aún usan `@Input()`/`@Output()`. La migración está planificada para **Fase 11 — Validación Final**.

---

## Referencias

- [Angular Signal Inputs](https://angular.dev/guide/signals/inputs)
- [Angular Signal Outputs](https://angular.dev/guide/signals/outputs)
- [Container/Presenter pattern — Dan Abramov (React, pero principio universal)](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
