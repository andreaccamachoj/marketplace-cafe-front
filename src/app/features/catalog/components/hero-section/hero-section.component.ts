import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { StatCardComponent } from '@shared/ui/stat-card/stat-card.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterModule, ButtonComponent, StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="hero__badge">100% CERTIFICADO</div>
      <h1 class="hero__title">
        Café Colombiano <em>100% Sostenible</em>
      </h1>
      <p class="hero__subtitle">
        Conectamos productores de café de especialidad con compradores conscientes.
        Cada taza cuenta una historia de sostenibilidad.
      </p>
      <div class="hero__ctas">
        <app-button variant="primary" size="lg" (click)="onExplore()">
          Explorar Catálogo
        </app-button>
        <app-button variant="ghost" size="lg">
          Conócenos
        </app-button>
      </div>

      <div class="hero__stats">
        <app-stat-card
          [value]="'120+'"
          label="Productores"
          icon="🌍"
        ></app-stat-card>
        <app-stat-card
          [value]="'18'"
          label="Regiones"
          icon="🗻"
        ></app-stat-card>
        <app-stat-card
          [value]="'100%'"
          label="Certificado"
          icon="✓"
        ></app-stat-card>
        <app-stat-card
          [value]="'4.9★'"
          label="Rating"
          icon="⭐"
        ></app-stat-card>
      </div>
    </section>
  `,
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  @Output() exploreCatalog = new EventEmitter<void>();

  protected onExplore(): void { this.exploreCatalog.emit(); }
}
