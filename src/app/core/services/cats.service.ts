import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Breed, CatImage } from '../models/breed.model';
import { API_ENDPOINTS, QUERY_PARAMS, DEFAULT_QUERY_VALUES } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  private apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  /**
   * Get all cat breeds
   * @param {number} limit - Maximum number of breeds to return
   * @param {number} page - Page number for pagination
   * @returns {Observable} Observable with list of breeds
   */
  getBreeds(
    limit: number = DEFAULT_QUERY_VALUES.LIMIT,
    page: number = DEFAULT_QUERY_VALUES.PAGE
  ): Observable<{ success: boolean; data: Breed[]; count: number }> {
    const params = new HttpParams()
      .set(QUERY_PARAMS.LIMIT, limit.toString())
      .set(QUERY_PARAMS.PAGE, page.toString());

    return this.httpClient.get<{ success: boolean; data: Breed[]; count: number }>(
      `${this.apiUrl}${API_ENDPOINTS.CATS.BREEDS}`,
      { params }
    );
  }

  /**
   * Get a specific breed by ID
   * @param {string} breedId - The breed ID
   * @returns {Observable} Observable with breed details
   */
  getBreedById(breedId: string): Observable<{ success: boolean; data: Breed }> {
    return this.httpClient.get<{ success: boolean; data: Breed }>(
      `${this.apiUrl}${API_ENDPOINTS.CATS.BREED_BY_ID.replace(':id', breedId)}`
    );
  }

  /**
   * Search for cat breeds by query
   * @param {string} query - Search term
   * @param {number} limit - Maximum number of results
   * @param {number} page - Page number for pagination
   * @returns {Observable} Observable with matching breeds
   */
  searchBreeds(
    query: string,
    limit: number = DEFAULT_QUERY_VALUES.LIMIT,
    page: number = DEFAULT_QUERY_VALUES.PAGE
  ): Observable<{ success: boolean; data: Breed[]; count: number }> {
    const params = new HttpParams()
      .set(QUERY_PARAMS.QUERY, query)
      .set(QUERY_PARAMS.LIMIT, limit.toString())
      .set(QUERY_PARAMS.PAGE, page.toString());

    return this.httpClient.get<{ success: boolean; data: Breed[]; count: number }>(
      `${this.apiUrl}${API_ENDPOINTS.CATS.SEARCH_BREEDS}`,
      { params }
    );
  }

  /**
   * Get images of a specific cat breed
   * @param {string} breedId - The breed ID
   * @param {number} limit - Maximum number of images to return
   * @returns {Observable} Observable with breed images
   */
  getImagesByBreedId(
    breedId: string,
    limit: number = DEFAULT_QUERY_VALUES.LIMIT
  ): Observable<{ success: boolean; data: CatImage[]; count: number }> {
    const params = new HttpParams()
      .set(QUERY_PARAMS.BREED_ID, breedId)
      .set(QUERY_PARAMS.LIMIT, limit.toString());

    return this.httpClient.get<{ success: boolean; data: CatImage[]; count: number }>(
      `${this.apiUrl}${API_ENDPOINTS.IMAGES.BY_BREED}`,
      { params }
    );
  }
}
