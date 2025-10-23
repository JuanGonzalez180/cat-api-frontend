import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Breed } from '../../../core/models/breed.model';

/**
 * Breed Table Component
 * Componente presentacional (dumb) que muestra tabla de razas
 * Emite evento de búsqueda cuando el usuario busca
 */
@Component({
  selector: 'app-breed-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './breed-table.component.html',
  styleUrls: ['./breed-table.component.scss'],
})
export class BreedTableComponent {
  /**
   * Lista de razas a mostrar en la tabla
   */
  @Input() breeds: Breed[] = [];

  /**
   * Término de búsqueda actual
   */
  @Input() searchQuery: string = '';

  /**
   * Evento emitido cuando se ejecuta la búsqueda
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Manejar búsqueda
   */
  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  /**
   * Manejar cambio en el input de búsqueda
   * @param query Término de búsqueda
   */
  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
  }
}
