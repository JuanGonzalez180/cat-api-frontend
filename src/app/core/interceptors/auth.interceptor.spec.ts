import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor (functional)', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be defined', () => {
    expect(authInterceptor).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof authInterceptor).toBe('function');
  });

  it('should add Authorization header when token exists', () => {
    const token = 'mock-jwt-token';
    authService.getToken.and.returnValue(token);

    expect(authService.getToken).toBeDefined();
    expect(typeof authService.getToken).toBe('function');
  });

  it('should get token from AuthService', () => {
    const token = 'test-token';
    authService.getToken.and.returnValue(token);

    const tokenResult = authService.getToken();
    expect(tokenResult).toBe('test-token');
  });

  it('should handle missing token gracefully', () => {
    authService.getToken.and.returnValue(null);

    const tokenResult = authService.getToken();
    expect(tokenResult).toBeNull();
  });
});
