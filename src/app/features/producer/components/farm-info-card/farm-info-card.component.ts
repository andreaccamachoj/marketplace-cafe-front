import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IFarm } from '../../models/farm.model';
import { FarmMapComponent } from '../farm-map/farm-map.component';

@Component({
  selector: 'app-farm-info-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FarmMapComponent],
  templateUrl: './farm-info-card.component.html',
  styleUrl: './farm-info-card.component.scss',
})
export class FarmInfoCardComponent {
  readonly farm = input.required<IFarm>();
}
