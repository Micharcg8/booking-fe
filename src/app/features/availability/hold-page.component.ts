import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { HoldService } from './hold.service';
import { HoldDto, HoldStatus } from '../../models/hold.model';
import { BookingService } from '../booking/booking.service';

@Component({
  selector: 'app-hold-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hold-page.component.html',
  styleUrls: ['./hold-page.component.scss'],
})
export class HoldPageComponent implements OnInit, OnDestroy {
  hold = signal<HoldDto | null>(null);
  error = signal<string | null>(null);
  private sub?: Subscription;

  expiresAtFormatted = computed(() => {
    const h = this.hold();
    if (!h?.expiresAt) return '';
    const d = new Date(h.expiresAt);
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  });

  isExpired = computed(() => this.hold()?.status === 'Expired');
  isActive = computed(() => this.hold()?.status === 'Active');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly holdService: HoldService,
    private readonly bookingService: BookingService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const holdId = this.route.snapshot.paramMap.get('holdId');
    if (!holdId) {
      this.error.set('Missing hold id');
      return;
    }

    const refresh$ = interval(10_000).pipe(startWith(0));
    this.sub = refresh$
      .pipe(switchMap(() => this.holdService.getHold(holdId)))
      .subscribe({
        next: (data) => this.hold.set(data),
        error: (err) => this.error.set(err?.message ?? 'Failed to load hold'),
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onCreateBooking(): void {
    const current = this.hold();
    if (!current) {
      return;
    }

    const request = {
      tripId: current.tripId,
      holdId: current.holdId,
      customerName: 'Test User',
      customerEmail: 'test@example.com',
    };

    this.bookingService.createBooking(request).subscribe({
      next: async (created) => {
        // fire payment initiation + success callback, then navigate to booking status
        const payment = await this.bookingService
          .initiatePayment({ bookingId: created.bookingId, amount: 100 })
          .toPromise();
        if (payment?.paymentId) {
          await this.bookingService.simulateCallback(payment.paymentId, 'Succeeded').toPromise();
        }
        this.router.navigate(['/booking', created.bookingId]);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to create booking');
      },
    });
  }
}
