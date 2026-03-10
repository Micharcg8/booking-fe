import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Global HTTP error handling. Logs and rethrows; can be extended to show toasts or set app error state.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.error('HTTP error', err.status, err.message, req.url);
      return throwError(() => err);
    })
  );
};
