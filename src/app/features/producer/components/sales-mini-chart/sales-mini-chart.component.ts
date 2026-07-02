import { ChangeDetectionStrategy, Component } from '@angular/core';

interface BarData {
  month: string;
  value: number;
  active?: boolean;
}

@Component({
  selector: 'app-sales-mini-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './sales-mini-chart.component.html',
  styleUrl: './sales-mini-chart.component.scss',
})
export class SalesMiniChartComponent {
  protected readonly bars: BarData[] = [
    { month: 'Nov', value: 55 },
    { month: 'Dic', value: 78 },
    { month: 'Ene', value: 62 },
    { month: 'Feb', value: 88 },
    { month: 'Mar', value: 71 },
    { month: 'Abr', value: 100, active: true },
  ];
}
