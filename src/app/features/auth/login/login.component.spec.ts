import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        CardModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values and validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have email and password validators', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');
    expect(component.loginForm.invalid).toBe(true);

    emailControl?.setValue('invalid-email');
    passwordControl?.setValue('123456');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('123456');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.patchValue({
      email: 'invalid-email',
      password: '123',
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should set isLoading to true when submitting', () => {
    const mockResponse = {
      success: true,
      message: 'Login successful',
      user: {
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      token: 'mock-token',
    };

    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(true);
  });

  it('should login user and navigate to breeds page on success', (done) => {
    const mockResponse = {
      success: true,
      message: 'Login successful',
      user: {
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      token: 'mock-token',
    };

    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.BREEDS]);
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBeNull();
      done();
    }, 100);
  });

  it('should set error message on login failure', (done) => {
    const mockResponse = {
      success: false,
      message: 'Invalid email or password',
    };

    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage()).toBe('Invalid email or password');
      expect(component.isLoading()).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should set error message on login error', (done) => {
    authService.login.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage()).toBe('Login failed. Please try again.');
      expect(component.isLoading()).toBe(false);
      done();
    }, 100);
  });

  it('should clear error message when submitting', () => {
    const mockResponse = {
      success: true,
      message: 'Login successful',
      user: {
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      token: 'mock-token',
    };

    authService.login.and.returnValue(of(mockResponse));

    component.errorMessage.set('Previous error');
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage()).toBeNull();
  });

  it('should navigate to register page on goToRegister()', () => {
    component.goToRegister();

    expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.REGISTER]);
  });
});
