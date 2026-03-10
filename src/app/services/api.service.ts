import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Base API service. All backend calls should go through services that use relative paths;
 * apiBaseInterceptor adds the environment apiUrl.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  getBaseUrl(): string {
    return environment.apiUrl;
  }

  get<T>(path: string, options?: object): Observable<T> {
    const url = path.startsWith('/') ? path : `/${path}`;
    return this.http.get<T>(url, options);
  }

  post<T>(path: string, body: unknown, options?: object): Observable<T> {
    const url = path.startsWith('/') ? path : `/${path}`;
    return this.http.post<T>(url, body, options);
  }

  put<T>(path: string, body: unknown, options?: object): Observable<T> {
    const url = path.startsWith('/') ? path : `/${path}`;
    return this.http.put<T>(url, body, options);
  }

  delete<T>(path: string, options?: object): Observable<T> {
    const url = path.startsWith('/') ? path : `/${path}`;
    return this.http.delete<T>(url, options);
  }
}
