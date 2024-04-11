import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataChart, OpenMeteoResponse } from '../models/weather.model';
import { weatherCodeMapping } from './wmo-mapping';

export enum LondonLocation {
  latitude = 51.5085,
  longitude = -0.1257,
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private _apiUrl = 'https://api.open-meteo.com/v1/forecast';
  pastDays$ = new BehaviorSubject<number | null>(3);

  constructor(private http: HttpClient) {}

  fetchWeatherData(
    latitude: number,
    longitude: number,
    forecastDays?: number,
    pastDays?: number
  ): Observable<OpenMeteoResponse[]> {
    let params: any = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'weather_code',
        'surface_pressure',
      ].join(),
    };

    if (pastDays !== undefined) {
      params.past_days = pastDays;
    }

    if (forecastDays !== undefined) {
      params.forecast_days = forecastDays;
    }

    return this.http.get<any>(this._apiUrl, { params }).pipe(
      map((response) => {
        const weatherCodes = response.hourly.weather_code || [];
        const weatherDescriptions = weatherCodes.map(
          (code: number) => weatherCodeMapping[code] || 'Unknown weather code'
        );

        return response.hourly.time.map((time: string, index: number) => ({
          time: new Date(time),
          temperature_2m: response.hourly.temperature_2m[index],
          weather_description: weatherDescriptions[index],
          surface_pressure: response.hourly.surface_pressure[index],
          relative_humidity_2m: response.hourly.relative_humidity_2m[index],
        }));
      })
    );
  }

  fetchChartData(
    latitude: number,
    longitude: number,
    forecastDays?: number,
    pastDays?: number
  ): Observable<DataChart[]> {
    let params: any = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'weather_code',
        'surface_pressure',
      ].join(),
    };

    if (pastDays !== undefined) {
      params.past_days = pastDays;
    }

    if (forecastDays !== undefined) {
      params.forecast_days = forecastDays;
    }

    return this.http.get<any>(this._apiUrl, { params }).pipe(
      map((response) => {
        const data: DataChart[] = response.hourly.time.map(
          (time: string, index: number): DataChart => ({
            x: time,
            y: response.hourly.temperature_2m[index],
          })
        );

        return data;
      })
    );
  }
}
