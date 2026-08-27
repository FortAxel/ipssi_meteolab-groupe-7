import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CurrentWeather, ForecastDay } from '../models/weather.model';

interface OpenWeatherCurrentResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface OpenWeatherForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  getCurrentWeather(city: string): Observable<CurrentWeather> {
    return this.http
      .get<OpenWeatherCurrentResponse>(`${environment.openWeatherBaseUrl}/weather`, {
        params: this.buildParams(city),
      })
      .pipe(
        map((response) => this.mapCurrentWeather(response)),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
      );
  }

  getForecast(city: string): Observable<ForecastDay[]> {
    return this.http
      .get<OpenWeatherForecastResponse>(`${environment.openWeatherBaseUrl}/forecast`, {
        params: this.buildParams(city),
      })
      .pipe(
        map((response) => this.mapForecast(response)),
        catchError((error: HttpErrorResponse) => this.handleError(error)),
      );
  }

  private buildParams(city: string): HttpParams {
    return new HttpParams()
      .set('q', city)
      .set('appid', environment.openWeatherApiKey)
      .set('units', 'metric')
      .set('lang', 'fr');
  }

  private mapCurrentWeather(response: OpenWeatherCurrentResponse): CurrentWeather {
    return {
      city: response.name,
      country: response.sys.country,
      temperature: response.main.temp,
      feelsLike: response.main.feels_like,
      description: response.weather[0]?.description ?? '',
      humidity: response.main.humidity,
      windSpeed: Math.round(response.wind.speed * 3.6),
      icon: response.weather[0]?.icon ?? '01d',
    };
  }

  private mapForecast(response: OpenWeatherForecastResponse): ForecastDay[] {
    const days = new Map<string, OpenWeatherForecastItem[]>();

    for (const item of response.list) {
      const date = item.dt_txt.slice(0, 10);
      const items = days.get(date) ?? [];
      items.push(item);
      days.set(date, items);
    }

    return Array.from(days.entries())
      .slice(0, 5)
      .map(([date, items]) => {
        const temps = items.map((item) => item.main.temp);
        const midday = items.find((item) => item.dt_txt.endsWith('12:00:00')) ?? items[Math.floor(items.length / 2)];

        return {
          date,
          label: new Date(`${date}T00:00:00`).toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
          }),
          minTemp: Math.min(...temps),
          maxTemp: Math.max(...temps),
          description: midday.weather[0]?.description ?? '',
          icon: midday.weather[0]?.icon ?? '01d',
        };
      });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      return throwError(() => new Error('Ville introuvable.'));
    }
    if (error.status === 429) {
      return throwError(() => new Error('Trop de requêtes, veuillez réessayer dans quelques instants.'));
    }
    return throwError(() => new Error('Impossible de récupérer les données météo.'));
  }
}
