import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Api } from './api';
import {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  SignupRequest,
} from '../../shared/models/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly api = inject(Api);
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user_data';

  protected readonly isAuthenticated = signal<boolean>(this.hasToken());
  protected readonly currentUser = signal<AuthResponse['user'] | null>(
    this.getStoredUser()
  );

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        this.setAuthData(response);
      })
    );
  }

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/auth/signup', data).pipe(
      tap((response) => {
        this.setAuthData(response);
      })
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.api.post<ForgotPasswordResponse>('/api/auth/forgot-password', data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.isAuthenticated.set(true);
    this.currentUser.set(response.user);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private getStoredUser(): AuthResponse['user'] | null {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }
}
