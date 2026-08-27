import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ForecastDay } from '../../models/weather.model';

@Component({
  selector: 'app-forecast',
  imports: [DecimalPipe, TitleCasePipe],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  readonly days = input.required<ForecastDay[]>();

  iconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
