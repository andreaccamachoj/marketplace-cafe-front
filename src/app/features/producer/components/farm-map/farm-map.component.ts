import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-farm-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './farm-map.component.html',
  styleUrl: './farm-map.component.scss',
})
export class FarmMapComponent {
  readonly farmName = input<string>('Finca');
  readonly location = input<string>('');
}
