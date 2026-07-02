import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  /* ── Paneles privados: siempre Server (requieren autenticación, no prerenderizar) ── */
  {
    path: 'panel/comprador',
    renderMode: RenderMode.Server,
  },
  {
    path: 'panel/productor',
    renderMode: RenderMode.Server,
  },
  {
    path: 'panel/admin',
    renderMode: RenderMode.Server,
  },

  /* ── Auth: Server (estado de sesión dinámico) ── */
  {
    path: 'auth/login',
    renderMode: RenderMode.Server,
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Server,
  },
  {
    path: 'auth/forgot-password',
    renderMode: RenderMode.Server,
  },

  /* ── Detalle de producto: Server (datos dinámicos por ID) ── */
  {
    path: 'productos/:id',
    renderMode: RenderMode.Server,
  },

  /* ── Resto de rutas públicas: Prerender (catálogo, home, etc.) ── */
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
