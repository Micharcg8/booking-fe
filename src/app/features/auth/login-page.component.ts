import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `
    <div class="login">
      <h1>Sign in</h1>
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      <button type="button" (click)="login()" [disabled]="loading">
        {{ loading ? 'Signing in…' : 'Get token (dev)' }}
      </button>
    </div>
  `,
  styles: [
    `
      .login { max-width: 20rem; margin-top: 2rem; }
      .error { color: #c00; margin-bottom: 0.5rem; }
      button { padding: 0.5rem 1rem; background: #1a1a2e; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
      button:disabled { opacity: 0.6; cursor: not-allowed; }
    `,
  ],
})
export class LoginPageComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  login(): void {
    this.error = null;
    this.loading = true;
    this.auth.login().subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/search';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Login failed';
      },
    });
  }
}
