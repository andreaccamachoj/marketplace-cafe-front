import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { NgClass } from '@angular/common';

export interface IStep {
  label: string;
  description?: string;
}

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav aria-label="Pasos del formulario" class="step-indicator">
      @for (step of steps; track step.label; let i = $index) {
        <div
          class="step"
          [ngClass]="{
            'step--completed': i < currentStep,
            'step--active':    i === currentStep,
            'step--pending':   i > currentStep
          }"
          [attr.aria-current]="i === currentStep ? 'step' : null"
        >
          <!-- connector line (not for first item) -->
          @if (i > 0) {
            <div class="step__connector" aria-hidden="true"></div>
          }

          <div class="step__circle" aria-hidden="true">
            @if (i < currentStep) {
              <!-- checkmark -->
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            } @else {
              {{ i + 1 }}
            }
          </div>

          <div class="step__info">
            <span class="step__label">{{ step.label }}</span>
            @if (step.description) {
              <span class="step__desc">{{ step.description }}</span>
            }
          </div>
        </div>
      }
    </nav>
  `,
  styleUrl: './step-indicator.component.scss',
})
export class StepIndicatorComponent {
  @Input() steps: IStep[] = [];
  /** Zero-based index of the current active step */
  @Input() currentStep = 0;
}
