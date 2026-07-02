import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IFarmCertification } from '../../models/farm.model';

@Component({
  selector: 'app-certification-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './certification-list.component.html',
  styleUrl: './certification-list.component.scss',
})
export class CertificationListComponent {
  readonly certifications = input.required<IFarmCertification[]>();
}
