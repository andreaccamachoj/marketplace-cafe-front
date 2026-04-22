import { Injectable, computed, signal } from '@angular/core';
import { IActivityItem } from '../models/activity.model';

const SEED_ACTIVITY: IActivityItem[] = [
  {
    id: 'act-1',
    type: 'user_registered',
    title: 'Nuevo usuario registrado',
    description: 'Ana García López se registró como compradora',
    timestamp: '2025-04-22T08:45:00Z',
    actorName: 'Ana García López',
    iconEmoji: '👤',
    severity: 'info',
  },
  {
    id: 'act-2',
    type: 'producer_approved',
    title: 'Productor aprobado',
    description: 'Andrés Felipe Gómez — San Agustín Estate fue aprobado',
    timestamp: '2025-04-21T15:30:00Z',
    actorName: 'Admin WCM',
    iconEmoji: '✅',
    severity: 'success',
  },
  {
    id: 'act-3',
    type: 'order_placed',
    title: 'Nuevo pedido',
    description: 'Pedido ORD-2025-00089 por $185.000 COP',
    timestamp: '2025-04-21T14:20:00Z',
    actorName: 'Sandra Cruz',
    iconEmoji: '🛒',
    severity: 'info',
  },
  {
    id: 'act-4',
    type: 'producer_rejected',
    title: 'Solicitud rechazada',
    description: 'Pedro Pablo Restrepo — Finca El Roble fue rechazado por documentación incompleta',
    timestamp: '2025-04-20T11:00:00Z',
    actorName: 'Admin WCM',
    iconEmoji: '❌',
    severity: 'warning',
  },
  {
    id: 'act-5',
    type: 'category_created',
    title: 'Categoría creada',
    description: 'Se creó la categoría Cold Brew',
    timestamp: '2025-04-19T09:00:00Z',
    actorName: 'Admin WCM',
    iconEmoji: '📁',
    severity: 'info',
  },
  {
    id: 'act-6',
    type: 'user_suspended',
    title: 'Usuario suspendido',
    description: 'Roberto Hernández fue suspendido por violación de términos',
    timestamp: '2025-04-18T16:30:00Z',
    actorName: 'Admin WCM',
    iconEmoji: '🚫',
    severity: 'danger',
  },
  {
    id: 'act-7',
    type: 'order_placed',
    title: 'Nuevo pedido',
    description: 'Pedido ORD-2025-00085 por $320.000 COP',
    timestamp: '2025-04-17T10:15:00Z',
    actorName: 'Luis Torres',
    iconEmoji: '🛒',
    severity: 'info',
  },
  {
    id: 'act-8',
    type: 'product_flagged',
    title: 'Producto reportado',
    description: 'Producto "Café Blend Mixto" fue reportado por descripción incorrecta',
    timestamp: '2025-04-16T14:00:00Z',
    actorName: 'Sistema',
    iconEmoji: '⚠️',
    severity: 'warning',
  },
  {
    id: 'act-9',
    type: 'producer_approved',
    title: 'Productor aprobado',
    description: 'Luz Marina Vargas — Finca La Esperanza fue aprobada',
    timestamp: '2025-04-15T11:00:00Z',
    actorName: 'Admin WCM',
    iconEmoji: '✅',
    severity: 'success',
  },
  {
    id: 'act-10',
    type: 'user_registered',
    title: 'Nuevo usuario registrado',
    description: 'Valentina Moreno se registró como compradora',
    timestamp: '2025-04-14T09:30:00Z',
    actorName: 'Valentina Moreno',
    iconEmoji: '👤',
    severity: 'info',
  },
];

@Injectable({ providedIn: 'root' })
export class AdminActivityService {
  private readonly _items = signal<IActivityItem[]>(SEED_ACTIVITY);

  readonly all = computed(() => this._items());
  readonly recent = computed(() => this._items().slice(0, 5));

  addItem(item: Omit<IActivityItem, 'id'>): void {
    const newItem: IActivityItem = {
      ...item,
      id: `act-${Date.now()}`,
    };
    this._items.update(list => [newItem, ...list]);
  }
}
