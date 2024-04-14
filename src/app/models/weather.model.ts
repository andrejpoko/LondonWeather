export interface OpenMeteoResponse {
  time: string;
  weather_description: string;
  temperature_2m: number;
  surface_pressure: number;
  relative_humidity_2m: number;
}

export interface DataChart {
  x: string;
  y: number;
}

export interface ChartJsData {
  datasets: [
    {
      data: DataChart[];
      label: string;
    }
  ];
}
