import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselModule } from 'primeng/carousel';
import { BreedDetailComponent } from './breed-detail.component';
import { Breed, CatImage } from '../../../core/models/breed.model';

describe('BreedDetailComponent', () => {
  let component: BreedDetailComponent;
  let fixture: ComponentFixture<BreedDetailComponent>;

  const mockBreed: Breed = {
    id: '1',
    name: 'Persian',
    temperament: 'Affectionate',
    origin: 'Iran',
    description: 'Beautiful cat',
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
  };

  const mockImages: CatImage[] = [
    { id: '1', url: 'image1-url', width: 1000, height: 800 },
    { id: '2', url: 'image2-url', width: 1200, height: 900 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedDetailComponent, CarouselModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BreedDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept breed as input', () => {
    component.breed = mockBreed;
    expect(component.breed).toEqual(mockBreed);
  });

  it('should accept images as input', () => {
    component.images = mockImages;
    expect(component.images.length).toBe(2);
  });

  it('should have null breed by default', () => {
    const newComponent = new BreedDetailComponent();
    expect(newComponent.breed).toBeNull();
  });

  it('should have empty images array by default', () => {
    const newComponent = new BreedDetailComponent();
    expect(newComponent.images).toEqual([]);
  });

  it('should display breed name when breed is provided', () => {
    component.breed = mockBreed;
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('h2');
    expect(nameElement?.textContent).toContain('Persian');
  });

  it('should display breed information', () => {
    component.breed = mockBreed;
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Temperamento');
    expect(text).toContain('Iran');
  });
});
