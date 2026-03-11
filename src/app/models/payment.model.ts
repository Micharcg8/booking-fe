export interface InitiatePaymentRequest {
  bookingId: string;
  amount: number;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  bookingId: string;
  status: string;
  redirectUrl: string;
}

