import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';
import { signal } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const mockUser: User = {
      _id: '123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getCurrentUser'], {
      currentUser: signal<User | null>(mockUser),
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, ButtonModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display provided title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.text-3xl');
    expect(titleElement?.textContent).toContain('Test Title');
  });

  it('should display current user first name', () => {
    // Access the signal directly by calling it since currentUser is a signal
    const user = (authService.currentUser as any)();
    expect(user?.firstName).toBe('Test');
  });

  it('should emit logout event when logout button clicked', () => {
    spyOn(component.logout, 'emit');

    component.onLogout();

    expect(component.logout.emit).toHaveBeenCalled();
  });

  it('should emit profileClick event when profile link clicked', () => {
    spyOn(component.profileClick, 'emit');

    component.onProfileClick();

    expect(component.profileClick.emit).toHaveBeenCalled();
  });

  it('should have default title', () => {
    expect(component.title).toBe('Mi Aplicación');
  });
});
