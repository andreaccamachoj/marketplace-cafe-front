import {
  Component, Input, signal, ChangeDetectionStrategy,
} from '@angular/core';
import { IFarmInfo, ICuppingAttribute, IFlavorNote } from '../../models/product.model';
import { FlavorNotesComponent } from '../flavor-notes/flavor-notes.component';

type TabId = 'description' | 'notes' | 'farm' | 'prep';

@Component({
  selector: 'app-product-detail-tabs',
  standalone: true,
  imports: [FlavorNotesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-tabs">

      <!-- Tab nav -->
      <div class="detail-tabs-row" role="tablist" aria-label="Secciones de detalle">
        @for (tab of TABS; track tab.id) {
          <button
            class="d-tab"
            [class.active]="activeTab() === tab.id"
            type="button"
            role="tab"
            [attr.aria-selected]="activeTab() === tab.id"
            [attr.id]="'dtab-' + tab.id"
            [attr.aria-controls]="'dpanel-' + tab.id"
            (click)="setTab(tab.id)"
          >{{ tab.label }}</button>
        }
      </div>

      <!-- Descripción -->
      @if (activeTab() === 'description') {
        <div class="d-panel active" role="tabpanel" id="dpanel-description" aria-labelledby="dtab-description">
          <p class="desc-text">{{ description }}</p>

          @if (farmInfo) {
            <div class="desc-chips">
              @if (farmInfo.process) {
                <div class="desc-chip">🌿 Proceso: {{ farmInfo.process }}</div>
              }
              @if (farmInfo.altitude) {
                <div class="desc-chip">🏔️ Altitud: {{ farmInfo.altitude }} msnm</div>
              }
            </div>
          }
        </div>
      }

      <!-- Notas de sabor -->
      @if (activeTab() === 'notes') {
        <div class="d-panel active" role="tabpanel" id="dpanel-notes" aria-labelledby="dtab-notes">
          <app-flavor-notes
            [flavorNotes]="flavorNotes"
            [cuppingScore]="cuppingScore"
            [cuppingAttributes]="cuppingAttributes"
          />
        </div>
      }

      <!-- Origen y finca -->
      @if (activeTab() === 'farm' && farmInfo) {
        <div class="d-panel active" role="tabpanel" id="dpanel-farm" aria-labelledby="dtab-farm">
          <div class="farm-detail-grid" role="list" aria-label="Datos de la finca de origen">
            <div class="farm-detail-card" role="listitem">
              <div class="fd-label">Finca</div>
              <div class="fd-value fd-value--big">{{ farmInfo.name }}</div>
            </div>
            <div class="farm-detail-card" role="listitem">
              <div class="fd-label">Municipio</div>
              <div class="fd-value fd-value--big">{{ farmInfo.municipality }}</div>
            </div>
            <div class="farm-detail-card" role="listitem">
              <div class="fd-label">Departamento</div>
              <div class="fd-value">{{ farmInfo.department }}</div>
            </div>
            <div class="farm-detail-card" role="listitem">
              <div class="fd-label">Altitud</div>
              <div class="fd-value">{{ farmInfo.altitude }} msnm</div>
            </div>
            <div class="farm-detail-card" role="listitem">
              <div class="fd-label">Extensión</div>
              <div class="fd-value">{{ farmInfo.area }} hectáreas</div>
            </div>
            <div class="farm-detail-card" role="listitem">
              <div class="fd-label">Proceso</div>
              <div class="fd-value">{{ farmInfo.process }}</div>
            </div>
          </div>
        </div>
      }

      <!-- Preparación -->
      @if (activeTab() === 'prep') {
        <div class="d-panel active" role="tabpanel" id="dpanel-prep" aria-labelledby="dtab-prep">
          <div class="prep-grid">
            @for (method of BREW_METHODS; track method.name) {
              <div class="prep-card">
                <div class="prep-card__icon" aria-hidden="true">{{ method.icon }}</div>
                <div class="prep-card__name">{{ method.name }}</div>
                <div class="prep-card__params">
                  <span>{{ method.grind }}</span>
                  <span>{{ method.temp }}</span>
                  <span>{{ method.time }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './product-detail-tabs.component.scss',
})
export class ProductDetailTabsComponent {
  @Input() description = '';
  @Input() flavorNotes: IFlavorNote[] = [];
  @Input() cuppingScore?: number;
  @Input() cuppingAttributes: ICuppingAttribute[] = [];
  @Input() farmInfo?: IFarmInfo;

  protected readonly activeTab = signal<TabId>('description');

  protected readonly TABS: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Descripción'        },
    { id: 'notes',       label: 'Notas de sabor'     },
    { id: 'farm',        label: 'Origen y finca'     },
    { id: 'prep',        label: 'Preparación'        },
  ];

  protected readonly BREW_METHODS = [
    { icon: '☕', name: 'Espresso',       grind: 'Muy fino',    temp: '93 °C', time: '25–30 s'  },
    { icon: '🫖', name: 'Chemex',         grind: 'Medio-grueso',temp: '94 °C', time: '4–5 min'  },
    { icon: '🌀', name: 'V60',            grind: 'Medio-fino',  temp: '93 °C', time: '3–4 min'  },
    { icon: '🥛', name: 'Prensa francesa',grind: 'Grueso',      temp: '95 °C', time: '4 min'    },
    { icon: '🧊', name: 'Cold Brew',      grind: 'Grueso',      temp: 'Frío',  time: '12–16 h'  },
    { icon: '⚗️', name: 'Moka',           grind: 'Fino',        temp: '—',     time: '5–7 min'  },
  ];

  protected setTab(id: TabId): void {
    this.activeTab.set(id);
  }
}
