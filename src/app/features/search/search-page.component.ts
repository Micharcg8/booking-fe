import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SearchService } from './search.service';
import { TripOption, TripSearchParams } from '../../models/trip.model';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent {
  form: FormGroup;
  results: TripOption[] = [];
  loading = false;
  error: string | null = null;
  searched = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly searchService: SearchService
  ) {
    this.form = this.fb.group({
      origin: [''],
      destination: [''],
      dateFrom: [''],
      dateTo: [''],
      passengers: [1],
      maxPrice: [null as number | null],
      travelType: [''],
      provider: [''],
    });
  }

  onSubmit(): void {
    this.error = null;
    this.searched = true;
    this.loading = true;

    const raw = this.form.getRawValue();
    const params: TripSearchParams = {
      origin: raw.origin || undefined,
      destination: raw.destination || undefined,
      dateFrom: raw.dateFrom || undefined,
      dateTo: raw.dateTo || undefined,
      passengers: raw.passengers ?? undefined,
      maxPrice: raw.maxPrice ?? undefined,
      travelType: raw.travelType || undefined,
      provider: raw.provider || undefined,
    };

    this.searchService.search(params).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Search failed';
        this.results = [];
        this.loading = false;
      },
    });
  }
}
