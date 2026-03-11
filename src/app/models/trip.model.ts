/**
 * Trip option returned by the search API (aligned with backend TripOptionDto).
 */
export interface TripOption {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  travelType?: string;
  provider?: string;
}

/**
 * Search request params (query string).
 */
export interface TripSearchParams {
  origin?: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  passengers?: number;
  maxPrice?: number;
  travelType?: string;
  provider?: string;
}
