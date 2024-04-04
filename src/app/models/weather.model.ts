export interface OpenMeteoResponse {
  time: string;
  weather_description: string;
  temperature_2m: number;
  surface_pressure: number;
  relative_humidity_2m: number;
}
