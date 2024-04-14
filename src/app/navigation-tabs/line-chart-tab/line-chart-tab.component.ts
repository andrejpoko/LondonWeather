import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-moment';
import { BaseChartDirective } from 'ng2-charts';
import
  {
    Subject,
    combineLatest,
    map,
    of,
    switchMap,
    takeUntil,
    tap
  } from 'rxjs';
import { ChartJsData } from '../../models/weather.model';
import { ProgressBarService } from '../../shared/progress-bar.service';
import { LondonLocation, WeatherService } from '../../shared/weather.service';
import { lineChartOptions } from './chart-config';

@Component({
  standalone: true,
  selector: 'app-line-chart-tab',
  templateUrl: './line-chart-tab.component.html',
  styleUrls: ['./line-chart-tab.component.css'],
  imports: [BaseChartDirective, CommonModule, MatIconModule, RouterModule],
})
export class LineChartTabComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  chartOptions: ChartConfiguration['options'] = lineChartOptions;
  lineChartDataCurrent: ChartJsData = {
    datasets: [{ data: [], label: 'Temperature' }],
  };
  lineChartDataHistorical: ChartJsData = {
    datasets: [{ data: [], label: 'Temperature' }],
  };

  constructor(
    public weatherService: WeatherService,
    public progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    // Next 7 days
    this.weatherService
      .fetchChartData(LondonLocation.latitude, LondonLocation.longitude)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.progressBarService.show())
      )
      .subscribe({
        next: (currentData) => {
          this.lineChartDataCurrent.datasets[0].data = currentData;
          this.updateChart();
          this.progressBarService.hide();
        },
        error: (error) => {
          console.error(
            'There was an error fetching the current line chart data:',
            error
          );
          this.progressBarService.hide();
        },
        complete: () => {
          this.progressBarService.hide();
        },
      });

    // Historical view
    combineLatest([
      this.weatherService.startDate$,
      this.weatherService.endDate$,
    ])
      .pipe(
        takeUntil(this.unsubscribe$),
        map(([startDate, endDate]) => ({ startDate, endDate })),
        switchMap(({ startDate, endDate }) => {
          if (startDate && endDate) {
            return this.weatherService.fetchChartData(
              LondonLocation.latitude,
              LondonLocation.longitude,
              startDate,
              endDate
            );
          } else {
            return of([]);
          }
        }),
        tap(() => this.progressBarService.show())
      )
      .subscribe({
        next: (historicalData) => {
          this.lineChartDataHistorical.datasets[0].data = historicalData;
          this.updateChart();
          this.progressBarService.hide();
        },
        error: (error) => {
          console.error('Error fetching historical chart data:', error);
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

  updateChart() {
    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }
}
