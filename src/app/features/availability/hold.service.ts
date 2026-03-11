import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  HoldDto,
  CreateHoldRequest,
  CreateHoldResponse,
} from '../../models/hold.model';

@Injectable({ providedIn: 'root' })
export class HoldService {
  private readonly holdsPath = '/api/holds';

  constructor(private readonly api: ApiService) {}

  createHold(request: CreateHoldRequest): Observable<CreateHoldResponse> {
    return this.api.post<CreateHoldResponse>(this.holdsPath, request);
  }

  getHold(holdId: string): Observable<HoldDto> {
    return this.api.get<HoldDto>(`${this.holdsPath}/${holdId}`);
  }

  releaseHold(holdId: string): Observable<void> {
    return this.api.delete<void>(`${this.holdsPath}/${holdId}`);
  }
}
