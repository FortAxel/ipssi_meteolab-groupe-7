import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Search } from '../../components/search/search';

@Component({
  imports: [Search],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly router = inject(Router);

  navigateToWeather(city: string): void {
    this.router.navigate(['/weather', city]);
  }
}
