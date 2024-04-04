import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { OpenMeteoResponse } from '../../models/weather.model';
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

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
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
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ([current, historical]) => {
          this.currentData = current.hourly;
          this.historicalData = historical.hourly;
        },
        error: (error) => {
          console.error('There was an error fetching the weather data:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
