import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROUTES } from '../../../core/constants/routes.constants';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, InputTextModule, CardModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  /**
   * Injected dependencies
   */
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
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
   * Navigate to register page
   */
  goToRegister(): void {
    this.router.navigate([APP_ROUTES.REGISTER]);
  }

  /**
   * Handle login form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate([APP_ROUTES.BREEDS]);
        } else {
          this.errorMessage.set(response.message);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
