import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output,
} from '@angular/core';

interface IRoleCard {
  id: 'buyer' | 'producer';
  icon: string;
  title: string;
  desc: string;
  colorClass: string;
}

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="role-selector" role="radiogroup" aria-label="Tipo de cuenta">

      <div class="role-grid">
        @for (card of ROLES; track card.id) {
          <button
            type="button"
            class="role-card"
            [class]="'role-card ' + (selected === card.id ? 'role-card--active role-card--' + card.colorClass : '')"
            [attr.aria-pressed]="selected === card.id"
            [attr.aria-label]="'Seleccionar ' + card.title"
            (click)="roleSelected.emit(card.id)"
          >
            <!-- Check indicator -->
            <span class="role-card__check" aria-hidden="true">
              @if (selected === card.id) { ✓ }
            </span>

            <span class="role-card__icon" aria-hidden="true">{{ card.icon }}</span>
            <span class="role-card__name">{{ card.title }}</span>
            <span class="role-card__desc">{{ card.desc }}</span>
          </button>
        }

        <!-- Admin card: visible but disabled for public registration -->
        <button
          type="button"
          class="role-card role-card--disabled"
          disabled
          aria-disabled="true"
          aria-label="Administrador — no disponible en registro público"
        >
          <span class="role-card__check" aria-hidden="true"></span>
          <span class="role-card__icon" aria-hidden="true">🔐</span>
          <span class="role-card__name">Administrador</span>
          <span class="role-card__desc">Acceso interno</span>
          <span class="role-card__badge">Solo invitación</span>
        </button>
      </div>

    </div>
  `,
  styleUrl: './role-selector.component.scss',
})
export class RoleSelectorComponent {
  @Input() selected: 'buyer' | 'producer' = 'buyer';
  @Output() roleSelected = new EventEmitter<'buyer' | 'producer'>();

  protected readonly ROLES: IRoleCard[] = [
    {
      id:         'buyer',
      icon:       '🛒',
      title:      'Comprador',
      desc:       'Accede al catálogo y realiza pedidos directos a productores',
      colorClass: 'buyer',
    },
    {
      id:         'producer',
      icon:       '🌱',
      title:      'Productor',
      desc:       'Publica tu café y conecta con compradores responsables',
      colorClass: 'producer',
    },
  ];
}
