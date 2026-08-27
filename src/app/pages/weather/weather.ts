import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, concat, forkJoin, map, of, switchMap } from 'rxjs';
import { Forecast } from '../../components/forecast/forecast';
import { WeatherCard } from '../../components/weather-card/weather-card';
import { CurrentWeather, ForecastDay } from '../../models/weather.model';
import { WeatherService } from '../../services/weather.service';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; weather: CurrentWeather; forecast: ForecastDay[] }
  | { status: 'error'; message: string };

@Component({
  selector: 'app-weather',
  imports: [WeatherCard, Forecast],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private readonly route = inject(ActivatedRoute);
  private readonly weatherService = inject(WeatherService);

  readonly city = toSignal(this.route.paramMap.pipe(map((params) => params.get('city'))), {
    initialValue: null,
  });

  private static readonly idleState: WeatherState = { status: 'idle' };

  private readonly state = toSignal(
    toObservable(this.city).pipe(
      switchMap((city): Observable<WeatherState> => {
        if (!city) {
          return of(Weather.idleState);
        }

        return concat(
          of<WeatherState>({ status: 'loading' }),
          forkJoin({
            weather: this.weatherService.getCurrentWeather(city),
            forecast: this.weatherService.getForecast(city),
          }).pipe(
            map((result): WeatherState => ({ status: 'success', ...result })),
            catchError((error: Error) => of<WeatherState>({ status: 'error', message: error.message })),
          ),
        );
      }),
    ),
    { initialValue: Weather.idleState },
  );

  readonly isLoading = computed(() => this.state().status === 'loading');

  readonly errorMessage = computed(() => {
    const state = this.state();
    return state.status === 'error' ? state.message : null;
  });

  readonly weather = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.weather : null;
  });

  readonly forecastDays = computed(() => {
    const state = this.state();
    return state.status === 'success' ? state.forecast : null;
  });
}
