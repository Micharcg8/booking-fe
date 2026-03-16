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
        <section class="card card-animated">
          <router-outlet></router-outlet>
        </section>
      </main>
      <footer class="footer">
        <span>Booking &copy; {{ year }}</span>
      </footer>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: rgba(3, 7, 18, 0.85);
      color: #f9fafb;
      backdrop-filter: blur(12px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    }

    .brand {
      font-weight: 700;
      font-size: 1.3rem;
      letter-spacing: 0.03em;
    }

    nav a,
    nav .link-btn {
      color: #e5e7eb;
      text-decoration: none;
      margin-left: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      font: inherit;
      opacity: 0.8;
      transition: opacity 0.2s ease, border-bottom-color 0.2s ease, color 0.2s ease;
      border-bottom: 2px solid transparent;
      padding-bottom: 2px;
    }

    nav a:hover,
    nav .link-btn:hover,
    nav a.active {
      opacity: 1;
      color: #ffffff;
      border-bottom-color: #4f46e5;
    }

    .main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.5rem;
    }

    .card {
      width: 100%;
      max-width: 960px;
      background: rgba(15, 23, 42, 0.72);
      border-radius: 18px;
      padding: 2rem 2.5rem;
      box-shadow:
        0 24px 60px rgba(15, 23, 42, 0.75),
        0 0 0 1px rgba(148, 163, 184, 0.2);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(148, 163, 184, 0.35);
      color: #f9fafb;
    }

    .card-animated {
      opacity: 0;
      transform: translateY(14px);
      animation: card-enter 280ms ease-out forwards;
    }

    .footer {
      padding: 0.75rem 1.5rem;
      background: rgba(15, 23, 42, 0.9);
      color: #9ca3af;
      font-size: 0.82rem;
      text-align: center;
      backdrop-filter: blur(12px);
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
    }

    @keyframes card-enter {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class ShellComponent {
  year = new Date().getFullYear();
  constructor(public auth: AuthService) {}
}
