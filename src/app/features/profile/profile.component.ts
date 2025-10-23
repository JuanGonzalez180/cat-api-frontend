import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { APP_ROUTES } from '../../core/constants/routes.constants';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  /**
   * Injected dependencies
   */
  public authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Navigate to breeds page
   */
  goToBreeds(): void {
    this.router.navigate([APP_ROUTES.BREEDS]);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.LOGIN]);
  }
}
