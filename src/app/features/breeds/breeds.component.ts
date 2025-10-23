import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { CatsService } from '../../core/services/cats.service';
import { AuthService } from '../../core/services/auth.service';
import { Breed, CatImage } from '../../core/models/breed.model';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { BreedSelectorComponent } from './breed-selector/breed-selector.component';
import { BreedDetailComponent } from './breed-detail/breed-detail.component';
import { BreedTableComponent } from './breed-table/breed-table.component';

/**
 * Breeds Component - Contenedor
 * Orquesta los componentes hijos: selector, detail, y table
 * Maneja la lógica de negocio y comunicación con servicios
 */
@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    HeaderComponent,
    BreedSelectorComponent,
    BreedDetailComponent,
    BreedTableComponent,
  ],
  templateUrl: './breeds.component.html',
  styleUrls: ['./breeds.component.scss'],
})
export class BreedsComponent implements OnInit {
  /**
   * Injected services
   */
  private catsService = inject(CatsService);
  public authService = inject(AuthService);
  private router = inject(Router);

  /**
   * List of all breeds signal
   */
  breeds = signal<Breed[]>([]);

  /**
   * Filtered breeds signal
   */
  filteredBreeds = signal<Breed[]>([]);

  /**
   * Selected breed signal
   */
  selectedBreed = signal<Breed | null>(null);

  /**
   * Breed images signal
   */
  breedImages = signal<CatImage[]>([]);

  /**
   * Search query signal
   */
  searchQuery = signal('');

  /**
   * Loading state signal
   */
  isLoading = signal(false);

  /**
   * Angular lifecycle hook - OnInit
   */
  ngOnInit(): void {
    this.loadBreeds();
  }

  /**
   * Load all breeds from backend
   */
  loadBreeds(): void {
    this.isLoading.set(true);
    this.catsService.getBreeds().subscribe({
      next: (response) => {
        if (response.success) {
          this.breeds.set(response.data);
          this.filteredBreeds.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Handle breed selection from dropdown
   * @param {Breed} breed - Selected breed
   */
  onBreedSelect(breed: Breed): void {
    this.selectedBreed.set(breed);
    this.loadBreedImages(breed.id);
  }

  /**
   * Load images for selected breed
   * @param {string} breedId - Breed ID
   */
  loadBreedImages(breedId: string): void {
    this.catsService.getImagesByBreedId(breedId).subscribe({
      next: (response) => {
        if (response.success) {
          this.breedImages.set(response.data);
        }
      },
    });
  }

  /**
   * Search breeds by query
   * @param query Search term
   */
  searchBreeds(query: string): void {
    if (!query.trim()) {
      this.filteredBreeds.set(this.breeds());
      return;
    }

    this.catsService.searchBreeds(query).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredBreeds.set(response.data);
        }
      },
    });
  }

  /**
   * Update search query signal
   * @param query New search query
   */
  updateSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.LOGIN]);
  }

  /**
   * Navigate to profile page
   */
  goToProfile(): void {
    this.router.navigate([APP_ROUTES.PROFILE]);
  }
}
