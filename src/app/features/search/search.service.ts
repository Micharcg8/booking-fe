import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { TripOption, TripSearchParams } from '../../models/trip.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly path = '/api/search';

  constructor(private readonly api: ApiService) {}

  search(params: TripSearchParams): Observable<TripOption[]> {
    const query = new URLSearchParams();
    if (params.origin != null && params.origin !== '') query.set('origin', params.origin);
    if (params.destination != null && params.destination !== '') query.set('destination', params.destination);
    if (params.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params.dateTo) query.set('dateTo', params.dateTo);
    if (params.passengers != null) query.set('passengers', String(params.passengers));
    if (params.maxPrice != null) query.set('maxPrice', String(params.maxPrice));
    if (params.travelType) query.set('travelType', params.travelType);
    if (params.provider) query.set('provider', params.provider);

    const qs = query.toString();
    const url = qs ? `${this.path}?${qs}` : this.path;
    return this.api.get<TripOption[]>(url);
  }
}
