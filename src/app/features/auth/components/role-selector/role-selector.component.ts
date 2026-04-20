import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="role-selector">
      <h3 class="role-selector__title">¿Cómo deseas participar?</h3>
      <p class="role-selector__subtitle">Selecciona tu tipo de cuenta</p>

      <div class="role-selector__cards">
        <button
          type="button"
          class="role-card"
          [class.role-card--active]="selected === 'buyer'"
          (click)="roleSelected.emit('buyer')"
          aria-label="Seleccionar rol Comprador"
        >
          <span class="role-card__icon">🛒</span>
          <span class="role-card__title">Comprador</span>
          <span class="role-card__desc">Accede al catálogo y realiza pedidos directos a productores</span>
        </button>

        <button
          type="button"
          class="role-card"
          [class.role-card--active]="selected === 'producer'"
          (click)="roleSelected.emit('producer')"
          aria-label="Seleccionar rol Productor"
        >
          <span class="role-card__icon">🌱</span>
          <span class="role-card__title">Productor</span>
          <span class="role-card__desc">Publica tu café y conecta con compradores responsables</span>
        </button>
      </div>
    </div>
  `,
  styleUrl: './role-selector.component.scss',
})
export class RoleSelectorComponent {
  @Input() selected: 'buyer' | 'producer' = 'buyer';
  @Output() roleSelected = new EventEmitter<'buyer' | 'producer'>();
}
