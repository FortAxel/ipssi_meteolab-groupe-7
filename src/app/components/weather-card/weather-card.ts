import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CurrentWeather } from '../../models/weather.model';

@Component({
  selector: 'app-weather-card',
  imports: [DecimalPipe, TitleCasePipe],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  readonly weather = input.required<CurrentWeather>();

  readonly iconUrl = computed(() => `https://openweathermap.org/img/wn/${this.weather().icon}@2x.png`);
}
