import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-specific-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="role-form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

      <!-- Producer fields -->
      @if (role === 'producer') {
        <div class="producer-section">
          <p class="producer-section-title">
            <span aria-hidden="true">🌱</span> Información de la finca
          </p>

          <div class="field">
            <label class="field__label" for="farm-name">
              Nombre de la finca <span style="color:var(--error,#8b2020)">*</span>
            </label>
            <input
              id="farm-name"
              type="text"
              class="field__input"
              [class.field__input--error]="isInvalid('farmName')"
              formControlName="farmName"
              placeholder="Finca El Paraíso"
              [attr.aria-invalid]="isInvalid('farmName')"
              aria-required="true"
            />
            @if (isInvalid('farmName')) {
              <span class="field__error" role="alert">El nombre de la finca es requerido</span>
            }
          </div>

          <div class="field">
            <label class="field__label" for="farm-region">
              Región cafetero <span style="color:var(--error,#8b2020)">*</span>
            </label>
            <select
              id="farm-region"
              class="field__select"
              [class.field__select--error]="isInvalid('region')"
              formControlName="region"
              [attr.aria-invalid]="isInvalid('region')"
              aria-required="true"
            >
              <option value="">Selecciona una región</option>
              <option value="Huila">Huila</option>
              <option value="Nariño">Nariño</option>
              <option value="Cauca">Cauca</option>
              <option value="Sierra Nevada">Sierra Nevada</option>
              <option value="Eje Cafetero">Eje Cafetero</option>
              <option value="Cundinamarca">Cundinamarca</option>
              <option value="Otra">Otra</option>
            </select>
            @if (isInvalid('region')) {
              <span class="field__error" role="alert">La región es requerida</span>
            }
          </div>

          <div class="field">
            <label class="field__label" for="hectares">
              Hectáreas
              <span style="font-size:.6875rem;color:var(--cafe-medio,#7a5c42);font-weight:400;margin-left:4px">(opcional)</span>
            </label>
            <input
              id="hectares"
              type="number"
              class="field__input"
              formControlName="hectares"
              placeholder="Ej. 10"
              min="0"
            />
          </div>
        </div>
      }

      <!-- Buyer fields -->
      @if (role === 'buyer') {
        <div class="buyer-section">
          <p class="buyer-section-title">
            <span aria-hidden="true">🛒</span> Información de compra
          </p>

          <div class="field">
            <label class="field__label" for="company-name">
              Empresa
              <span style="font-size:.6875rem;color:var(--cafe-medio,#7a5c42);font-weight:400;margin-left:4px">(opcional)</span>
            </label>
            <input
              id="company-name"
              type="text"
              class="field__input"
              formControlName="companyName"
              placeholder="Nombre de tu empresa o cafetería"
            />
          </div>

          <div class="field">
            <label class="field__label" for="country">
              País <span style="color:var(--error,#8b2020)">*</span>
            </label>
            <select
              id="country"
              class="field__select"
              [class.field__select--error]="isInvalid('country')"
              formControlName="country"
              [attr.aria-invalid]="isInvalid('country')"
              aria-required="true"
            >
              <option value="">Selecciona tu país</option>
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="España">España</option>
              <option value="Alemania">Alemania</option>
              <option value="Otro">Otro</option>
            </select>
            @if (isInvalid('country')) {
              <span class="field__error" role="alert">El país es requerido</span>
            }
          </div>
        </div>
      }

      <!-- Nav buttons -->
      <div class="role-form__footer">
        <button type="button" class="btn-back" (click)="back.emit()">
          ← Atrás
        </button>
        <button type="submit" class="btn-submit" [disabled]="form.invalid">
          <span>Crear cuenta</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

    </form>
  `,
  styleUrl: './role-specific-step.component.scss',
})
export class RoleSpecificStepComponent implements OnChanges {
  @Input({ required: true }) role!: 'buyer' | 'producer';
  @Output() submitted = new EventEmitter<Record<string, string>>();
  @Output() back      = new EventEmitter<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  protected form = this.buildForm('buyer');

  ngOnChanges(): void {
    this.form = this.buildForm(this.role);
  }

  private buildForm(role: 'buyer' | 'producer') {
    if (role === 'producer') {
      return this.fb.group({
        farmName:    this.fb.control('', [Validators.required]),
        region:      this.fb.control('', [Validators.required]),
        hectares:    this.fb.control(''),
        companyName: this.fb.control(''),
        country:     this.fb.control(''),
      });
    }
    return this.fb.group({
      farmName:    this.fb.control(''),
      region:      this.fb.control(''),
      hectares:    this.fb.control(''),
      companyName: this.fb.control(''),
      country:     this.fb.control('', [Validators.required]),
    });
  }

  protected isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.submitted.emit(
      Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v !== '') as [string, string][]
      )
    );
  }
}
