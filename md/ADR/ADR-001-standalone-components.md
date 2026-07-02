# ADR-001 — Uso de Standalone Components sin NgModules

**Estado:** Aceptado  
**Fecha:** 2026-04-20  
**Autores:** Equipo de Desarrollo — World Coffee Marketplace (UNAB)

---

## Contexto

Angular históricamente ha requerido el uso de `NgModule` para declarar, importar y exportar componentes, directivas y pipes. Esta arquitectura introduce una capa de indirección que dificulta el razonamiento sobre las dependencias de cada componente individual.

A partir de Angular 14, los Standalone Components se introdujeron como característica estable, y en Angular 19 (versión utilizada en este proyecto) constituyen el enfoque recomendado.

---

## Decisión

**Todos los componentes, directivas y pipes del proyecto utilizan `standalone: true`** y declaran sus dependencias directamente en el array `imports` del decorador `@Component`. No se crean `NgModules` en ninguna parte del proyecto.

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterLink, SharedButtonComponent],
  template: `...`,
})
export class ExampleComponent {}
```

---

## Justificación

| Criterio | NgModules | Standalone |
|----------|-----------|------------|
| Claridad de dependencias | ❌ Indirecta (a través del módulo) | ✅ Explícita en el componente |
| Tree-shaking | ⚠️ Agrupado por módulo | ✅ Por componente |
| Lazy loading | ⚠️ Requiere módulo envolvente | ✅ Directo con `loadComponent` |
| Boilerplate | ❌ Alto (módulo adicional) | ✅ Mínimo |
| Reusabilidad | ⚠️ Acoplado al módulo | ✅ Directamente importable |
| Alineación con Angular moderno | ❌ Legado | ✅ Recomendado en v17+ |

---

## Consecuencias

**Positivas:**
- El árbol de dependencias de cada componente es auto-documentado.
- El lazy loading de features se simplifica: `loadComponent()` y `loadChildren()` con arrays de rutas directos.
- Se elimina la sobrecarga cognitiva de rastrear qué módulo exporta qué.
- Mejor alineación con la dirección de la plataforma Angular.

**Negativas / Riesgos:**
- Los desarrolladores con experiencia exclusiva en NgModules deben aprender el nuevo paradigma.
- Algunos paquetes de terceros más antiguos aún requieren importación desde módulos compatibles.

---

## Alternativas consideradas

1. **Mantener NgModules**: Descartado por ser el enfoque legado y aumentar el boilerplate sin beneficios claros.
2. **Híbrido (algunos módulos)**: Descartado para mantener coherencia arquitectónica en el proyecto.

---

## Referencias

- [Angular Standalone Components Guide](https://angular.dev/guide/components/importing)
- [RFC: Standalone APIs](https://github.com/angular/angular/discussions/45554)
