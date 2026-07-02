# ADR-002 — Signals como Sistema Reactivo Principal (sin NgRx/Akita)

**Estado:** Aceptado  
**Fecha:** 2026-04-20  
**Autores:** Equipo de Desarrollo — World Coffee Marketplace (UNAB)

---

## Contexto

El manejo de estado en aplicaciones Angular ha evolucionado significativamente. Las opciones disponibles al iniciar el proyecto incluían:

1. **NgRx** — Redux-like, máxima previsibilidad, alta complejidad y boilerplate.
2. **Akita / Elf** — Alternativas a NgRx con menos boilerplate pero aún externas.
3. **BehaviorSubject (RxJS)** — Patrón establecido pero verboso.
4. **Signals de Angular** — Primitiva reactiva nativa introducida como estable en Angular 17.

El proyecto World Coffee Marketplace es una aplicación de demostración académica de complejidad media-alta, con múltiples features independientes (catálogo, comprador, productor, admin) y servicios singleton compartidos.

---

## Decisión

**Se utiliza el sistema de Signals nativo de Angular como mecanismo de estado primario**, tanto en componentes como en servicios. RxJS se reserva exclusivamente para casos donde es necesario (HTTP, streams de eventos complejos, `toSignal()` para integrar observables con el sistema reactivo).

```typescript
// Servicio de estado con Signals
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<ICartItem[]>([]);

  readonly items    = this._items.asReadonly();
  readonly count    = computed(() => this._items().reduce((s, i) => s + i.qty, 0));
  readonly subtotal = computed(() => this._items().reduce((s, i) => s + i.price * i.qty, 0));

  add(item: ICartItem): void { /* ... */ }
  remove(id: string): void   { /* ... */ }
}
```

---

## Justificación

| Criterio | NgRx | BehaviorSubject | Signals |
|----------|------|-----------------|---------|
| Curva de aprendizaje | ❌ Alta | ⚠️ Media | ✅ Baja |
| Boilerplate | ❌ Muy alto (actions, reducers, effects, selectors) | ⚠️ Medio | ✅ Mínimo |
| Integración Angular | ⚠️ Externa | ✅ Nativa | ✅ Nativa |
| Change Detection | ⚠️ Requiere configuración | ⚠️ Zone-based | ✅ Fine-grained (OnPush) |
| Debug DevTools | ✅ Excelente | ⚠️ Básico | ⚠️ En desarrollo |
| Adecuación al proyecto | ⚠️ Sobre-ingeniería | ⚠️ Verboso | ✅ Proporcional |

---

## Patrón implementado

### Servicios de estado (Smart)
- Señales privadas mutables (`signal<T>()`)
- Señales públicas computadas (`computed()`)
- Métodos de acción nombrados semánticamente (`add()`, `remove()`, `update()`)

### Componentes inteligentes (Pages)
- Inyectan servicios via `inject()`
- Exponen señales calculadas al template
- Gestionan estado local con `signal()`

### Componentes presentacionales (Dumb)
- Reciben datos via `input()` (signal-based)
- Emiten eventos via `output()`
- Sin lógica de negocio

---

## Consecuencias

**Positivas:**
- Estado predecible sin necesidad de herramientas externas.
- Compatible con `ChangeDetectionStrategy.OnPush` de forma natural.
- `computed()` reemplaza selectores de NgRx con sintaxis funcional simple.
- `effect()` reemplaza suscripciones para sincronización de efectos secundarios.

**Negativas / Riesgos:**
- Sin DevTools específicas maduras (en diciembre 2025, Angular Signals DevTools está en experimental).
- Para aplicaciones muy grandes (>50 features), NgRx sigue siendo superior en trazabilidad.
- `effect()` puede introducir loops infinitos si no se diseña con cuidado.

---

## Alternativas consideradas

1. **NgRx**: Descartado por sobre-ingeniería relativa al tamaño del proyecto académico.
2. **BehaviorSubject**: Descartado por verbosidad frente a Signals.
3. **Signals + NgRx Signal Store**: Considerado para futuras versiones si el proyecto escala.

---

## Referencias

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Angular Blog: Signals are stable](https://blog.angular.dev/signals-are-now-stable-2c50c4b81aab)
