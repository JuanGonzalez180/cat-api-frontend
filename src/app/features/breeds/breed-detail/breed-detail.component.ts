import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { Breed, CatImage } from '../../../core/models/breed.model';

/**
 * Breed Detail Component
 * Componente presentacional (dumb) que muestra los detalles y carrusel de una raza
 * Recibe raza e imágenes como inputs
 */
@Component({
  selector: 'app-breed-detail',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './breed-detail.component.html',
  styleUrls: ['./breed-detail.component.scss'],
})
export class BreedDetailComponent {
  /**
   * Raza seleccionada a mostrar
   */
  @Input() breed: Breed | null = null;

  /**
   * Imágenes de la raza seleccionada
   */
  @Input() images: CatImage[] = [];
}
