export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  label: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
}
