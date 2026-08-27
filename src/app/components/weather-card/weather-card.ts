import { Component, input } from '@angular/core';
import { Weather } from '../../models/weather.model';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  readonly weather = input.required<Weather>();
}
