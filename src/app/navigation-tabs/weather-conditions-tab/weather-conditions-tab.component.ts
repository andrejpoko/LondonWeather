import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, delay, filter, take, takeUntil, tap } from 'rxjs';
import { OpenMeteoResponse } from '../../models/weather.model';
import { ProgressBarService } from '../../shared/progress-bar.service';
import { LondonLocation, WeatherService } from '../../shared/weather.service';

@Component({
  selector: 'app-weather-conditions-tab',
  templateUrl: './weather-conditions-tab.component.html',
  styleUrls: ['./weather-conditions-tab.component.css'],
})
export class WeatherConditionsTabComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  currentData: OpenMeteoResponse[] = [];
  historicalData: OpenMeteoResponse[] = [];
  displayedColumns: string[] = [
    'datetime',
    'weatherState',
    'temperature',
    'surfacePressure',
    'relativeHumidity',
  ];
  panelCurrentOpenState = true;
  panelHistoricalOpenState = false;
  pastDays = new FormControl<number | null>(null, [
    Validators.required,
    Validators.pattern('^[-]?[0-9]*$'),
  ]);

  constructor(
    private weatherService: WeatherService,
    private progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    this.pastDays.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((days) => {
          tap(() => this.progressBarService.show());
          if (days === null || isNaN(Number(days)) || Number(days) <= 0) {
            this.historicalData = [];
            this.progressBarService.hide();
          }
        }),
        filter(
          (days) => days !== null && !isNaN(Number(days)) && Number(days) > 0
        )
      )
      .subscribe({
        next: (days) => {
          this.weatherService.pastDays$.next(days);
          this.weatherService
            .fetchWeatherData(
              LondonLocation.latitude,
              LondonLocation.longitude,
              0,
              Number(days)
            )
            .subscribe((data) => {
              this.historicalData = data;
              this.progressBarService.hide();
            });
        },
        error: (error) => {
          console.error(
            'There was an error fetching historical weather data:',
            error
          );
          this.progressBarService.hide();
        },
        complete: () => {
          this.progressBarService.hide();
        },
      });

    this.weatherService.pastDays$.pipe(take(1)).subscribe((val) => {
      this.pastDays.setValue(val);
    });

    this.weatherService
      .fetchWeatherData(LondonLocation.latitude, LondonLocation.longitude)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.progressBarService.show()),
        delay(150)
      )
      .subscribe({
        next: (data) => {
          this.currentData = data;
        },
        error: (error) => {
          console.error(
            'There was an error fetching the current weather data:',
            error
          );
          this.progressBarService.hide();
        },
        complete: () => {
          this.progressBarService.hide();
        },
      });
  }

  hasPastDays(val: FormControl): string {
    if (val.value && val.value > 0 && !isNaN(Number(val.value))) {
      return val.value.toString();
    } else return 'N/A';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
