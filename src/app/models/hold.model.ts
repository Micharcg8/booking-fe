/**
 * Hold status (aligned with backend HoldStatus enum).
 */
export type HoldStatus = 'Active' | 'Expired' | 'Released' | 'ConvertedToBooking';

/**
 * Hold details from API.
 */
export interface HoldDto {
  holdId: string;
  tripId: string;
  expiresAt: string;
  status: HoldStatus;
}

/**
 * Request to create a hold.
 */
export interface CreateHoldRequest {
  tripId: string;
  passengers?: number;
}

/**
 * Response after creating a hold.
 */
export interface CreateHoldResponse {
  holdId: string;
  tripId: string;
  expiresAt: string;
  status: HoldStatus;
}
