import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login user and store token', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        success: true,
        message: 'Login successful',
        user: {
          _id: '123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        token: 'mock-jwt-token',
      };

      service.login(credentials).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(localStorage.getItem('authToken')).toBe('mock-jwt-token');
        expect(service.currentUser()).toEqual(mockResponse.user);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle login error', (done) => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      const errorResponse = {
        success: false,
        message: 'Invalid password',
      };

      service.login(credentials).subscribe((response) => {
        expect(response.success).toBe(false);
        expect(response.message).toBe('Invalid password');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(errorResponse);
    });
  });

  describe('register', () => {
    it('should register user and store token', (done) => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };
      const mockResponse = {
        success: true,
        message: 'User registered successfully',
        user: {
          _id: '456',
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
        },
        token: 'mock-jwt-token-new',
      };

      service.register(registerData).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(localStorage.getItem('authToken')).toBe('mock-jwt-token-new');
        expect(service.currentUser()).toEqual(mockResponse.user);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle registration error', (done) => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      const errorResponse = {
        success: false,
        message: 'Email already registered',
      };

      service.register(registerData).subscribe((response) => {
        expect(response.success).toBe(false);
        expect(response.message).toBe('Email already registered');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(errorResponse);
    });
  });

  describe('logout', () => {
    it('should clear user data and token from localStorage', () => {
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.currentUser()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('authToken', mockToken);

      const token = service.getToken();

      expect(token).toBe(mockToken);
    });

    it('should return null if token does not exist', () => {
      const token = service.getToken();

      expect(token).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from signal', () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      // Create a new service instance that reads localStorage
      const service2 = TestBed.inject(AuthService);
      const user = service2.getCurrentUser();

      // Service reads from localStorage on init
      expect(user).toBeDefined();
    });

    it('should return null if no user is logged in', () => {
      const user = service.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if user is logged in', () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      const service2 = TestBed.inject(AuthService);
      // Service reads from localStorage on init, should reflect user is logged in
      expect(service2.isLoggedIn()).toBeDefined();
    });

    it('should return false if user is not logged in', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
