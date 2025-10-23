import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with empty values and validators', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should have validators for all form fields', () => {
    const firstNameControl = component.registerForm.get('firstName');
    const lastNameControl = component.registerForm.get('lastName');
    const emailControl = component.registerForm.get('email');
    const passwordControl = component.registerForm.get('password');

    firstNameControl?.setValue('');
    expect(component.registerForm.invalid).toBe(true);

    firstNameControl?.setValue('John');
    lastNameControl?.setValue('');
    expect(component.registerForm.invalid).toBe(true);

    lastNameControl?.setValue('Doe');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    passwordControl?.setValue('password123');
    expect(component.registerForm.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: '123',
    });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should clear error message when submitting', () => {
    const mockResponse = {
      success: true,
      message: 'User registered successfully',
      user: {
        _id: '123',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      },
      token: 'mock-token',
    };

    authService.register.and.returnValue(of(mockResponse));

    component.errorMessage.set('Previous error');
    component.registerForm.patchValue({
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage()).toBeNull();
  });

  it('should register user and navigate to breeds page on success', (done) => {
    const mockResponse = {
      success: true,
      message: 'User registered successfully',
      user: {
        _id: '123',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      },
      token: 'mock-token',
    };

    authService.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'password123',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
      });
      expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.BREEDS]);
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBeNull();
      done();
    }, 100);
  });

  it('should set error message on registration failure', (done) => {
    const mockResponse = {
      success: false,
      message: 'Email already registered',
    };

    authService.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      firstName: 'Existing',
      lastName: 'User',
      email: 'existing@example.com',
      password: 'password123',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage()).toBe('Email already registered');
      expect(component.isLoading()).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should set error message on registration error', (done) => {
    authService.register.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.registerForm.patchValue({
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'password123',
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.errorMessage()).toBe('Registration failed. Please try again.');
      expect(component.isLoading()).toBe(false);
      done();
    }, 100);
  });

  it('should clear error message when submitting', () => {
    const mockResponse = {
      success: true,
      message: 'User registered successfully',
      user: {
        _id: '123',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      },
      token: 'mock-token',
    };

    authService.register.and.returnValue(of(mockResponse));

    component.errorMessage.set('Previous error');
    component.registerForm.patchValue({
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage()).toBeNull();
  });

  it('should navigate to login page on goToLogin()', () => {
    component.goToLogin();

    expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.LOGIN]);
  });
});
