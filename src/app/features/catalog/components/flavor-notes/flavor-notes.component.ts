import {
  Component, Input, ChangeDetectionStrategy,
} from '@angular/core';
import { IFlavorNote, ICuppingAttribute } from '../../models/product.model';

@Component({
  selector: 'app-flavor-notes',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flavor-section">

      <!-- Cupping score — FIRST, light background -->
      @if (cuppingScore) {
        <div class="cupping-row" aria-label="Puntuación de catación">
          <div class="cupping-score">
            <div class="cup-num">{{ cuppingScore }}</div>
            <div class="cup-stars" aria-hidden="true">★★★★★</div>
            <div class="cup-label">Puntos SCA</div>
          </div>
          @if (cuppingAttributes.length) {
            <div class="cupping-attrs" role="list" aria-label="Atributos de catación">
              @for (attr of cuppingAttributes; track attr.label) {
                <div class="cup-attr" role="listitem">
                  <div class="cup-attr-label">{{ attr.label }}</div>
                  <div class="cup-attr-bar">
                    <div
                      class="cup-attr-fill"
                      [style.width.%]="attr.value * 10"
                    ></div>
                  </div>
                  <div class="cup-attr-val">{{ attr.value }} / 10</div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Flavor note cards — horizontal layout -->
      @if (flavorNotes.length) {
        <div class="flavor-grid" role="list" aria-label="Notas de sabor detectadas">
          @for (note of flavorNotes; track note.name) {
            <div class="flavor-card" role="listitem">
              <div class="flavor-icon" aria-hidden="true">{{ note.icon }}</div>
              <div class="flavor-body">
                <div class="flavor-name">{{ note.name }}</div>
                <div
                  class="flavor-intensity"
                  role="progressbar"
                  [attr.aria-valuenow]="note.intensity"
                  aria-valuemin="0" aria-valuemax="100"
                  [attr.aria-label]="note.name + ': ' + note.intensity + '%'"
                >
                  <div class="flavor-fill" [style.width.%]="note.intensity"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

    </div>
  `,
  styleUrl: './flavor-notes.component.scss',
})
export class FlavorNotesComponent {
  @Input() flavorNotes: IFlavorNote[] = [];
  @Input() cuppingScore?: number;
  @Input() cuppingAttributes: ICuppingAttribute[] = [];
}
