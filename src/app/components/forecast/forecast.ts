import { Component, input } from '@angular/core';
import { ForecastDay } from '../../models/weather.model';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.html',
  styleUrl: './forecast.css',
})
export class Forecast {
  readonly days = input.required<ForecastDay[]>();

  formatDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(localDate);
  }
}
