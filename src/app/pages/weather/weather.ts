import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Forecast } from '../../components/forecast/forecast';
import { WeatherCard } from '../../components/weather-card/weather-card';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  imports: [WeatherCard, Forecast],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private readonly route = inject(ActivatedRoute);
  protected readonly weatherService = inject(WeatherService);

  readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city'))),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const city = this.city();

      if (city) {
        this.weatherService.loadWeather(city);
        this.weatherService.loadForecast(city);
      }
    });
  }
}
