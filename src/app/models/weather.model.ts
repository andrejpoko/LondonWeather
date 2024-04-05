export interface OpenMeteoResponse {
  time: Date;
  weather_description: string;
  temperature_2m: number;
  surface_pressure: number;
  relative_humidity_2m: number;
}

export interface DataChart {
  x: string;
  y: number;
}
