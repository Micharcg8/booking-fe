import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Ensures requests to relative API paths get the base URL.
 * Only prepends baseUrl when the request URL does not already start with http.
 */
export const apiBaseInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http')) {
    return next(req);
  }
  const baseUrl = environment.apiUrl.replace(/\/$/, '');
  const url = req.url.startsWith('/') ? `${baseUrl}${req.url}` : `${baseUrl}/${req.url}`;
  return next(req.clone({ url }));
};
