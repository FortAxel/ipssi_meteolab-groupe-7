import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  private readonly route = inject(ActivatedRoute);

  readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city'))),
    { initialValue: null },
  );
}
