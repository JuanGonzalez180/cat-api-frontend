import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../core/services/auth.service';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { signal } from '@angular/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: signal({
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, CardModule, ButtonModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject AuthService', () => {
    expect(component.authService).toBeDefined();
  });

  it('should display current user information', () => {
    const currentUser = component.authService.currentUser();

    expect(currentUser).toBeDefined();
    expect(currentUser?.email).toBe('test@example.com');
    expect(currentUser?.firstName).toBe('Test');
    expect(currentUser?.lastName).toBe('User');
  });

  it('should logout user and navigate to login page on logout()', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.LOGIN]);
  });

  it('should navigate to breeds page on goToBreeds()', () => {
    component.goToBreeds();

    expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.BREEDS]);
  });

  it('should have authService available for template binding', () => {
    expect(component.authService).toBeDefined();
  });
});
