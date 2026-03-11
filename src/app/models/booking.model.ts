export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export interface CreateBookingRequest {
  tripId: string;
  holdId: string;
  customerName: string;
  customerEmail: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  status: BookingStatus;
}

export interface BookingDto {
  bookingId: string;
  tripId: string;
  holdId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

