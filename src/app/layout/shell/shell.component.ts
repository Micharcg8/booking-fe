import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="header">
        <span class="brand">Booking</span>
        <nav>
          <a routerLink="/search" routerLinkActive="active">Search</a>
          @if (auth.isAuthenticated()) {
            <button type="button" class="link-btn" (click)="auth.logout()">Logout</button>
          } @else {
            <a routerLink="/login">Login</a>
          }
        </nav>
      </header>
      <main class="main">
        <router-outlet></router-outlet>
      </main>
      <footer class="footer">
        <span>Booking &copy; {{ year }}</span>
      </footer>
    </div>
  `,
  styles: [`
    .shell { display: flex; flex-direction: column; min-height: 100vh; }
    .header {
      display: flex; align-items: center; gap: 1.5rem; padding: 0.75rem 1.5rem;
      background: #1a1a2e; color: #eee;
    }
    .brand { font-weight: 700; font-size: 1.25rem; }
    nav a, nav .link-btn { color: #aaa; text-decoration: none; margin-right: 1rem; background: none; border: none; cursor: pointer; font: inherit; }
    nav a:hover, nav a.active { color: #fff; }
    .main { flex: 1; padding: 1.5rem; }
    .footer { padding: 0.75rem 1.5rem; background: #16213e; color: #888; font-size: 0.875rem; }
  `],
})
export class ShellComponent {
  year = new Date().getFullYear();
  constructor(public auth: AuthService) {}
}
