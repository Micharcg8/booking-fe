import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from './search.service';
import { HoldService } from '../availability/hold.service';
import { CityService } from './city.service';
import { TripOption, TripSearchParams } from '../../models/trip.model';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  form: FormGroup;
  results: TripOption[] = [];
  loading = false;
  error: string | null = null;
  searched = false;
  holdLoadingId: string | null = null;

  originSuggestions: City[] = [];
  destinationSuggestions: City[] = [];
  showOriginDropdown = false;
  showDestinationDropdown = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly originQuery$ = new Subject<string>();
  private readonly destinationQuery$ = new Subject<string>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly searchService: SearchService,
    private readonly holdService: HoldService,
    private readonly cityService: CityService,
    private readonly router: Router
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

  ngOnInit(): void {
    this.originQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => this.cityService.getSuggestions(q)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((list) => {
        this.originSuggestions = list;
        const current = (this.form.get('origin')?.value ?? '').trim();
        const exactMatch = list.some((c) => c.code === current || c.name.toLowerCase() === current.toLowerCase());
        this.showOriginDropdown = list.length > 0 && !exactMatch;
      });

    this.destinationQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => this.cityService.getSuggestions(q)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((list) => {
        this.destinationSuggestions = list;
        const current = (this.form.get('destination')?.value ?? '').trim();
        const exactMatch = list.some((c) => c.code === current || c.name.toLowerCase() === current.toLowerCase());
        this.showDestinationDropdown = list.length > 0 && !exactMatch;
      });

    this.form.get('origin')?.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => {
      this.originQuery$.next((v ?? '') as string);
    });
    this.form.get('destination')?.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => {
      this.destinationQuery$.next((v ?? '') as string);
    });
  }

  onOriginInput(): void {
    const v = this.form.get('origin')?.value ?? '';
    this.originQuery$.next(v);
  }

  onDestinationInput(): void {
    const v = this.form.get('destination')?.value ?? '';
    this.destinationQuery$.next(v);
  }

  selectOrigin(city: City): void {
    this.form.patchValue({ origin: city.code });
    this.originSuggestions = [];
    this.showOriginDropdown = false;
  }

  selectDestination(city: City): void {
    this.form.patchValue({ destination: city.code });
    this.destinationSuggestions = [];
    this.showDestinationDropdown = false;
  }

  hideOriginDropdown(): void {
    setTimeout(() => (this.showOriginDropdown = false), 150);
  }

  hideDestinationDropdown(): void {
    setTimeout(() => (this.showDestinationDropdown = false), 150);
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

  onHold(trip: TripOption): void {
    const passengers = this.form.get('passengers')?.value ?? 1;
    this.holdLoadingId = trip.id;
    this.holdService.createHold({ tripId: trip.id, passengers }).subscribe({
      next: (res) => {
        this.holdLoadingId = null;
        this.router.navigate(['/hold', res.holdId]);
      },
      error: (err) => {
        this.holdLoadingId = null;
        this.error = err?.message ?? 'Failed to create hold';
      },
    });
  }
}
