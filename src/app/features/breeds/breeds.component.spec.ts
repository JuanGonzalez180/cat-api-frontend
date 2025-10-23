import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BreedsComponent } from './breeds.component';
import { CatsService } from '../../core/services/cats.service';
import { AuthService } from '../../core/services/auth.service';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Breed, CatImage } from '../../core/models/breed.model';

describe('BreedsComponent', () => {
  let component: BreedsComponent;
  let fixture: ComponentFixture<BreedsComponent>;
  let catsService: jasmine.SpyObj<CatsService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockBreeds: Breed[] = [
    {
      id: '1',
      name: 'Persian',
      temperament: 'Affectionate, Calm',
      origin: 'Iran',
      description: 'Test Persian cat',
      life_span: '10-17',
      adaptability: 3,
      affection_level: 5,
      child_friendly: 4,
      dog_friendly: 3,
      energy_level: 2,
      grooming: 5,
      health_issues: 4,
      intelligence: 3,
      shedding_level: 5,
      social_needs: 4,
      stranger_friendly: 3,
      vocalisation: 3,
    },
    {
      id: '2',
      name: 'Siamese',
      temperament: 'Intelligent, Vocal',
      origin: 'Thailand',
      description: 'Test Siamese cat',
      life_span: '8-15',
      adaptability: 5,
      affection_level: 5,
      child_friendly: 4,
      dog_friendly: 4,
      energy_level: 5,
      grooming: 2,
      health_issues: 3,
      intelligence: 5,
      shedding_level: 2,
      social_needs: 5,
      stranger_friendly: 5,
      vocalisation: 5,
    },
  ];

  const mockCatImages: CatImage[] = [
    { id: '1', url: 'image1-url', width: 1000, height: 800 },
    { id: '2', url: 'image2-url', width: 1200, height: 900 },
  ];

  beforeEach(async () => {
    const catsServiceSpy = jasmine.createSpyObj('CatsService', [
      'getBreeds',
      'getImagesByBreedId',
      'searchBreeds',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: signal({
        _id: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BreedsComponent,
        FormsModule,
        ButtonModule,
        SelectModule,
        CarouselModule,
        TableModule,
        InputTextModule,
        TabsModule,
        IconFieldModule,
        InputIconModule,
      ],
      providers: [
        { provide: CatsService, useValue: catsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    catsService = TestBed.inject(CatsService) as jasmine.SpyObj<CatsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(BreedsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signals with default values', () => {
    expect(component.breeds()).toEqual([]);
    expect(component.filteredBreeds()).toEqual([]);
    expect(component.selectedBreed()).toBeNull();
    expect(component.breedImages()).toEqual([]);
    expect(component.searchQuery()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('should load breeds on component init', (done) => {
    catsService.getBreeds.and.returnValue(
      of({ success: true, data: mockBreeds, count: 2 })
    );

    component.ngOnInit();

    setTimeout(() => {
      expect(catsService.getBreeds).toHaveBeenCalled();
      expect(component.breeds()).toEqual(mockBreeds);
      expect(component.filteredBreeds()).toEqual(mockBreeds);
      expect(component.isLoading()).toBe(false);
      done();
    }, 100);
  });

  it('should populate breeds when loading is successful', (done) => {
    catsService.getBreeds.and.returnValue(
      of({ success: true, data: mockBreeds, count: 2 })
    );

    component.loadBreeds();

    setTimeout(() => {
      expect(component.breeds()).toEqual(mockBreeds);
      expect(component.filteredBreeds()).toEqual(mockBreeds);
      done();
    }, 100);
  });

  it('should set isLoading to false when breeds are loaded', (done) => {
    catsService.getBreeds.and.returnValue(
      of({ success: true, data: mockBreeds, count: 2 })
    );

    component.loadBreeds();

    setTimeout(() => {
      expect(component.isLoading()).toBe(false);
      done();
    }, 100);
  });

  it('should handle error when loading breeds', (done) => {
    catsService.getBreeds.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.loadBreeds();

    setTimeout(() => {
      expect(component.isLoading()).toBe(false);
      done();
    }, 100);
  });

  it('should select breed and load its images', (done) => {
    const breedToSelect = mockBreeds[0];

    catsService.getImagesByBreedId.and.returnValue(
      of({ success: true, data: mockCatImages, count: 2 })
    );

    component.onBreedSelect(breedToSelect);

    setTimeout(() => {
      expect(component.selectedBreed()).toEqual(breedToSelect);
      expect(catsService.getImagesByBreedId).toHaveBeenCalledWith(breedToSelect.id);
      expect(component.breedImages()).toEqual(mockCatImages);
      done();
    }, 100);
  });

  it('should load breed images by breed ID', (done) => {
    catsService.getImagesByBreedId.and.returnValue(
      of({ success: true, data: mockCatImages, count: 2 })
    );

    component.loadBreedImages('1');

    setTimeout(() => {
      expect(catsService.getImagesByBreedId).toHaveBeenCalledWith('1');
      expect(component.breedImages()).toEqual(mockCatImages);
      done();
    }, 100);
  });

  it('should return all breeds when search query is empty', () => {
    component.breeds.set(mockBreeds);
    component.filteredBreeds.set([]);
    component.searchQuery.set('');

    component.searchBreeds();

    expect(component.filteredBreeds()).toEqual(mockBreeds);
  });

  it('should search breeds by query', (done) => {
    const searchResults = [mockBreeds[0]];

    catsService.searchBreeds.and.returnValue(
      of({ success: true, data: searchResults, count: 1 })
    );

    component.searchQuery.set('Persian');
    component.searchBreeds();

    setTimeout(() => {
      expect(catsService.searchBreeds).toHaveBeenCalledWith('Persian');
      expect(component.filteredBreeds()).toEqual(searchResults);
      done();
    }, 100);
  });

  it('should trim whitespace from search query', () => {
    component.breeds.set(mockBreeds);
    component.filteredBreeds.set([]);
    component.searchQuery.set('   ');

    component.searchBreeds();

    expect(component.filteredBreeds()).toEqual(mockBreeds);
    expect(catsService.searchBreeds).not.toHaveBeenCalled();
  });

  it('should logout user and navigate to login page on logout()', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.LOGIN]);
  });

  it('should navigate to profile page on goToProfile()', () => {
    component.goToProfile();

    expect(router.navigate).toHaveBeenCalledWith([APP_ROUTES.PROFILE]);
  });

  it('should have authService available for template binding', () => {
    expect(component.authService).toBeDefined();
  });
});
