import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  BookingDto,
  CreateBookingRequest,
  CreateBookingResponse,
} from '../../models/booking.model';
import {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
} from '../../models/payment.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly bookingsPath = '/api/bookings';
  private readonly paymentsPath = '/api/payments';

  constructor(private readonly api: ApiService) {}

  createBooking(request: CreateBookingRequest): Observable<CreateBookingResponse> {
    return this.api.post<CreateBookingResponse>(this.bookingsPath, request);
  }

  getBooking(bookingId: string): Observable<BookingDto> {
    return this.api.get<BookingDto>(`${this.bookingsPath}/${bookingId}`);
  }

  initiatePayment(request: InitiatePaymentRequest): Observable<InitiatePaymentResponse> {
    return this.api.post<InitiatePaymentResponse>(this.paymentsPath, request);
  }

  simulateCallback(paymentId: string, status: 'Succeeded' | 'Failed') {
    // fire-and-forget; caller can await completion if needed
    return this.api.post<void>(`${this.paymentsPath}/${paymentId}/callback?status=${status}`, {});
  }
}

