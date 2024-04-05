import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-moment';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, combineLatest, delay, takeUntil } from 'rxjs';
import { ProgressBarService } from '../../shared/progress-bar.service';
import { LondonLocation, WeatherService } from '../../shared/weather.service';
import { lineChartOptions } from './chart-config';

@Component({
  standalone: true,
  selector: 'app-line-chart-tab',
  templateUrl: './line-chart-tab.component.html',
  styleUrls: ['./line-chart-tab.component.css'],
  imports: [BaseChartDirective, CommonModule],
})
export class LineChartTabComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  chartOptions: ChartConfiguration['options'] = lineChartOptions;
  lineChartDataCurrent: any = {
    datasets: [
      {
        data: [],
        label: 'Temperature',
      },
    ],
  };
  lineChartDataHistorical: any = {
    datasets: [
      {
        data: [],
        label: 'Temperature',
      },
    ],
  };

  constructor(
    private weatherService: WeatherService,
    public progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.progressBarService.show();
    });
    const curr$ = this.weatherService.fetchChartData(
      LondonLocation.latitude,
      LondonLocation.longitude
    );
    const history$ = this.weatherService.fetchChartData(
      LondonLocation.latitude,
      LondonLocation.longitude,
      0,
      3
    );

    combineLatest([curr$, history$])
      .pipe(takeUntil(this.unsubscribe$), delay(150)) // Simulate delay
      .subscribe({
        next: ([currentData, historicalData]) => {
          this.lineChartDataCurrent.datasets[0].data = currentData;
          this.lineChartDataHistorical.datasets[0].data = historicalData;
        },
        error: (error) => {
          console.error('There was an error fetching line chart data:', error);
          this.progressBarService.hide();
        },
        complete: () => {
          this.progressBarService.hide();
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
