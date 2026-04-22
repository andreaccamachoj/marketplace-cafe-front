import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { IFarm } from '../../models/farm.model';

type ProcessType = 'Washed' | 'Natural' | 'Honey' | 'Semi-washed';

interface FarmFormValue {
  name:              FormControl<string>;
  municipality:      FormControl<string>;
  department:        FormControl<string>;
  country:           FormControl<string>;
  altitude:          FormControl<string>;
  area:              FormControl<string>;
  mainVariety:       FormControl<string>;
  process:           FormControl<string>;
  description:       FormControl<string>;
  annualProduction:  FormControl<string>;
  yieldPerHa:        FormControl<string>;
  harvestSeason:     FormControl<string>;
  treeCount:         FormControl<string>;
  cuppingScore:      FormControl<string>;
}

@Component({
  selector: 'app-farm-edit-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './farm-edit-modal.component.html',
  styleUrl: './farm-edit-modal.component.scss',
})
export class FarmEditModalComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly farm = input.required<IFarm>();
  readonly open = input.required<boolean>();

  readonly closed = output<void>();
  readonly saved  = output<Partial<IFarm>>();

  readonly form = new FormGroup<FarmFormValue>({
    name:             new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    municipality:     new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    department:       new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    country:          new FormControl<string>('Colombia', { nonNullable: true, validators: [Validators.required] }),
    altitude:         new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    area:             new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    mainVariety:      new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    process:          new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description:      new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20), Validators.maxLength(800)] }),
    annualProduction: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    yieldPerHa:       new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    harvestSeason:    new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    treeCount:        new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    cuppingScore:     new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly processOptions: ProcessType[] = ['Washed', 'Natural', 'Honey', 'Semi-washed'];

  constructor() {
    effect(() => {
      const f = this.farm();
      this.form.patchValue({
        name:             f.name,
        municipality:     f.municipality,
        department:       f.department,
        country:          'Colombia',
        altitude:         f.altitude,
        area:             f.area,
        mainVariety:      f.mainVariety,
        process:          f.process,
        description:      f.description,
        annualProduction: f.metrics.annualProduction,
        yieldPerHa:       f.metrics.yieldPerHa,
        harvestSeason:    f.metrics.harvestSeason,
        treeCount:        f.metrics.treeCount,
        cuppingScore:     f.metrics.cuppingScore,
      });
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  get nameCtrl()             { return this.form.controls.name; }
  get municipalityCtrl()     { return this.form.controls.municipality; }
  get departmentCtrl()       { return this.form.controls.department; }
  get countryCtrl()          { return this.form.controls.country; }
  get altitudeCtrl()         { return this.form.controls.altitude; }
  get areaCtrl()             { return this.form.controls.area; }
  get mainVarietyCtrl()      { return this.form.controls.mainVariety; }
  get processCtrl()          { return this.form.controls.process; }
  get descriptionCtrl()      { return this.form.controls.description; }
  get annualProductionCtrl() { return this.form.controls.annualProduction; }
  get yieldPerHaCtrl()       { return this.form.controls.yieldPerHa; }
  get harvestSeasonCtrl()    { return this.form.controls.harvestSeason; }
  get treeCountCtrl()        { return this.form.controls.treeCount; }
  get cuppingScoreCtrl()     { return this.form.controls.cuppingScore; }

  hasError(ctrl: AbstractControl | null): boolean {
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  getError(ctrl: AbstractControl | null): string {
    if (!ctrl || !ctrl.errors) return '';
    const e = ctrl.errors as ValidationErrors;
    if (e['required'])   return 'Este campo es obligatorio.';
    if (e['minlength'])  return `Mínimo ${(e['minlength'] as { requiredLength: number }).requiredLength} caracteres.`;
    if (e['maxlength'])  return `Máximo ${(e['maxlength'] as { requiredLength: number }).requiredLength} caracteres.`;
    return 'Valor inválido.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const payload: Partial<IFarm> = {
      name:        v.name,
      municipality: v.municipality,
      department:  v.department,
      altitude:    v.altitude,
      area:        v.area,
      mainVariety: v.mainVariety,
      process:     v.process,
      description: v.description,
      metrics: {
        annualProduction: v.annualProduction,
        yieldPerHa:       v.yieldPerHa,
        process:          v.process,
        harvestSeason:    v.harvestSeason,
        treeCount:        v.treeCount,
        cuppingScore:     v.cuppingScore,
      },
    };

    this.saved.emit(payload);
  }

  onClose(): void {
    this.form.reset();
    this.closed.emit();
  }
}
