import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent, ISidebarItem } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { BrandPanelComponent } from '../brand-panel/brand-panel.component';

/**
 * PanelLayout — composición estándar para paneles autenticados.
 * Estructura: navbar + sidebar + main content + footer
 *
 * Uso:
 * <app-panel-layout [sidebarItems]="items">
 *   <app-page-header title="Mi Página" />
 *   <div>Contenido aquí</div>
 * </app-panel-layout>
 */
@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, FooterComponent, BrandPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel-layout">
      <!-- Navbar -->
      <app-navbar />

      <div class="panel-layout__body">
        <!-- Sidebar -->
        <app-sidebar [items]="sidebarItems" />

        <!-- Main content -->
        <main class="panel-layout__main">
          <ng-content />
        </main>
      </div>

      <!-- Footer -->
      <app-footer />
    </div>
  `,
  styleUrl: './panel-layout.component.scss',
})
export class PanelLayoutComponent {
  @Input() sidebarItems: ISidebarItem[] = [];
}
