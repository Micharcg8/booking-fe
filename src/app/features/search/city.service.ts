import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { City } from '../../models/city.model';

@Injectable({ providedIn: 'root' })
export class CityService {
  private readonly path = '/api/cities';

  constructor(private readonly api: ApiService) {}

  getSuggestions(query: string, limit = 10): Observable<City[]> {
    const q = (query ?? '').trim();
    if (q.length < 2) {
      return new Observable((sub) => {
        sub.next([]);
        sub.complete();
      });
    }
    const params = new URLSearchParams({ query: q, limit: String(limit) });
    return this.api.get<City[]>(`${this.path}?${params.toString()}`);
  }
}
