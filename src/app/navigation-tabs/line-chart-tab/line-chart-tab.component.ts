import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-moment';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, delay, map, of, switchMap, takeUntil, tap } from 'rxjs';
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
  displayDays$ = this.weatherService.pastDays$.pipe(
    map((days) => (days !== null && days > 0 ? days : 'N/A'))
  );

  constructor(
    public weatherService: WeatherService,
    public progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    this.weatherService
      .fetchChartData(LondonLocation.latitude, LondonLocation.longitude)
      .pipe(
        takeUntil(this.unsubscribe$),
        delay(150),
        tap(() => this.progressBarService.show())
      )
      .subscribe({
        next: (currentData) => {
          this.lineChartDataCurrent.datasets[0].data = currentData;
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

    this.weatherService.pastDays$
      .pipe(
        takeUntil(this.unsubscribe$),
        delay(150),
        tap(() => this.progressBarService.show()),
        switchMap((days) => {
          if (days) {
            return this.weatherService.fetchChartData(
              LondonLocation.latitude,
              LondonLocation.longitude,
              0,
              days
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe({
        next: (historicalData) => {
          this.lineChartDataHistorical.datasets[0].data = historicalData;
        },
        error: (error) => {
          console.error(
            'There was an error fetching historical line chart data:',
            error
          );
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
