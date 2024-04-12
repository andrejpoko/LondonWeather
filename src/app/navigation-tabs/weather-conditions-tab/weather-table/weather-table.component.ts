import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpenMeteoResponse } from '../../../models/weather.model';

@Component({
  selector: 'app-weather-table',
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css'],
})
export class WeatherTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() weatherData: OpenMeteoResponse[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource = new MatTableDataSource<OpenMeteoResponse>([]);
  displayedColumns: string[] = [
    'datetime',
    'weatherState',
    'temperature',
    'surfacePressure',
    'relativeHumidity',
  ];

  constructor() {}

  ngOnInit() {
    this.dataSource.sortingDataAccessor = (data, property) => {
      switch (property) {
        case 'datetime':
          return new Date(data.time).toISOString();
        case 'weatherState':
          return data.weather_description;
        case 'temperature':
          return data.temperature_2m;
        case 'surfacePressure':
          return data.surface_pressure;
        case 'relativeHumidity':
          return data.relative_humidity_2m;
        default:
          return data[property as keyof OpenMeteoResponse];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['weatherData'] && changes['weatherData'].currentValue) {
      this.dataSource.data = this.weatherData;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
