import { Component, Input, OnInit } from '@angular/core';
import { OpenMeteoResponse } from '../../../models/weather.model';

@Component({
  selector: 'app-weather-table',
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css'],
})
export class WeatherTableComponent implements OnInit {
  @Input() weatherData: OpenMeteoResponse[] = [];
  displayedColumns: string[] = [
    'datetime',
    'weatherState',
    'temperature',
    'surfacePressure',
    'relativeHumidity',
  ];

  constructor() {}

  ngOnInit() {}
}
