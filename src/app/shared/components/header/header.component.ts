import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';

/**
 * Header component - Reutilizable en toda la aplicación
 * Muestra el nombre del usuario, enlace a perfil y botón logout
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * Título del header
   */
  @Input() title: string = 'Mi Aplicación';

  /**
   * Evento emitido cuando el usuario hace logout
   */
  @Output() logout = new EventEmitter<void>();

  /**
   * Evento emitido cuando hace click en perfil
   */
  @Output() profileClick = new EventEmitter<void>();

  /**
   * AuthService inyectado
   */
  authService = inject(AuthService);

  /**
   * Emitir evento de logout
   */
  onLogout(): void {
    this.logout.emit();
  }

  /**
   * Emitir evento de click en perfil
   */
  onProfileClick(): void {
    this.profileClick.emit();
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }
}
