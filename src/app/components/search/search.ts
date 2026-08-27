import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  readonly citySearch = output<string>();

  readonly form = inject(FormBuilder).nonNullable.group({
    city: ['', [Validators.required, Validators.minLength(2)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.citySearch.emit(this.form.getRawValue().city.trim());
    this.form.reset();
  }

  get cityInvalid(): boolean {
    const ctrl = this.form.controls.city;
    return ctrl.invalid && ctrl.touched;
  }
}
