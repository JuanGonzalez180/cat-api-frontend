import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breed } from '../../../core/models/breed.model';

/**
 * Breed Selector Component
 * Componente presentacional (dumb) que muestra dropdown de razas
 * Emite evento cuando selecciona una raza
 */
@Component({
  selector: 'app-breed-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './breed-selector.component.html',
  styleUrls: ['./breed-selector.component.scss'],
})
export class BreedSelectorComponent {
  /**
   * Lista de razas disponibles
   */
  @Input() breeds: Breed[] = [];

  /**
   * Raza actualmente seleccionada
   */
  @Input() selectedBreed: Breed | null = null;

  /**
   * Evento emitido cuando selecciona una raza
   */
  @Output() breedSelected = new EventEmitter<Breed>();

  /**
   * Manejar selección de raza
   * @param breed Raza seleccionada
   */
  onBreedSelect(breed: Breed): void {
    this.breedSelected.emit(breed);
  }
}
