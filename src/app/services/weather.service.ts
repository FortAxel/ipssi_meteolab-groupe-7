import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  OpenWeatherForecastItem,
  OpenWeatherForecastResponse,
  OpenWeatherResponse,
} from '../models/openweather.model';
import { ForecastDay, Weather } from '../models/weather.model';

const METRES_PAR_SECONDE_VERS_KM_H = 3.6;
const JOURS_DE_PREVISION = 5;

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  private readonly _currentCity = signal('');
  private readonly _weather = signal<Weather | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal('');

  private readonly _forecast = signal<ForecastDay[]>([]);
  private readonly _isForecastLoading = signal(false);
  private readonly _forecastErrorMessage = signal('');

  readonly currentCity = this._currentCity.asReadonly();
  readonly weather = this._weather.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();

  readonly forecast = this._forecast.asReadonly();
  readonly isForecastLoading = this._isForecastLoading.asReadonly();
  readonly forecastErrorMessage = this._forecastErrorMessage.asReadonly();

  loadWeather(city: string): void {
    const cleanCity = city.trim();

    if (!cleanCity) {
      return;
    }

    this._currentCity.set(cleanCity);
    this._isLoading.set(true);
    this._errorMessage.set('');

    this.fetchWeather(cleanCity).subscribe({
      next: (weather) => {
        this._weather.set(weather);
        this._isLoading.set(false);
      },
      error: (error: Error) => {
        this._weather.set(null);
        this._errorMessage.set(error.message);
        this._isLoading.set(false);
      },
    });
  }

  loadForecast(city: string): void {
    const cleanCity = city.trim();

    if (!cleanCity) {
      return;
    }

    this._isForecastLoading.set(true);
    this._forecastErrorMessage.set('');

    this.fetchForecast(cleanCity).subscribe({
      next: (forecast) => {
        this._forecast.set(forecast);
        this._isForecastLoading.set(false);
      },
      error: (error: Error) => {
        this._forecast.set([]);
        this._forecastErrorMessage.set(error.message);
        this._isForecastLoading.set(false);
      },
    });
  }

  fetchWeather(city: string): Observable<Weather> {
    const url = `${environment.openWeatherBaseUrl}/weather`;

    return this.http
      .get<OpenWeatherResponse>(url, {
        params: {
          q: city,
          appid: environment.openWeatherApiKey,
          units: 'metric',
          lang: 'fr',
        },
      })
      .pipe(
        map((response) => this.toWeather(response)),
        catchError((error: HttpErrorResponse) => throwError(() => new Error(this.toMessage(error)))),
      );
  }

  fetchForecast(city: string): Observable<ForecastDay[]> {
    const url = `${environment.openWeatherBaseUrl}/forecast`;

    return this.http
      .get<OpenWeatherForecastResponse>(url, {
        params: {
          q: city,
          appid: environment.openWeatherApiKey,
          units: 'metric',
          lang: 'fr',
        },
      })
      .pipe(
        map((response) => this.toForecastDays(response)),
        catchError((error: HttpErrorResponse) => throwError(() => new Error(this.toMessage(error)))),
      );
  }

  private toWeather(response: OpenWeatherResponse): Weather {
    const condition = response.weather[0];

    return {
      city: response.name,
      country: response.sys.country,
      temperature: Math.round(response.main.temp),
      feelsLike: Math.round(response.main.feels_like),
      description: condition.description,
      humidity: response.main.humidity,
      windSpeed: Math.round(response.wind.speed * METRES_PAR_SECONDE_VERS_KM_H),
      iconUrl: this.toIconUrl(condition.icon),
    };
  }

  private toForecastDays(response: OpenWeatherForecastResponse): ForecastDay[] {
    const itemsByDate = new Map<string, OpenWeatherForecastItem[]>();

    for (const item of response.list) {
      const date = item.dt_txt.split(' ')[0];
      const items = itemsByDate.get(date) ?? [];
      items.push(item);
      itemsByDate.set(date, items);
    }

    return Array.from(itemsByDate.entries())
      .slice(0, JOURS_DE_PREVISION)
      .map(([date, items]) => this.toForecastDay(date, items));
  }

  private toForecastDay(date: string, items: OpenWeatherForecastItem[]): ForecastDay {
    const temperatures = items.map((item) => item.main.temp);
    const middayItem = items.find((item) => item.dt_txt.endsWith('12:00:00')) ?? items[Math.floor(items.length / 2)];
    const condition = middayItem.weather[0];

    return {
      date,
      minTemp: Math.round(Math.min(...temperatures)),
      maxTemp: Math.round(Math.max(...temperatures)),
      description: condition.description,
      iconUrl: this.toIconUrl(condition.icon),
    };
  }

  private toIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  private toMessage(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'Ville introuvable.';
    }

    if (error.status === 429) {
      return 'Trop de requêtes, veuillez réessayer dans quelques instants.';
    }

    return 'Impossible de récupérer les données météo.';
  }
}
