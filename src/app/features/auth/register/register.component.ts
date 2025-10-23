import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/routes.constants';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  /**
   * Injected dependencies
   */
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Loading state signal
   */
  isLoading = signal(false);

  /**
   * Error message signal
   */
  errorMessage = signal<string | null>(null);

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate([APP_ROUTES.LOGIN]);
  }

  /**
   * Handle register form submission
   */
  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate([APP_ROUTES.BREEDS]);
        } else {
          this.errorMessage.set(response.message);
        }
        this.isLoading.set(false);
      },
      error: (_error) => {
        this.errorMessage.set('Registration failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
