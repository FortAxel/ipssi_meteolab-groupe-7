export interface OpenWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface OpenWeatherWind {
  speed: number;
  deg: number;
}

export interface OpenWeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface OpenWeatherResponse {
  id: number;
  name: string;
  dt: number;
  timezone: number;
  weather: OpenWeatherCondition[];
  main: OpenWeatherMain;
  wind: OpenWeatherWind;
  sys: OpenWeatherSys;
}

export interface OpenWeatherError {
  cod: string | number;
  message: string;
}

export interface OpenWeatherForecastItem {
  dt: number;
  dt_txt: string;
  main: OpenWeatherMain;
  weather: OpenWeatherCondition[];
  wind: OpenWeatherWind;
}

export interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
  city: {
    name: string;
    country: string;
  };
}
