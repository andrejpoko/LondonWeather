import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, delay, takeUntil } from 'rxjs';
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

  constructor(
    private weatherService: WeatherService,
    private progressBarService: ProgressBarService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.progressBarService.show();
    });

    const current$ = this.weatherService.fetchWeatherData(
      LondonLocation.latitude,
      LondonLocation.longitude
    );
    const historical$ = this.weatherService.fetchWeatherData(
      LondonLocation.latitude,
      LondonLocation.longitude,
      0,
      3
    );

    combineLatest([current$, historical$])
      .pipe(takeUntil(this.unsubscribe$), delay(150)) // Simulate delay
      .subscribe({
        next: ([current, historical]) => {
          this.currentData = current;
          this.historicalData = historical;
        },
        error: (error) => {
          console.error('There was an error fetching the weather data:', error);
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
