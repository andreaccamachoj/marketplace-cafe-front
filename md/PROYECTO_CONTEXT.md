# World Coffee Marketplace — Contexto Completo del Proyecto

> **Documento generado para sesión de Claude Code**  
> Maestría en Gestión, Aplicación y Desarrollo de Software — UNAB  
> Última actualización: Junio 2025

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Identidad de Marca y Paleta de Colores](#2-identidad-de-marca-y-paleta-de-colores)
3. [Roles y Actores del Sistema](#3-roles-y-actores-del-sistema)
4. [Requerimientos Funcionales](#4-requerimientos-funcionales)
5. [Requerimientos No Funcionales](#5-requerimientos-no-funcionales)
6. [Historias de Usuario](#6-historias-de-usuario)
7. [Esquema de Base de Datos](#7-esquema-de-base-de-datos)
8. [Pantallas Diseñadas](#8-pantallas-diseñadas)
9. [Arquitectura Angular — Estructura de Carpetas](#9-arquitectura-angular--estructura-de-carpetas)
10. [Stack Tecnológico Recomendado](#10-stack-tecnológico-recomendado)
11. [Decisiones Arquitectónicas Clave (ADRs)](#11-decisiones-arquitectónicas-clave-adrs)
12. [Principios de Diseño UX/UI Aplicados](#12-principios-de-diseño-uxui-aplicados)
13. [Convenciones y Reglas del Proyecto](#13-convenciones-y-reglas-del-proyecto)
14. [Archivos Generados](#14-archivos-generados)

---

## 1. Visión General del Proyecto

**World Coffee Marketplace** es una plataforma web de comercio electrónico B2C/B2B que conecta **productores de café sostenible colombiano** con **compradores** nacionales e internacionales. El proyecto hace énfasis en trazabilidad de origen, certificaciones de sostenibilidad (Orgánico, Fairtrade, Rainforest Alliance) y comercio justo.

### Contexto Académico
- **Institución:** Universidad Autónoma de Bucaramanga (UNAB)
- **Programa:** Maestría en Gestión, Aplicación y Desarrollo de Software
- **Propósito:** Investigación sobre el rol de la IA en decisiones arquitectónicas de software (SDLC). Incluye **Registros de Decisión Arquitectónica (ADR)** y **Registros de Prompts (RP)** para trazabilidad de decisiones asistidas por IA.

### Características Diferenciadoras
- Marketplace de **café especial de origen** con trazabilidad completa (finca → taza)
- Verificación y aprobación de productores por administradores
- Sistema de certificaciones de sostenibilidad en productos
- Panel diferenciado por rol: Comprador / Productor / Administrador
- Calificaciones y reseñas solo para compradores verificados

---

## 2. Identidad de Marca y Paleta de Colores

### Logo
**World Coffee Marketplace** — copa de café fusionada con globo terráqueo. Tipografía tipo Slab serif en marrón oscuro.

### Paleta Oficial (extraída pixel a pixel del logo)

```css
:root {
  /* ── Paleta principal ── */
  --espresso:      #372617;   /* Marrón espresso — primario, texto, nav, botones */
  --cafe-oscuro:   #3E2919;   /* Marrón oscuro — hover de botones primarios */
  --cafe-medio:    #7A5C42;   /* Marrón medio — texto secundario, bordes, iconos */
  --cafe-claro:    #A8866A;   /* Marrón claro — acentos de productor, metadata */
  --crema:         #CDC4B5;   /* Crema — fondos secundarios, bordes suaves */
  --marfil:        #E4DCD1;   /* Marfil — fondos principales, cards */
  --marfil-light:  #EDE6DD;   /* Marfil claro — fondos de paneles */
  --blanco:        #F7F3EF;   /* Blanco cálido — fondo de página */

  /* ── Colores de acción ── */
  --verde-selva:   #1E5E29;   /* Verde selva — éxito, aprobado, CTA secundario */
  --verde-fresco:  #4A8C56;   /* Verde fresco — hover verde, chips activos */
  --verde-light:   #D4EAD7;   /* Verde claro — fondos de badges orgánico */

  /* ── Semánticos ── */
  --amber:         #C07820;   /* Ámbar — advertencias, Fairtrade, pendiente */
  --amber-light:   #FFF0D0;   /* Ámbar claro — fondo badges Fairtrade */
  --blue-info:     #1A6B8A;   /* Azul — Rainforest, info, comprador */
  --blue-light:    #E0F2F8;   /* Azul claro — fondos badges Rainforest */
  --purple:        #5B3E8F;   /* Púrpura — administrador */
  --purple-light:  #EDE8F8;   /* Púrpura claro — fondo admin */
  --error:         #8B2020;   /* Rojo oscuro — errores, rechazos */
  --error-light:   #FDEAEA;   /* Rojo claro — fondo errores */
}
```

### Tipografías

| Fuente | Uso | Google Fonts |
|--------|-----|--------------|
| `Playfair Display` | Títulos, precios, nombres de productos | Display serif |
| `Mulish` | Cuerpo, etiquetas, botones, metadata | Sans-serif cuerpo |

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Mulish:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Sistema de Espaciado
Base 8px. Variables: `--sp-1: 4px` hasta `--sp-16: 64px`.

### Radios de Borde
- `--r-sm: 6px` — inputs pequeños, badges
- `--r-md: 10px` — inputs, botones, chips
- `--r-lg: 16px` — cards
- `--r-xl: 24px` — modales, secciones grandes

---

## 3. Roles y Actores del Sistema

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Comprador** (`buyer`) | Usuario final que compra café | Catálogo, carrito, pedidos, reseñas |
| **Productor** (`producer`) | Caficultor que vende su café | Gestión de productos, finca, pedidos recibidos |
| **Administrador** (`admin`) | Equipo interno WCMP | Aprobación productores, categorías, usuarios |
| **Público** | Sin autenticación | Catálogo (solo lectura) |

### Flujo de Aprobación de Productor
```
Registro → pending → Revisión admin → approved | rejected
          ↓
   Solo approved puede publicar productos
```

---

## 4. Requerimientos Funcionales

| ID | Descripción | HU Relacionada |
|----|-------------|----------------|
| RF-01 | Crear cuenta personal | HU-01 |
| RF-02 | Iniciar sesión | HU-02 |
| RF-03 | Recuperar contraseña | HU-03 |
| RF-04 | Actualizar perfil | HU-04 |
| RF-05 | Verificar identidad del productor | HU-05 |
| RF-06 | Gestionar permisos por rol (RBAC) | HU-06 |
| RF-07 | Registrar información de finca | HU-07 |
| RF-08 | Actualizar información de finca | HU-07 |
| RF-09 | Crear producto | HU-08 |
| RF-10 | Actualizar producto | HU-09 |
| RF-11 | Eliminar producto | HU-10 |
| RF-12 | Inactivar producto | HU-11 |
| RF-13 | Registrar stock | HU-12 |
| RF-14 | Actualizar cantidad disponible | HU-12 |
| RF-15 | Publicar producto | HU-13 |
| RF-16 | Ver detalle de producto | HU-14 |
| RF-17 | Visualizar catálogo | HU-15 |
| RF-18 | Filtrar catálogo | HU-16 |
| RF-19 | Agregar producto al carrito | HU-17 |
| RF-20 | Registrar información de envío | HU-18 |
| RF-21 | Registrar información de pago | HU-19 |
| RF-22 | Confirmar compra | HU-20 |
| RF-23 | Listar pedidos realizados | HU-21 |
| RF-24 | Ver detalle del pedido | HU-22 |
| RF-25 | Cancelar pedido | HU-23 |
| RF-26 | Buscar producto por nombre/keyword | HU-24 |
| RF-27 | Cargar imágenes del producto | HU-25 |
| RF-28 | Registrar certificaciones de sostenibilidad | HU-26 |
| RF-29 | Ver pedidos recibidos (productor) | HU-27 |
| RF-30 | Actualizar estado del pedido (productor) | HU-28 |
| RF-31 | Crear reseña de producto comprado | HU-29 |
| RF-32 | Gestionar categorías (admin) | HU-30 |
| RF-33 | Gestionar ítems del carrito | HU-31 |
| RF-34 | Cerrar sesión | HU-32 |
| RF-35 | Enviar notificaciones de pedido | HU-20, HU-22 |
| RF-36 | Aprobar/rechazar perfil de productor | HU-33 |

---

## 5. Requerimientos No Funcionales

### Seguridad
| ID | Requisito | Métrica |
|----|-----------|---------|
| RNF-SEC-01 | JWT con expiración ≤ 60 min | 99.9% autenticaciones sin error |
| RNF-SEC-02 | Contraseñas con bcrypt/Argon2 ≥ 10 rounds | 100% cifradas, 0 texto plano |
| RNF-SEC-03 | RBAC — 100% endpoints protegidos | 0 accesos no autorizados |
| RNF-SEC-04 | No almacenar PAN/CVV (PCI DSS) | 0 campos sensibles en BD |
| RNF-SEC-05 | HTTPS TLS 1.2+ | 100% tráfico cifrado |
| RNF-SEC-06 | Validar firma digital de pasarela | 100% respuestas verificadas |
| RNF-SEC-07 | Datos sensibles cifrados AES-256 | 0 datos sin cifrado |
| RNF-SEC-08 | Mitigar OWASP Top 10 | 0 vulnerabilidades críticas |

### Disponibilidad y Rendimiento
| ID | Requisito | SLA |
|----|-----------|-----|
| RNF-DISP-01 | Uptime mensual | ≥ 99.5% |
| RNF-DISP-02 | Auto-scaling en nube | Escalado < 2 min |
| RNF-DISP-03 | Replicación BD activa | RPO ≤ 5 min |
| RNF-DISP-04 | Backups diarios automáticos | RTO ≤ 30 min |
| RNF-REN-01 | Catálogo responde < 2s | 95% peticiones < 2s |
| RNF-REN-02 | Confirmación de compra < 5s | 95% transacciones < 5s |
| RNF-REN-03 | Soportar 500 usuarios concurrentes | 95% sin degradación |

### Auditoría, Usabilidad y Privacidad
| ID | Requisito |
|----|-----------|
| RNF-AUD-01 | Logs de transacciones, retención ≥ 12 meses |
| RNF-AUD-02 | ID único por transacción (0 duplicidad) |
| RNF-USA-01 | Diseño responsivo: 375px, 768px, 1280px |
| RNF-USA-02 | Compatible Chrome, Firefox, Edge |
| RNF-PRI-01 | Consentimiento explícito en registro |
| RNF-PRI-02 | Derecho de supresión (eliminación en ≤ 72h) |

---

## 6. Historias de Usuario

| ID | Historia | Criterios clave |
|----|----------|-----------------|
| HU-01 | Como usuario quiero crear cuenta | Validar campos, error si correo duplicado |
| HU-02 | Como usuario quiero iniciar sesión | Credenciales válidas / error descriptivo |
| HU-03 | Como usuario quiero recuperar contraseña | Enlace al correo, informar si no existe |
| HU-04 | Como usuario quiero actualizar perfil | Guardar cambios válidos |
| HU-05 | Como productor quiero verificar identidad | Cargar documentos, registrar solicitud |
| HU-06 | Como admin quiero gestionar permisos | Aplicar restricciones por rol |
| HU-07 | Como productor quiero registrar finca | Datos geográficos y financieros |
| HU-08 | Como productor quiero crear producto | Nombre, precio, stock. No visible hasta publicación |
| HU-09 | Como productor quiero actualizar producto | Solo el propietario puede modificar |
| HU-10 | Como productor quiero eliminar producto | Confirmar. No mostrar en catálogo |
| HU-11 | Como productor quiero inactivar producto | No aparecer en búsquedas. Permitir reactivación |
| HU-12 | Como productor quiero gestionar stock | No negativo. Mostrar no disponible en 0 |
| HU-13 | Como productor verificado quiero publicar | Solo aprobados pueden publicar |
| HU-14 | Como comprador quiero ver detalle | Nombre, descripción, precio, stock, reseñas |
| HU-15 | Como comprador quiero ver catálogo | Listar productos activos |
| HU-16 | Como comprador quiero filtrar catálogo | Por precio, categoría, combinados |
| HU-17 | Como comprador quiero agregar al carrito | No superar stock. Actualizar total |
| HU-18 | Como comprador quiero dirección de envío | Múltiples direcciones, obligatorios |
| HU-19 | Como comprador quiero info de pago | No almacenar datos sensibles sin cifrado |
| HU-20 | Como comprador quiero confirmar compra | Generar número de pedido, descontar stock |
| HU-21 | Como comprador quiero ver mis pedidos | Ordenados por fecha, solo del usuario autenticado |
| HU-22 | Como comprador quiero detalle del pedido | Productos y estado |
| HU-23 | Como comprador quiero cancelar pedido | Solo si no ha sido enviado. Restaurar stock |
| HU-24 | Como comprador quiero buscar productos | Resultados en < 2s, mensaje sin resultados |
| HU-25 | Como productor quiero cargar imágenes | ≥ 3 imágenes, JPG/PNG ≤ 5MB, previsualizar |
| HU-26 | Como productor quiero registrar certificaciones | Listado predefinido, adjuntar documento |
| HU-27 | Como productor quiero ver pedidos recibidos | Solo los míos, con datos del comprador |
| HU-28 | Como productor quiero actualizar estado pedido | Flujo unidireccional: preparando→enviado→entregado |
| HU-29 | Como comprador quiero dejar reseña | Solo compradores verificados, 1 por producto |
| HU-30 | Como admin quiero gestionar categorías | CRUD. No eliminar con productos activos |
| HU-31 | Como comprador quiero gestionar carrito | Eliminar ítem, cambiar cantidad, actualizar total |
| HU-32 | Como usuario quiero cerrar sesión | Invalidar JWT, redirigir al login |
| HU-33 | Como admin quiero aprobar/rechazar productor | Lista pendientes, revisar docs, aprobar/rechazar |

---

## 7. Esquema de Base de Datos

> **Motor recomendado:** PostgreSQL 16 con RDS en AWS  
> **Total de tablas:** 24  
> **ORM recomendado:** Sequelize (Node.js) o Prisma

---

### MÓDULO 1: USUARIOS E IDENTIDAD

#### `users`
Entidad central del sistema. Todos los usuarios independientemente de su rol.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Correo — identificador de login |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt/Argon2 ≥10 rounds |
| full_name | VARCHAR(150) | NOT NULL | Nombre completo |
| phone | VARCHAR(20) | NULL | Teléfono de contacto |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active / suspended / deleted |
| privacy_consent | BOOLEAN | NOT NULL, DEFAULT FALSE | Consentimiento de privacidad |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | NOT NULL | Última modificación |

**HU:** HU-01, HU-02, HU-03, HU-04, HU-32

---

#### `roles`
Catálogo de roles disponibles para RBAC.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | SERIAL | PK | Identificador numérico |
| name | VARCHAR(50) | NOT NULL, UNIQUE | buyer / producer / admin |
| description | VARCHAR(255) | NULL | Descripción del rol |

**HU:** HU-06, HU-33

---

#### `user_roles`
Tabla pivote muchos-a-muchos entre usuarios y roles.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| user_id | UUID | PK, FK → users.id | Referencia al usuario |
| role_id | INTEGER | PK, FK → roles.id | Referencia al rol |
| assigned_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de asignación |

**HU:** HU-06, HU-13

---

#### `producer_profiles`
Extiende al usuario cuando tiene rol de productor. Contiene el estado de aprobación.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del perfil |
| user_id | UUID | NOT NULL, UNIQUE, FK → users.id | Relación 1:1 con users |
| bio | TEXT | NULL | Descripción del productor |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | pending / approved / rejected |
| rejection_reason | TEXT | NULL | Motivo de rechazo |
| approved_by | UUID | NULL, FK → users.id | Admin que aprobó/rechazó |
| approved_at | TIMESTAMP | NULL | Fecha de la decisión |

**HU:** HU-05, HU-13, HU-33

---

#### `verification_documents`
Documentos cargados por el productor para verificación de identidad.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del documento |
| producer_id | UUID | NOT NULL, FK → producer_profiles.id | Productor propietario |
| document_type | VARCHAR(80) | NOT NULL | cedula / rut / camara_comercio |
| file_url | VARCHAR(500) | NOT NULL | URL en servicio de storage |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | pending / approved / rejected |
| uploaded_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de carga |

**HU:** HU-05

---

#### `password_reset_tokens`
Gestiona los tokens de recuperación de contraseña de forma segura.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del token |
| user_id | UUID | NOT NULL, FK → users.id | Usuario solicitante |
| token_hash | VARCHAR(255) | NOT NULL | Hash del token (nunca texto plano) |
| expires_at | TIMESTAMP | NOT NULL | Expiración del token |
| used_at | TIMESTAMP | NULL | NULL si no ha sido usado |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |

**HU:** HU-03

---

#### `privacy_consents`
Historial de consentimientos de privacidad para cumplimiento regulatorio.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del registro |
| user_id | UUID | NOT NULL, FK → users.id | Usuario que acepta |
| policy_version | VARCHAR(20) | NOT NULL | Versión de la política (ej. v1.2) |
| accepted_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de aceptación |
| ip_address | VARCHAR(45) | NOT NULL | IP de origen |

**HU:** RNF-PRI-01, RNF-PRI-02

---

### MÓDULO 2: FINCA Y CATÁLOGO

#### `farms`
Información geográfica y física de la finca del productor.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador de la finca |
| producer_id | UUID | NOT NULL, FK → producer_profiles.id | Productor propietario |
| name | VARCHAR(150) | NOT NULL | Nombre de la finca |
| municipality | VARCHAR(100) | NOT NULL | Municipio |
| department | VARCHAR(100) | NOT NULL | Departamento |
| altitude_masl | DECIMAL(7,2) | NULL | Altitud en msnm |
| area_hectares | DECIMAL(8,2) | NULL | Extensión en hectáreas |
| description | TEXT | NULL | Descripción libre |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de registro |

**HU:** HU-07, RF-07, RF-08

---

#### `categories`
Catálogo jerárquico de categorías de productos. Soporta subcategorías.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | SERIAL | PK | Identificador numérico |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Nombre de la categoría |
| parent_id | INTEGER | NULL, FK → categories.id | Categoría padre (NULL = raíz) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado activo |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |

> **Regla de negocio:** No se puede eliminar una categoría con productos activos asociados (HU-30).

**HU:** HU-16, HU-30, RF-32

---

#### `products`
Entidad principal del catálogo. Gestiona el ciclo de vida completo del producto.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del producto |
| producer_id | UUID | NOT NULL, FK → producer_profiles.id | Productor propietario |
| category_id | INTEGER | NOT NULL, FK → categories.id | Categoría asignada |
| name | VARCHAR(200) | NOT NULL | Nombre del producto |
| description | TEXT | NULL | Descripción detallada |
| price | DECIMAL(12,2) | NOT NULL, CHECK (price >= 0) | Precio unitario |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | draft / active / inactive / deleted |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | NOT NULL | Última actualización |

> **Estados del producto:** `draft` → producto no visible. `active` → visible en catálogo. `inactive` → oculto temporalmente. `deleted` → eliminado lógicamente.

**HU:** HU-08, HU-09, HU-10, HU-11, HU-13, HU-14, HU-15, HU-16, HU-24

---

#### `product_images`
Imágenes asociadas a cada producto con orden de visualización.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador de la imagen |
| product_id | UUID | NOT NULL, FK → products.id | Producto asociado |
| image_url | VARCHAR(500) | NOT NULL | URL en almacenamiento |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | Orden en la galería |
| uploaded_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de carga |

**HU:** HU-25, RF-27

---

#### `certifications`
Catálogo predefinido de certificaciones de sostenibilidad.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | SERIAL | PK | Identificador numérico |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Nombre (Orgánico, Fairtrade, Rainforest) |
| issuing_body | VARCHAR(150) | NULL | Organismo certificador |
| description | TEXT | NULL | Descripción de la certificación |

**HU:** HU-26, RF-28

---

#### `product_certifications`
Tabla pivote entre productos y sus certificaciones. Incluye documento de respaldo.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del registro |
| product_id | UUID | NOT NULL, FK → products.id | Producto certificado |
| certification_id | INTEGER | NOT NULL, FK → certifications.id | Certificación aplicada |
| document_url | VARCHAR(500) | NULL | URL del documento de respaldo |
| issued_at | DATE | NULL | Fecha de emisión |

**HU:** HU-26, RF-28

---

#### `inventory`
Controla el stock de cada producto. Tabla separada de `products` para concurrencia.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del inventario |
| product_id | UUID | NOT NULL, UNIQUE, FK → products.id | Relación 1:1 con product |
| quantity | INTEGER | NOT NULL, DEFAULT 0, CHECK (quantity >= 0) | Cantidad disponible |
| updated_at | TIMESTAMP | NOT NULL | Última actualización |

> **Decisión:** Tabla separada de `products` para permitir actualizaciones frecuentes de stock sin bloquear el registro del producto, soportando los 500 usuarios concurrentes (RNF-REN-03).

**HU:** HU-12, HU-17, HU-20, HU-23

---

### MÓDULO 3: CARRITO Y DIRECCIÓN

#### `addresses`
Direcciones de envío registradas por los compradores.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador de la dirección |
| user_id | UUID | NOT NULL, FK → users.id | Usuario propietario |
| label | VARCHAR(80) | NULL | Etiqueta (Casa, Oficina) |
| street | VARCHAR(255) | NOT NULL | Dirección detallada |
| city | VARCHAR(100) | NOT NULL | Ciudad |
| department | VARCHAR(100) | NOT NULL | Departamento |
| postal_code | VARCHAR(20) | NULL | Código postal |
| is_default | BOOLEAN | NOT NULL, DEFAULT FALSE | Dirección predeterminada |

**HU:** HU-18, RF-20

---

#### `carts`
Carrito activo de un usuario. Máximo uno activo por usuario.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del carrito |
| user_id | UUID | NOT NULL, UNIQUE, FK → users.id | Un carrito por usuario |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | NOT NULL | Última modificación |

**HU:** HU-17, HU-31

---

#### `cart_items`
Ítems dentro del carrito. Precio congelado al momento de agregar.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del ítem |
| cart_id | UUID | NOT NULL, FK → carts.id | Carrito contenedor |
| product_id | UUID | NOT NULL, FK → products.id | Producto agregado |
| quantity | INTEGER | NOT NULL, CHECK (quantity >= 1) | Cantidad mínima: 1 |
| unit_price | DECIMAL(12,2) | NOT NULL | Precio al momento de agregar |
| added_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de adición |

**HU:** HU-17, HU-31

---

### MÓDULO 4: PEDIDOS

#### `orders`
Registro de cada pedido confirmado. Número de pedido único y legible.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador interno |
| user_id | UUID | NOT NULL, FK → users.id | Comprador |
| address_id | UUID | NOT NULL, FK → addresses.id | Dirección de entrega |
| order_number | VARCHAR(30) | NOT NULL, UNIQUE | Número legible (ej. ORD-2025-00123) |
| total_amount | DECIMAL(14,2) | NOT NULL | Total al confirmar |
| status | VARCHAR(30) | NOT NULL, DEFAULT 'confirmed' | confirmed/preparing/shipped/delivered/cancelled |
| payment_status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | pending/paid/refunded/failed |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | NOT NULL | Última actualización |

**HU:** HU-20, HU-21, HU-22, HU-23, HU-27

---

#### `order_items`
Detalle de productos de cada pedido. Precio congelado en el momento de compra.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del ítem |
| order_id | UUID | NOT NULL, FK → orders.id | Pedido contenedor |
| product_id | UUID | NOT NULL, FK → products.id | Producto vendido |
| quantity | INTEGER | NOT NULL, CHECK (quantity >= 1) | Cantidad comprada |
| unit_price | DECIMAL(12,2) | NOT NULL | Precio en el momento de compra |
| subtotal | DECIMAL(14,2) | NOT NULL | quantity × unit_price |

**HU:** HU-22, HU-27

---

#### `order_status_history`
Implementa el flujo unidireccional de estados. Cada cambio genera un registro nuevo.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del registro |
| order_id | UUID | NOT NULL, FK → orders.id | Pedido afectado |
| status | VARCHAR(30) | NOT NULL | Estado registrado |
| changed_by | UUID | NOT NULL, FK → users.id | Usuario que realiza el cambio |
| changed_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora exacta |
| notes | TEXT | NULL | Notas adicionales |

> **Flujo unidireccional:** `confirmed → preparing → shipped → delivered`. No se permite retroceder (HU-28).

**HU:** HU-28, RF-30

---

### MÓDULO 5: PAGOS

#### `payments`
Registro del pago de cada pedido. No almacena PAN ni CVV (cumple PCI-DSS).

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del pago |
| order_id | UUID | NOT NULL, UNIQUE, FK → orders.id | Relación 1:1 con pedido |
| payment_method | VARCHAR(50) | NOT NULL | credit_card / pse / nequi |
| gateway_reference | VARCHAR(200) | NOT NULL | Referencia interna de la pasarela |
| gateway_signature | VARCHAR(500) | NULL | Firma digital para validar integridad |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | pending/approved/declined/refunded |
| amount | DECIMAL(14,2) | NOT NULL | Monto cobrado |
| verified_at | TIMESTAMP | NULL | Fecha de verificación de firma |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de inicio |

**HU:** HU-19, HU-20, RNF-SEC-04, RNF-SEC-06

---

### MÓDULO 6: SOCIAL

#### `reviews`
Reseñas y calificaciones. Doble referencia a `product_id` y `order_id` para verificar compra.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador de la reseña |
| product_id | UUID | NOT NULL, FK → products.id | Producto reseñado |
| user_id | UUID | NOT NULL, FK → users.id | Comprador que escribe |
| order_id | UUID | NOT NULL, FK → orders.id | Pedido que verifica la compra |
| rating | SMALLINT | NOT NULL, CHECK (rating BETWEEN 1 AND 5) | Calificación 1-5 estrellas |
| comment | TEXT | NULL | Comentario opcional |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de publicación |

**Restricción:** `UNIQUE (user_id, product_id)` — una reseña por comprador por producto.

**HU:** HU-29, RF-31

---

### MÓDULO 7: AUDITORÍA Y TRAZABILIDAD

#### `notifications`
Bandeja de notificaciones internas del sistema.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador de la notificación |
| user_id | UUID | NOT NULL, FK → users.id | Usuario destinatario |
| type | VARCHAR(50) | NOT NULL | order_confirmed / status_changed / payment_approved |
| message | TEXT | NOT NULL | Contenido legible |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE | Estado de lectura |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha de generación |

**HU:** HU-20, HU-28, RF-35

---

#### `audit_logs`
Registro de todos los eventos críticos del sistema. Retención mínima 12 meses.

| Columna | Tipo | Restricción | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | Identificador del evento |
| user_id | UUID | NULL, FK → users.id | Usuario (NULL si es acción del sistema) |
| action | VARCHAR(100) | NOT NULL | LOGIN / LOGOUT / ORDER_CREATED / STATUS_CHANGED |
| entity_type | VARCHAR(80) | NOT NULL | order / product / user / payment |
| entity_id | VARCHAR(100) | NOT NULL | ID de la entidad afectada |
| ip_address | VARCHAR(45) | NULL | IP de origen |
| metadata | JSONB | NULL | Datos adicionales en JSON |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora exacta |

**HU:** RNF-AUD-01, RNF-AUD-02

---

### Diagrama de Relaciones (resumen)

```
users ─────────────┬──── user_roles ──── roles
                   ├──── producer_profiles ──── verification_documents
                   │                        ──── farms
                   │                        ──── products ──── product_images
                   │                                      ──── product_certifications ──── certifications
                   │                                      ──── inventory
                   ├──── addresses
                   ├──── carts ──── cart_items ──── products
                   ├──── orders ──── order_items ──── products
                   │            ──── order_status_history
                   │            ──── payments
                   ├──── reviews ──── products
                   ├──── notifications
                   ├──── audit_logs
                   ├──── password_reset_tokens
                   └──── privacy_consents
```

---

## 8. Pantallas Diseñadas

Todos los archivos HTML están en `/mnt/user-data/outputs/`.

| Archivo | Pantalla | Roles |
|---------|----------|-------|
| `login_ux_marketplace_cafe.html` | Login | Todos |
| `registro_marketplace_cafe.html` | Registro multi-rol | Todos |
| `landing_marketplace_cafe.html` | Landing / Catálogo público | Público |
| `detalle_producto_cafe.html` | Detalle de producto | Público/Comprador |
| `panel_comprador_cafe.html` | Panel comprador (carrito + pedidos) | Comprador |
| `panel_productor_cafe.html` | Panel productor (productos + finca) | Productor |
| `panel_admin_cafe.html` | Panel admin (aprobaciones + categorías) | Admin |
| `erd_marketplace_cafe_sostenible.html` | Diagrama ERD interactivo | — |

### Decisiones de UX transversales a todas las pantallas
- **Tipografía:** Playfair Display (display) + Mulish (cuerpo) — coherente en todas las pantallas
- **Sistema de toasts:** Bottom-right, animación `translateX`, 3.2s de duración, 4 tipos: success/info/warning/error
- **Modales:** `aria-modal`, foco atrapado, cierre con `Escape` y clic en overlay
- **Validación:** `onblur` + `oninput` para limpiar errores. Íconos ✓/✗ en campos. Scroll al primer error
- **Skeleton loaders:** Para estados de carga de contenido
- **Empty states:** Icono grande + título + descripción para catálogos vacíos
- **Responsive breakpoints:** 380px / 500px / 768px / 900px / 1024px / 1280px

---

## 9. Arquitectura Angular — Estructura de Carpetas

### Stack Frontend
- **Framework:** Angular 17+ (Standalone components o NgModules)
- **Estado:** NgRx (Store + Effects + Selectors)
- **UI:** Componentes propios (sin Angular Material — diseño custom)
- **HTTP:** HttpClient con interceptores
- **Formularios:** Reactive Forms
- **Routing:** Lazy loading por feature module
- **Testing:** Jest + Cypress (e2e)

### Principios Aplicados
- **SOLID** completo con interfaces y tokens de inyección
- **Smart / Dumb Components** — pages son smart, components son presentacionales
- **Path aliases** en `tsconfig.json` (`@core`, `@shared`, `@features`, `@env`)

```
world-coffee-marketplace/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── core/                          ← Carga en arranque, instancia única
│   │   │   ├── auth/
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   ├── role.guard.ts
│   │   │   │   │   ├── public.guard.ts
│   │   │   │   │   └── producer-approved.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.ts
│   │   │   │   │   ├── token-refresh.interceptor.ts
│   │   │   │   │   └── unauthorized.interceptor.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── token-storage.service.ts
│   │   │   │   └── models/
│   │   │   │       ├── user.model.ts
│   │   │   │       ├── auth-response.model.ts
│   │   │   │       └── role.enum.ts
│   │   │   ├── http/
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── loading.interceptor.ts
│   │   │   │   │   ├── error-handler.interceptor.ts
│   │   │   │   │   └── base-url.interceptor.ts
│   │   │   │   └── services/
│   │   │   │       └── api.service.ts
│   │   │   ├── services/
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── loading.service.ts
│   │   │   │   ├── theme.service.ts
│   │   │   │   └── analytics.service.ts
│   │   │   ├── models/
│   │   │   │   ├── api-response.model.ts
│   │   │   │   ├── pagination.model.ts
│   │   │   │   └── error.model.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                        ← Reutilizable entre features
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── navbar/
│   │   │   │   │   ├── sidebar/
│   │   │   │   │   ├── footer/
│   │   │   │   │   ├── breadcrumb/
│   │   │   │   │   ├── page-header/
│   │   │   │   │   └── panel-layout/
│   │   │   │   └── ui/
│   │   │   │       ├── button/
│   │   │   │       ├── input/
│   │   │   │       ├── select/
│   │   │   │       ├── textarea/
│   │   │   │       ├── checkbox/
│   │   │   │       ├── toggle/
│   │   │   │       ├── badge/
│   │   │   │       ├── status-pill/
│   │   │   │       ├── rating-stars/
│   │   │   │       ├── quantity-control/
│   │   │   │       ├── stock-indicator/
│   │   │   │       ├── upload-zone/
│   │   │   │       ├── avatar/
│   │   │   │       ├── empty-state/
│   │   │   │       ├── loading-spinner/
│   │   │   │       ├── skeleton/
│   │   │   │       ├── toast/
│   │   │   │       ├── modal/
│   │   │   │       ├── confirm-dialog/
│   │   │   │       ├── tabs/
│   │   │   │       ├── filter-chips/
│   │   │   │       └── stat-card/
│   │   │   ├── directives/
│   │   │   │   ├── click-outside.directive.ts
│   │   │   │   ├── scroll-spy.directive.ts
│   │   │   │   ├── intersection-observer.directive.ts
│   │   │   │   ├── auto-focus.directive.ts
│   │   │   │   └── number-only.directive.ts
│   │   │   ├── pipes/
│   │   │   │   ├── currency-cop.pipe.ts
│   │   │   │   ├── relative-time.pipe.ts
│   │   │   │   ├── truncate.pipe.ts
│   │   │   │   ├── certification-label.pipe.ts
│   │   │   │   └── order-status.pipe.ts
│   │   │   ├── validators/
│   │   │   │   ├── email.validator.ts
│   │   │   │   ├── password.validator.ts
│   │   │   │   ├── positive-number.validator.ts
│   │   │   │   └── required-file.validator.ts
│   │   │   ├── models/
│   │   │   │   ├── certification.model.ts
│   │   │   │   ├── address.model.ts
│   │   │   │   └── notification.model.ts
│   │   │   ├── utils/
│   │   │   │   ├── form.utils.ts
│   │   │   │   ├── date.utils.ts
│   │   │   │   └── string.utils.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                      ← Lazy-loaded, un módulo por dominio
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── forgot-password/
│   │   │   │   ├── components/
│   │   │   │   │   ├── login-form/
│   │   │   │   │   ├── brand-panel/
│   │   │   │   │   └── oauth-button/
│   │   │   │   ├── auth-routing.module.ts
│   │   │   │   └── auth.module.ts
│   │   │   │
│   │   │   ├── catalog/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── home/
│   │   │   │   │   └── product-detail/
│   │   │   │   ├── components/
│   │   │   │   │   ├── hero-section/
│   │   │   │   │   ├── filters-bar/
│   │   │   │   │   ├── product-grid/
│   │   │   │   │   ├── product-card/
│   │   │   │   │   ├── product-gallery/
│   │   │   │   │   ├── product-options/
│   │   │   │   │   ├── product-cta/
│   │   │   │   │   ├── product-detail-tabs/
│   │   │   │   │   ├── flavor-notes/
│   │   │   │   │   ├── sustainability-section/
│   │   │   │   │   ├── producers-section/
│   │   │   │   │   └── product-suggestions/
│   │   │   │   ├── services/
│   │   │   │   │   ├── product.service.ts
│   │   │   │   │   ├── category.service.ts
│   │   │   │   │   └── review.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── product.model.ts
│   │   │   │   │   ├── category.model.ts
│   │   │   │   │   ├── review.model.ts
│   │   │   │   │   └── filter.model.ts
│   │   │   │   ├── resolvers/
│   │   │   │   │   └── product-detail.resolver.ts
│   │   │   │   ├── store/
│   │   │   │   │   ├── catalog.actions.ts
│   │   │   │   │   ├── catalog.reducer.ts
│   │   │   │   │   ├── catalog.effects.ts
│   │   │   │   │   └── catalog.selectors.ts
│   │   │   │   ├── catalog-routing.module.ts
│   │   │   │   └── catalog.module.ts
│   │   │   │
│   │   │   ├── buyer/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── buyer-dashboard/
│   │   │   │   │   ├── cart/
│   │   │   │   │   └── orders/
│   │   │   │   ├── components/
│   │   │   │   │   ├── cart-item/
│   │   │   │   │   ├── cart-summary/
│   │   │   │   │   ├── shipping-selector/
│   │   │   │   │   ├── coupon-input/
│   │   │   │   │   ├── order-card/
│   │   │   │   │   ├── order-stepper/
│   │   │   │   │   └── review-modal/
│   │   │   │   ├── services/
│   │   │   │   │   ├── cart.service.ts
│   │   │   │   │   ├── order.service.ts
│   │   │   │   │   └── address.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── cart.model.ts
│   │   │   │   │   ├── order.model.ts
│   │   │   │   │   └── checkout.model.ts
│   │   │   │   ├── store/
│   │   │   │   │   ├── cart/
│   │   │   │   │   └── orders/
│   │   │   │   ├── buyer-routing.module.ts
│   │   │   │   └── buyer.module.ts
│   │   │   │
│   │   │   ├── producer/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── producer-dashboard/
│   │   │   │   │   ├── my-products/
│   │   │   │   │   ├── received-orders/
│   │   │   │   │   └── my-farm/
│   │   │   │   ├── components/
│   │   │   │   │   ├── product-form/
│   │   │   │   │   ├── product-table-row/
│   │   │   │   │   ├── order-row/
│   │   │   │   │   ├── farm-info-card/
│   │   │   │   │   ├── farm-form/
│   │   │   │   │   ├── certification-list/
│   │   │   │   │   ├── sales-mini-chart/
│   │   │   │   │   └── status-select/
│   │   │   │   ├── services/
│   │   │   │   │   ├── producer-product.service.ts
│   │   │   │   │   ├── producer-order.service.ts
│   │   │   │   │   └── farm.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── managed-product.model.ts
│   │   │   │   │   ├── received-order.model.ts
│   │   │   │   │   └── farm.model.ts
│   │   │   │   ├── store/
│   │   │   │   │   ├── products/
│   │   │   │   │   ├── orders/
│   │   │   │   │   └── farm/
│   │   │   │   ├── producer-routing.module.ts
│   │   │   │   └── producer.module.ts
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── pages/
│   │   │       │   ├── admin-dashboard/
│   │   │       │   ├── pending-producers/
│   │   │       │   ├── all-producers/
│   │   │       │   ├── categories/
│   │   │       │   └── users/
│   │   │       ├── components/
│   │   │       │   ├── pending-producer-card/
│   │   │       │   ├── producer-detail-modal/
│   │   │       │   ├── producer-table-row/
│   │   │       │   ├── category-table-row/
│   │   │       │   ├── category-form/
│   │   │       │   ├── user-table-row/
│   │   │       │   └── rejection-reason-field/
│   │   │       ├── services/
│   │   │       │   ├── producer-approval.service.ts
│   │   │       │   ├── admin-category.service.ts
│   │   │       │   └── admin-user.service.ts
│   │   │       ├── models/
│   │   │       │   ├── producer-approval.model.ts
│   │   │       │   ├── admin-category.model.ts
│   │   │       │   └── admin-user.model.ts
│   │   │       ├── store/
│   │   │       │   ├── producers/
│   │   │       │   ├── categories/
│   │   │       │   └── users/
│   │   │       ├── admin-routing.module.ts
│   │   │       └── admin.module.ts
│   │   │
│   │   ├── store/
│   │   │   ├── app.state.ts
│   │   │   └── app.reducer.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   │   ├── brand/
│   │   │   └── illustrations/
│   │   └── icons/
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── styles/
│       ├── _tokens.scss
│       ├── _typography.scss
│       ├── _buttons.scss
│       ├── _forms.scss
│       ├── _animations.scss
│       ├── _accessibility.scss
│       ├── _responsive.scss
│       └── styles.scss
│
├── cypress/
│   └── e2e/
│       ├── auth/
│       ├── catalog/
│       ├── buyer/
│       └── admin/
│
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── package.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

### Configuración de Path Aliases (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "paths": {
      "@core/*":     ["src/app/core/*"],
      "@shared/*":   ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@env/*":      ["src/environments/*"]
    }
  }
}
```

### Configuración de Rutas Raíz
```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', loadChildren: () => import('@features/catalog/catalog.module').then(m => m.CatalogModule) },
  { path: 'auth', loadChildren: () => import('@features/auth/auth.module').then(m => m.AuthModule), canActivate: [PublicGuard] },
  { path: 'panel/comprador', loadChildren: () => import('@features/buyer/buyer.module').then(m => m.BuyerModule), canActivate: [AuthGuard, RoleGuard], data: { role: 'buyer' } },
  { path: 'panel/productor', loadChildren: () => import('@features/producer/producer.module').then(m => m.ProducerModule), canActivate: [AuthGuard, RoleGuard, ProducerApprovedGuard], data: { role: 'producer' } },
  { path: 'panel/admin', loadChildren: () => import('@features/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' } },
  { path: '**', redirectTo: '' }
];
```

---

## 10. Stack Tecnológico Recomendado

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Angular | 17+ | Framework principal |
| NgRx | 17+ | Gestión de estado global |
| RxJS | 7+ | Programación reactiva |
| TypeScript | 5+ | Tipado estático |
| SCSS | — | Estilos con variables y mixins |

### Backend (sugerido)
| Tecnología | Propósito |
|-----------|-----------|
| Node.js + Express o NestJS | API REST |
| PostgreSQL 16 | Base de datos principal |
| Redis | Caché de sesiones y catálogo |
| JWT (jsonwebtoken) | Autenticación |
| bcrypt / Argon2 | Hashing de contraseñas |
| AWS S3 | Almacenamiento de imágenes |
| AWS RDS | PostgreSQL gestionado |
| Prisma o Sequelize | ORM |

### Infraestructura
| Tecnología | Propósito |
|-----------|-----------|
| AWS | Proveedor de nube principal |
| Docker + docker-compose | Contenedorización |
| GitHub Actions | CI/CD |
| SonarQube | Calidad de código (RNF-MAN-01) |
| JMeter | Pruebas de carga (RNF-REN-03) |

---

## 11. Decisiones Arquitectónicas Clave (ADRs)

### ADR-001: Motor de Base de Datos
**Decisión:** PostgreSQL como motor de base de datos principal del MVP.  
**Justificación:** Soporte nativo de UUID, JSONB para metadata, DECIMAL para precios, UNIQUE constraints y CHECK constraints. Escalabilidad horizontal con replicación activa (RNF-DISP-03). Compatibilidad con AWS RDS.

---

### ADR-002: Separación de `inventory` de `products`
**Decisión:** Tabla `inventory` independiente de `products`.  
**Justificación:** Las actualizaciones de stock son frecuentes (cada compra, cancelación y reposición). Separar la tabla evita bloqueos de fila sobre el registro del producto, soportando los 500 usuarios concurrentes (RNF-REN-03). El precio del producto puede cambiar sin afectar el historial de pedidos (precios congelados en `order_items` y `cart_items`).

---

### ADR-003: Flujo unidireccional de estados de pedido
**Decisión:** Implementar `order_status_history` como tabla de eventos inmutables.  
**Justificación:** El flujo `confirmed → preparing → shipped → delivered` es unidireccional (HU-28). Almacenar cada cambio como un registro nuevo (en lugar de mutar el campo `status` de `orders`) garantiza auditoría completa (RNF-AUD-01) y permite reconstruir el historial de un pedido en cualquier momento.

---

### ADR-004: Lazy Loading por Feature Module en Angular
**Decisión:** Todos los módulos de dominio usan lazy loading.  
**Justificación:** Solo `CoreModule` y `SharedModule` cargan en el arranque. Los módulos de `auth`, `catalog`, `buyer`, `producer` y `admin` cargan únicamente cuando el usuario navega a esa sección, reduciendo el bundle inicial y mejorando el tiempo de primera carga (RNF-REN-01).

---

### ADR-005: NgRx para gestión de estado
**Decisión:** NgRx Store + Effects + Selectors por feature module.  
**Justificación:** Los paneles de comprador, productor y administrador requieren sincronización de estado entre múltiples componentes. NgRx permite flujo de datos unidireccional, depuración con Redux DevTools, y effects para manejo de side effects HTTP sin contaminar componentes.

---

### ADR-006: Interfaz de modelos separada por dominio
**Decisión:** Modelos específicos por dominio (`IProduct`, `IProductManaged`, `IProductAdmin`).  
**Justificación:** Principio de Interface Segregation (SOLID-I). El componente de catálogo no debe cargar propiedades de gestión del productor, y viceversa. Reduce el acoplamiento y facilita el tipado estático.

---

### ADR-007: Smart / Dumb Component Pattern
**Decisión:** Page components son smart (inyectan Store), feature components son dumb (solo `@Input`/`@Output`).  
**Justificación:** Los dumb components son 100% testeables de forma aislada sin dependencias externas. Los smart components orquestan el flujo de datos pero no tienen lógica de UI. Cumple Single Responsibility (SOLID-S).

---

### ADR-008: No almacenamiento de datos de tarjeta
**Decisión:** La tabla `payments` almacena únicamente `gateway_reference` y `gateway_signature`, nunca PAN ni CVV.  
**Justificación:** Cumplimiento PCI-DSS (RNF-SEC-04). Los datos de tarjeta son procesados directamente por la pasarela de pagos. La firma digital permite verificar la integridad de la respuesta de la pasarela (RNF-SEC-06).

---

## 12. Principios de Diseño UX/UI Aplicados

Estos principios aplican a **todas las pantallas** del proyecto de forma consistente:

### 1. Usabilidad
- Flujos de máximo 2-3 pasos para tareas clave
- Foco automático en el primer campo con error
- Búsqueda con debounce de 280ms
- Acciones contextuales (no menús profundos)

### 2. Jerarquía Visual
- Títulos: `Playfair Display` 1.75–2.375rem (peso 700)
- Precios: `Playfair Display` — siempre mayor que el texto circundante
- Botones primarios: ancho completo, `var(--espresso)` sólido
- Botones secundarios: borde con ghost, siempre menor prioridad visual

### 3. Coherencia
- Mismo sistema de tokens CSS en todas las pantallas
- Toast system unificado (4 tipos, posición bottom-right)
- Radios de borde: `--r-md: 10px` para inputs/botones, `--r-lg: 16px` para cards
- Sombras: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### 4. Minimalismo
- Formularios en pasos para no abrumar
- Información contextual por rol (solo muestra lo relevante)
- Empty states descriptivos en vez de tablas vacías

### 5. Accesibilidad (WCAG AA)
- Contraste de texto sobre fondo: mínimo 4.5:1
- `aria-required`, `aria-invalid`, `aria-describedby` en todos los inputs
- `aria-live="polite"` en mensajes dinámicos
- `role="dialog"` + `aria-modal="true"` en todos los modales
- Navegación por teclado completa en todas las interacciones
- Skip link `<a href="#main-content">` en todas las páginas
- Focus visible con `outline: 3px solid var(--espresso)`

### 6. Retroalimentación (Feedback)
- Validación `onblur` + íconos ✓/✗ en cada campo
- Spinner en botones durante operaciones asíncronas (1.2–2s simulados)
- Toast diferenciado por tipo y resultado
- Animaciones de entrada: `@keyframes fadeUp` con `animation-delay` escalonado
- Indicador de fortaleza de contraseña en tiempo real

### 7. Estética y Marca
- Panel izquierdo de marca en `var(--espresso)` con patrones topográficos
- Copa de café SVG animada como elemento ilustrativo central
- Grain overlay sutil en todos los fondos para textura orgánica
- Badges de certificación con colores semánticos: verde (orgánico), ámbar (Fairtrade), azul (Rainforest)

---

## 13. Convenciones y Reglas del Proyecto

### Nombrado de Archivos Angular
```
feature-name.component.ts       ← smart/dumb component
feature-name.component.html
feature-name.component.scss
feature-name.service.ts
feature-name.model.ts
feature-name.actions.ts
feature-name.reducer.ts
feature-name.effects.ts
feature-name.selectors.ts
feature-name.guard.ts
feature-name.interceptor.ts
feature-name.pipe.ts
feature-name.directive.ts
feature-name.validator.ts
feature-name.resolver.ts
```

### Convenciones de Código
- **TypeScript:** Strict mode activado (`"strict": true`)
- **ESLint:** No `any`, max-len 120, ordenamiento de imports
- **SCSS:** Solo variables del sistema `var(--token)`, sin colores hardcodeados
- **Commits:** Convencional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)
- **Cobertura de pruebas:** ≥ 80% (RNF-MAN-01)
- **Deuda técnica:** < 5% por módulo en SonarQube (RNF-MAN-03)

### Reglas de Negocio Críticas
1. **Un productor solo puede publicar si `producer_profiles.status = 'approved'`**
2. **Solo un carrito activo por usuario (`carts.user_id` es UNIQUE)**
3. **Stock nunca puede ser negativo (`CHECK quantity >= 0`)**
4. **Precio nunca puede ser negativo (`CHECK price >= 0`)**
5. **No se puede eliminar una categoría con productos activos asociados**
6. **El flujo de estados de pedido es unidireccional: no se puede retroceder**
7. **Solo compradores con pedido completado del producto pueden dejar reseña**
8. **Máximo una reseña por comprador por producto (`UNIQUE user_id, product_id`)**
9. **No almacenar PAN ni CVV en ninguna tabla de la base de datos**
10. **Todos los tokens de reseteo deben almacenarse hasheados, nunca en texto plano**

---

## 14. Archivos Generados

### HTML Prototipos (outputs listos para abrir en navegador)
```
login_ux_marketplace_cafe.html         ← Login con validación completa
registro_marketplace_cafe.html         ← Registro multi-rol en 2 pasos
landing_marketplace_cafe.html          ← Landing / Catálogo público
detalle_producto_cafe.html             ← Detalle de producto completo
panel_comprador_cafe.html              ← Panel comprador
panel_productor_cafe.html              ← Panel productor
panel_admin_cafe.html                  ← Panel administrador
erd_marketplace_cafe_sostenible.html   ← Diagrama ERD interactivo (24 tablas)
```

### Documentos de Arquitectura
```
ADR_Plantilla.docx       ← Plantilla oficial de ADR del proyecto
PROYECTO_CONTEXT.md      ← Este documento (contexto completo para Claude Code)
```

---

## Notas Finales para Claude Code

- El proyecto está en **fase de diseño y arquitectura** — no hay código Angular implementado aún.
- Los prototipos HTML son **referencia de diseño** — no código Angular final.
- Los colores, tipografías y componentes ya están validados visualmente y deben trasladarse 1:1 a Angular con SCSS.
- El esquema de BD está **definido y aprobado** — puede usarse para generar las migraciones de Prisma o Sequelize.
- Prioridad de implementación sugerida:
  1. Core module (auth, interceptors, guards)
  2. Shared components (UI library)
  3. Feature: Catalog (público, sin auth)
  4. Feature: Auth (login, registro)
  5. Feature: Buyer (carrito, pedidos)
  6. Feature: Producer (productos, finca)
  7. Feature: Admin (aprobaciones, categorías)
- Usar `ng generate` con esquemas para acelerar la creación de módulos, componentes y servicios.
- Los ADRs del proyecto deben llenarse usando la plantilla `ADR_Plantilla.docx` para cada decisión significativa.

---

*World Coffee Marketplace — UNAB 2025*
