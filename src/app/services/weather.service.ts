import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { OpenWeatherResponse } from '../models/openweather.model';
import { Weather } from '../models/weather.model';

const METRES_PAR_SECONDE_VERS_KM_H = 3.6;

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  private readonly _currentCity = signal('');
  private readonly _weather = signal<Weather | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal('');

  readonly currentCity = this._currentCity.asReadonly();
  readonly weather = this._weather.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();

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
      iconUrl: `https://openweathermap.org/img/wn/${condition.icon}@2x.png`,
    };
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
