import { Routes } from '@angular/router';

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
    ],
  },
  { path: '**', redirectTo: '' },
];
