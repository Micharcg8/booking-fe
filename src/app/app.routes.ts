import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'search' },
      {
        path: 'search',
        loadChildren: () => import('./features/search/search.routes').then((m) => m.searchRoutes),
      },
      {
        path: 'hold/:holdId',
        loadComponent: () =>
          import('./features/availability/hold-page.component').then((m) => m.HoldPageComponent),
        canActivate: [authGuard],
      },
      {
        path: 'booking/:bookingId',
        loadComponent: () =>
          import('./features/booking/booking-status-page.component').then(
            (m) => m.BookingStatusPageComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login-page.component').then((m) => m.LoginPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
