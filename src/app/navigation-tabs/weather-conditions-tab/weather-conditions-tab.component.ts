import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  Subject,
  combineLatest,
  debounceTime,
  delay,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
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
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private weatherService: WeatherService,
    private progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    this.range.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        tap(() => this.progressBarService.show()),
        switchMap(({ start, end }) => {
          if (start && end) {
            this.weatherService.startDate$.next(start);
            this.weatherService.endDate$.next(end);

            return this.weatherService.fetchWeatherData(
              LondonLocation.latitude,
              LondonLocation.longitude,
              start,
              end
            );
          } else return of([]);
        })
      )
      .subscribe({
        next: (data: OpenMeteoResponse[]) => {
          this.historicalData = data;
          this.progressBarService.hide();
        },
        error: (error) => {
          console.error(
            'There was an error fetching the historical weather data:',
            error
          );
          this.progressBarService.hide();
        },
        complete: () => {
          this.progressBarService.hide();
        },
      });

    this.weatherService
      .fetchWeatherData(LondonLocation.latitude, LondonLocation.longitude)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.progressBarService.show()),
        delay(150)
      )
      .subscribe({
        next: (data: OpenMeteoResponse[]) => {
          this.currentData = data;
          this.progressBarService.hide();
        },
        error: (error) => {
          console.error('There was an error fetching the weather data:', error);
          this.progressBarService.hide();
        },
        complete: () => {
          this.progressBarService.hide();
        },
      });

    combineLatest([
      this.weatherService.startDate$,
      this.weatherService.endDate$,
    ])
      .pipe(take(1))
      .subscribe(([startDate, endDate]) => {
        if (startDate !== null) {
          this.range.get('start')?.setValue(new Date(startDate));
        }
        if (endDate !== null) {
          this.range.get('end')?.setValue(new Date(endDate));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
