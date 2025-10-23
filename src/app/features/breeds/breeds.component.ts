import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CatsService } from '../../core/services/cats.service';
import { AuthService } from '../../core/services/auth.service';
import { Breed, CatImage } from '../../core/models/breed.model';
import { APP_ROUTES } from '../../core/constants/routes.constants';

@Component({
  selector: 'app-breeds',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, CarouselModule, TableModule, InputTextModule, TabsModule, IconFieldModule, InputIconModule],
  templateUrl: './breeds.component.html',
  styleUrls: ['./breeds.component.scss']
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
      }
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
      }
    });
  }

  /**
   * Search breeds by query
   */
  searchBreeds(): void {
    const query = this.searchQuery();
    if (!query.trim()) {
      this.filteredBreeds.set(this.breeds());
      return;
    }

    this.catsService.searchBreeds(query).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredBreeds.set(response.data);
        }
      }
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.LOGIN]);
  }

  goToProfile(): void {
    this.router.navigate([APP_ROUTES.PROFILE]);
  }
}
