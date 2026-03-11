import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { BookingService } from './booking.service';
import { BookingDto } from '../../models/booking.model';

@Component({
  selector: 'app-booking-status-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-status-page.component.html',
  styleUrls: ['./booking-status-page.component.scss'],
})
export class BookingStatusPageComponent implements OnInit, OnDestroy {
  booking = signal<BookingDto | null>(null);
  error = signal<string | null>(null);
  private sub?: Subscription;

  isPending = computed(() => this.booking()?.status === 'pending');
  isConfirmed = computed(() => this.booking()?.status === 'confirmed');
  isCancelled = computed(() => this.booking()?.status === 'cancelled');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (!bookingId) {
      this.error.set('Missing booking id');
      return;
    }

    const refresh$ = interval(10_000).pipe(startWith(0));
    this.sub = refresh$
      .pipe(switchMap(() => this.bookingService.getBooking(bookingId)))
      .subscribe({
        next: (data) => this.booking.set(data),
        error: (err) => this.error.set(err?.message ?? 'Failed to load booking'),
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

