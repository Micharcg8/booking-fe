import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface TokenResponse {
  token: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const stored = sessionStorage.getItem('booking_token');
    if (stored) this.token = stored;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  login(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/api/auth/token', {}).pipe(
      tap((res) => {
        this.token = res.token;
        sessionStorage.setItem('booking_token', res.token);
      })
    );
  }

  logout(): void {
    this.token = null;
    sessionStorage.removeItem('booking_token');
    this.router.navigate(['/search']);
  }
}
