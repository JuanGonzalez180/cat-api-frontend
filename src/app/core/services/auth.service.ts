import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  public currentUser = this.currentUserSignal.asReadonly();
  public isLoggedInSignal = computed(() => this.currentUserSignal() !== null);

  /**
   * Login user with email and password
   * @param {LoginRequest} credentials - User email and password
   * @returns {Observable} Observable with auth response
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`, credentials)
      .pipe(
        tap((response) => {
          if (response.success && response.user && response.token) {
            this.setUser(response.user, response.token);
          }
        })
      );
  }

  /**
   * Register a new user
   * @param {RegisterRequest} data - User registration data
   * @returns {Observable} Observable with auth response
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.REGISTER}`, data)
      .pipe(
        tap((response) => {
          if (response.success && response.user && response.token) {
            this.setUser(response.user, response.token);
          }
        })
      );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    this.currentUserSignal.set(null);
  }

  /**
   * Get the currently logged in user
   * @returns {User|null} Current user or null if not logged in
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isLoggedInSignal();
  }

  /**
   * Get the JWT token from storage
   * @returns {string|null} JWT token or null if not available
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Set user data and token in signal and localStorage
   * @param {User} user - User data to store
   * @param {string} token - JWT token to store
   */
  private setUser(user: User, token: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    this.currentUserSignal.set(user);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }
}
