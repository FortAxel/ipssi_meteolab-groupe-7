import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Weather } from './pages/weather/weather';
import { About } from './pages/about/about';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'weather/:city', component: Weather },
  { path: 'about', component: About },
  { path: '**', redirectTo: 'home' },
];
